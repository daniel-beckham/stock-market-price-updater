from flask import Blueprint, jsonify, render_template, request, send_from_directory
from os import path
from sqlalchemy import desc, or_

from backend.models import db, StockData, StockDataSchema, StockInfo, StockInfoSchema
from backend.utils import get_all_stock_info, get_stock_name

# General routes

general = Blueprint('general', __name__)

@general.route('/', defaults={ 'path': '' })
@general.route('/<path:path>')
def catch_all(path):
  return render_template('index.html')

@general.route('/favicon.ico')
def favicon():
  return send_from_directory(path.join(general.root_path, 'static'), 'img/favicon.ico')

# Stock data API routes

stock_data_api = Blueprint('stock_data_api', __name__)

@stock_data_api.route('/stock-data/<symbol>')
def stock_data_symbol(symbol):
  # Get all of the data for the stock
  stock_data_query = (StockData.query
    .filter(StockData.symbol == symbol)
    .order_by(StockData.date.desc()))
  stock_data_schema = StockDataSchema(many=True, exclude=(['symbol']))
  stock_data_dump = stock_data_schema.dump(stock_data_query).data

  # Put the name of the stock alongside the data in the output
  output = {
    'name': get_stock_name(symbol),
    'data': stock_data_dump
  }

  return jsonify(output)

@stock_data_api.route('/stock-data/<symbol>/latest')
def stock_data_symbol_latest(symbol):
  # Get the last two days of data for the stock
  stock_data_query = (StockData.query
    .filter(StockData.symbol == symbol)
    .order_by(StockData.date.desc())
    .limit(2)
    .all())
  stock_data_schema = StockDataSchema(many=True, exclude=(['symbol']))
  stock_data_dump = stock_data_schema.dump(stock_data_query).data

  output = {}

  # Check if the stock has two days of data
  if len(stock_data_dump) == 2:
    # Calculate the change and percent change for the stock
    stock_data_dump[0]['change'] = round(stock_data_dump[0]['close'] - stock_data_dump[1]['close'], 2)
    stock_data_dump[0]['percent_change'] = round((stock_data_dump[0]['change'] / stock_data_dump[1]['close']) * 100, 2)

    # Get the name of the stock and include it in the output
    stock_data_dump[0]['name'] = get_stock_name(symbol)

    # Only include the latest day with the above calculations in the output
    output = stock_data_dump[0]

  return jsonify(output)

@stock_data_api.route('/stock-data/all/latest')
def stock_data_all_latest():
  # Get the last two days of data for each stock
  symbol_subquery = (db.session
    .query(StockData.symbol)
    .subquery())
  stock_data_subquery = (db.session
    .query(StockData, db.func.row_number().over(partition_by=StockData.symbol, order_by=StockData.date.desc()).label('n'))
    .filter(StockData.symbol.in_(symbol_subquery)).subquery())
  stock_data_query = (db.session
    .query(stock_data_subquery)
    .filter(stock_data_subquery.c.n <= 2))
  stock_data_schema = StockDataSchema(many=True)
  stock_data_dump = stock_data_schema.dump(stock_data_query).data

  # Get all of the symbols and names
  stock_info = get_all_stock_info()

  grouped_output = {}
  final_output = []

  for object in stock_data_dump:
    # Group the stocks by their symbols
    grouped_output.setdefault(object['symbol'], []).append(object)

    # Get the grouped stock
    pair = grouped_output[object['symbol']]

    # Check if the grouped stock has two days of data
    if len(pair) == 2:
      # Calculate the change and percent change for the stock
      pair[0]['change'] = round(pair[0]['close'] - pair[1]['close'], 2)
      pair[0]['percent_change'] = round((pair[0]['change'] / pair[1]['close']) * 100, 2)
      pair[0]['name'] = stock_info[object['symbol']]

      # Only include the latest day with the above calculations in the output
      final_output.append(pair[0])

  return jsonify(final_output)

# Stock info API routes

stock_info_api = Blueprint('stock_info_api', __name__)

@stock_info_api.route('/stock-info')
def stock_info():
  return jsonify(get_all_stock_info())

@stock_info_api.route('/stock-info/filter')
def stock_info_search():
  query = request.args.get('q')

  # Get the stocks matching either the symbol or the name specified in the request parameter
  stock_info_query = StockInfo.query.filter(or_(
    db.func.lower(StockInfo.symbol).contains(db.func.lower(query)),
    db.func.lower(StockInfo.name).like(db.func.lower('%{}%'.format(query)))
  ))
  stock_info_schema = StockInfoSchema(many=True)
  stock_info_dump = stock_info_schema.dump(stock_info_query).data

  output = {}
  output['results'] = []

  # Put the data in the format required by Semantic UI
  for object in stock_info_dump:
    result = {}

    result['title'] = object['symbol']
    result['description'] = object['name']
    output['results'].append(result)

  return jsonify(output)
