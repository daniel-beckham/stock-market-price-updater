from website.models import db, StockInfo, StockInfoSchema


class StockUtils:
    def get_info():
        # Get all of the symbols and names
        stock_info_query = StockInfo.query.all()
        stock_info_schema = StockInfoSchema(many=True)
        stock_info_dump = stock_info_schema.dump(stock_info_query)

        output = {}

        # Put the symbols and names in key/value pairs
        for object in stock_info_dump:
            output[object["symbol"]] = object["name"]

        return output

    def get_name(symbol):
        # Get the name from the symbol
        stock_name = (
            db.session.query(StockInfo.name).filter(StockInfo.symbol == symbol).first()
        )

        return stock_name[0] if stock_name else ""
