from flask import Blueprint, jsonify, render_template, request, send_from_directory
from os import path
from sqlalchemy import desc, or_
from werkzeug import utils

from website.models import db, StockData, StockDataSchema, StockInfo, StockInfoSchema
from website.utils import StockUtils


# General routes
general_blueprint = Blueprint("general_blueprint", __name__)


@general_blueprint.route("/", defaults={"path": ""})
@general_blueprint.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")


@general_blueprint.route("/favicon.ico")
def favicon():
    return send_from_directory(
        path.join(general_blueprint.root_path, "static"), "img/favicon.ico"
    )


# Stock data API routes
stock_data_blueprint = Blueprint("stock_data_blueprint", __name__)


@stock_data_blueprint.route("/stock/<symbol>")
def get_stock_data(symbol):
    # Get all of the data for the stock
    stock_data_query = StockData.query.filter(StockData.symbol == symbol).order_by(
        StockData.date.desc()
    )
    stock_data_schema = StockDataSchema(many=True, exclude=(["symbol"]))
    stock_data_dump = stock_data_schema.dump(stock_data_query)

    # Put the name of the stock alongside the data in the output
    output = {"name": StockUtils.get_name(symbol), "data": stock_data_dump}

    return jsonify(output)


@stock_data_blueprint.route("/stock/<symbol>/latest")
def get_latest_stock_data(symbol):
    # Get the last two days of data for the stock
    stock_data_query = (
        StockData.query.filter(StockData.symbol == symbol)
        .order_by(StockData.date.desc())
        .limit(2)
        .all()
    )
    stock_data_schema = StockDataSchema(many=True, exclude=(["symbol"]))
    stock_data_dump = stock_data_schema.dump(stock_data_query)

    output = {}

    # Check if the stock has two days of data
    if len(stock_data_dump) == 2:
        # Calculate the change for the stock
        stock_data_dump[0]["change"] = round(
            stock_data_dump[0]["close"] - stock_data_dump[1]["close"], 2
        )

        # Calculate the percent change for the stock
        if stock_data_dump[1]["close"] > 0.0:
            stock_data_dump[0]["percent_change"] = round(
                (stock_data_dump[0]["change"] / stock_data_dump[1]["close"]) * 100, 2
            )
        else:
            stock_data_dump[0]["percent_change"] = 0.0

        stock_data_dump[0]["name"] = StockUtils.get_name(symbol)

        # Only include the latest day in the output
        output = stock_data_dump[0]

    return jsonify(output)


@stock_data_blueprint.route("/stocks")
def get_stocks_data():
    # Get all of the data for each stock
    stock_data_query = StockData.query.all()
    stock_data_schema = StockDataSchema(many=True)
    stock_data_dump = stock_data_schema.dump(stock_data_query)

    return jsonify(stock_data_dump)


@stock_data_blueprint.route("/stocks/latest")
def get_latest_stocks_data():
    # Get the last two days of data for each stock
    symbol_subquery = db.session.query(StockData.symbol).subquery()
    stock_data_subquery = (
        db.session.query(
            StockData,
            db.func.row_number()
            .over(partition_by=StockData.symbol, order_by=StockData.date.desc())
            .label("n"),
        )
        .filter(StockData.symbol.in_(symbol_subquery))
        .subquery()
    )
    stock_data_query = db.session.query(stock_data_subquery).filter(
        stock_data_subquery.c.n <= 2
    )
    stock_data_schema = StockDataSchema(many=True)
    stock_data_dump = stock_data_schema.dump(stock_data_query)

    # Get all of the symbols and names
    stock_info = StockUtils.get_info()

    grouped_output = {}
    final_output = []

    for object in stock_data_dump:
        # Group the stocks by their symbols
        grouped_output.setdefault(object["symbol"], []).append(object)

        # Get the grouped stock
        pair = grouped_output[object["symbol"]]

        # Check if the grouped stock has two days of data
        if len(pair) == 2:
            # Calculate the change for the stock
            pair[0]["change"] = round(pair[0]["close"] - pair[1]["close"], 2)

            # Calculate the percent change for the stock
            if pair[1]["close"] > 0.0:
                pair[0]["percent_change"] = round(
                    (pair[0]["change"] / pair[1]["close"]) * 100, 2
                )
            else:
                pair[0]["percent_change"] = 0.0

            # Get the name of the stock from the symbol
            name = (
                stock_info[object["symbol"]]
                if object["symbol"] in stock_info
                else object["symbol"]
            )
            pair[0]["name"] = name

            # Only include the latest day in the output
            final_output.append(pair[0])

    return jsonify(final_output)


# Stock info API routes
stock_info_blueprint = Blueprint("stock_info_blueprint", __name__)


@stock_info_blueprint.route("/")
def get_stock_info():
    return jsonify(StockUtils.get_info())


@stock_info_blueprint.route("/filter")
def get_stock_info_filter():
    query = request.args.get("q")

    # Get the stocks matching either the symbol or the name specified in the request parameter
    stock_info_query = StockInfo.query.filter(
        or_(
            db.func.lower(StockInfo.symbol).contains(db.func.lower(query)),
            db.func.lower(StockInfo.name).like(db.func.lower("%{}%".format(query))),
        )
    )
    stock_info_schema = StockInfoSchema(many=True)
    stock_info_dump = stock_info_schema.dump(stock_info_query)

    output = {}
    output["results"] = []

    # Put the data in the format required by Semantic UI
    for object in stock_info_dump:
        result = {}

        result["title"] = object["symbol"]
        result["description"] = object["name"]
        output["results"].append(result)

    return jsonify(output)
