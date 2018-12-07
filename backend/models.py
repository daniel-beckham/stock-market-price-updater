from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

# Initialize SQLAlchemy and Marshmallow
db = SQLAlchemy()
ma = Marshmallow()

# Stock data model
class StockData(db.Model):
  __tablename__ = 'stock_data'
  id = db.Column('id', db.Integer, primary_key=True)
  symbol = db.Column('symbol', db.String)
  date = db.Column('date', db.Date)
  open = db.Column('open', db.Float)
  high = db.Column('high', db.Float)
  low = db.Column('low', db.Float)
  close = db.Column('close', db.Float)
  volume = db.Column('volume', db.BigInteger)

# Stock data schema
class StockDataSchema(ma.ModelSchema):
  class Meta:
    model = StockData

# Stock info model
class StockInfo(db.Model):
  __tablename__ = 'stock_info'
  symbol = db.Column('symbol', db.String, primary_key=True)
  name = db.Column('name', db.String)

# Stock info schema
class StockInfoSchema(ma.ModelSchema):
  class Meta:
    model = StockInfo
