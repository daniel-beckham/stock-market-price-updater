from alpha_vantage.timeseries import TimeSeries
from collections import OrderedDict
from datetime import datetime, timedelta
from flask_apscheduler import APScheduler
from os import getenv
from pytz import timezone

from website.models import db, StockData, StockInfo, StockDataSchema

class UpdateScheduler():
  scheduler = APScheduler()
  ts = None

  def create(self):
    with db.app.app_context():
    # Initialize the database
      self.initialize_db()

      # Initialize the scheduler
      self.scheduler.init_app(db.app)

      # Initialize the AlphaVantage API
      self.ts = TimeSeries(key=db.app.config['ALPHA_VANTAGE_API_KEY'])

      # Add a job to start the update at 5:00 PM EST daily
      self.scheduler.add_job(id='main_job', func=self.update_all, trigger='cron', hour=17, minute=00, timezone='America/New_York')

      # Get the current time
      current_time = datetime.now()

      # Start the update now if the current time is at least 5:00 PM EST but not yet 8:00 AM EST
      if (current_time.hour >= 17) or (current_time.hour < 8):
        self.update_all()
    
    # Start the scheduler
    self.scheduler.start()

  def initialize_db(self):
    with db.app.app_context():
      # Create the tables
      db.create_all()

      # Populate the stock info table
      if not db.session.query(StockInfo).first():
        for stock in db.app.config['STOCK_INFO']:
          if not StockInfo.query.filter(StockInfo.symbol == stock[0]).first():
            db.session.add(StockInfo(symbol=stock[0], name=stock[1]))
            db.session.commit()

  def update_all(self):
    # Update all of the stocks in set intervals
    for index, stock in enumerate(db.app.config['STOCK_INFO'], start=1):
      next_update_time = datetime.now() + timedelta(seconds=db.app.config['STOCK_UPDATE_INTERVAL_IN_SECONDS'] * index)
      self.scheduler.add_job(id=stock[0] + '_job', func=self.update_stock, trigger='date', args=[stock], run_date=next_update_time)

  def update_stock(self, stock):
    with db.app.app_context():

      # Get the stock data from Alpha Vantage and sort it by date
      alpha_vantage_data = OrderedDict(sorted(self.ts.get_daily(stock[0], outputsize='full')[0].items(), reverse=True))
      oldest_date = (datetime.now() - timedelta(days=db.app.config['STOCK_MAX_NUMBER_OF_DAYS'])).strftime('%Y-%m-%d')
      stock_data = []

      # Add the stock data for each day (up to a maximum number of days)
      for item in list(alpha_vantage_data.items())[:db.app.config['STOCK_MAX_NUMBER_OF_DAYS']]:
        if item[0] >= oldest_date and not StockData.query.filter(StockData.symbol == stock[0], StockData.date == item[0]).first():
          stock_data.append(StockData(
            date=item[0],
            symbol=stock[0],
            open=item[1]['1. open'],
            high=item[1]['2. high'],
            low=item[1]['3. low'],
            close=item[1]['4. close'],
            volume=item[1]['5. volume']
          ))

      if stock_data:
        stock_data.reverse()
        db.session.bulk_save_objects(stock_data)
        db.session.commit()

      # Delete the old stock data
      db.session.query(StockData).filter(StockData.date < oldest_date).delete()
      db.session.commit()
