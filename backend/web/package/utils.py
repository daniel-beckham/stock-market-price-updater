from package.models import db, StockData, StockDataSchema, StockInfo, StockInfoSchema

def get_all_stock_info():
  # Get all of the symbols and names
  stock_info_query = StockInfo.query.all()
  stock_info_schema = StockInfoSchema(many=True)
  stock_info_dump = stock_info_schema.dump(stock_info_query)

  output = {}

  # Put the symbols and names in key/value pairs
  for object in stock_info_dump:
    output[object['symbol']] = object['name']

  return output

def get_stock_name(symbol):
  stock_name = (db.session
    .query(StockInfo.name)
    .filter(StockInfo.symbol == symbol)
    .first())
  return stock_name[0]
