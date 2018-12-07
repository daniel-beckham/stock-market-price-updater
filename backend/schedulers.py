from alpha_vantage.timeseries import TimeSeries
from apscheduler.schedulers.background import BackgroundScheduler
from collections import OrderedDict
from datetime import datetime, timedelta
from os import getenv

from backend.models import db, StockData, StockInfo, StockDataSchema

class UpdateScheduler:
  max_days_per_stock = 730
  update_interval = 20

  stocks = [
    ('AAPL', 'Apple Inc.'),
    ('AXP', 'American Express Company'),
    ('BA', 'The Boeing Company'),
    ('CAT', 'Caterpillar Inc.'),
    ('CSCO', 'Cisco Systems, Inc.'),
    ('CVX', 'Chevron Corporation'),
    ('DIS', 'The Walt Disney Company'),
    ('DJI', 'Dow Jones Industrial Average'),
    ('DWDP', 'DowDuPont Inc.'),
    ('GS', 'The Goldman Sachs Group, Inc.'),
    ('HD', 'The Home Depot, Inc.'),
    ('IBM', 'International Business Machines Corporation'),
    ('INTC', 'Intel Corporation'),
    ('JNJ', 'Johnson & Johnson'),
    ('JPM', 'JPMorgan Chase & Co.'),
    ('KO', 'The Coca-Cola Company'),
    ('MCD', 'McDonald\'s Corporation'),
    ('MMM', '3M Company'),
    ('MRK', 'Merck & Co., Inc.'),
    ('MSFT', 'Microsoft Corporation'),
    ('NKE', 'NIKE, Inc.'),
    ('PFE', 'Pfizer Inc.'),
    ('PG', 'The Procter & Gamble Company'),
    ('TRV', 'The Travelers Companies, Inc.'),
    ('UNH', 'UnitedHealth Group Incorporated'),
    ('UTX', 'United Technologies Corporation'),
    ('V', 'Visa Inc.'),
    ('VZ', 'Verizon Communications Inc.'),
    ('WBA', 'Walgreens Boots Alliance, Inc.'),
    ('WMT', 'Walmart Inc.'),
    ('XOM', 'Exxon Mobil Corporation')
  ]

  scheduler = BackgroundScheduler(daemon=True)
  ts = None

  def create(self, app):
    # Initialize the database
    self.initialize_db(app)

    # Initialize the AlphaVantage API
    self.ts = TimeSeries(key=app.config['ALPHA_VANTAGE_API_KEY'])

    # Start the scheduler
    self.scheduler.add_job(self.update_all, 'cron', [app], hour=17, minute=30, timezone='America/New_York')
    self.scheduler.start()

  def initialize_db(self, app):
    with app.app_context():
      # Create the tables
      db.create_all()

      # Populate the stock info table
      if not db.session.query(StockInfo).first():
        for stock in self.stocks:
          if not StockInfo.query.filter(StockInfo.symbol == stock[0]).first():
            db.session.add(StockInfo(symbol=stock[0], name=stock[1]))
            db.session.commit()

  def update_all(self, app):
    # Update all of the stocks in set intervals
    for index, stock in enumerate(self.stocks, start=1):
      next_update_time = datetime.now() + timedelta(seconds=self.update_interval * index)
      self.scheduler.add_job(self.update_stock, 'date', [app, stock], run_date=next_update_time)

  def update_stock(self, app, stock):
    with app.app_context():
      # Get the stock data from Alpha Vantage and sort it by date
      alpha_vantage_data = OrderedDict(sorted(self.ts.get_daily(stock[0], outputsize='full')[0].items(), reverse=True))
      oldest_date = (datetime.now() - timedelta(days=self.max_days_per_stock)).strftime('%Y-%m-%d')
      stock_data = []

      # Add the stock data for each day (up to a maximum number of days)
      for item in list(alpha_vantage_data.items())[:self.max_days_per_stock]:
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
