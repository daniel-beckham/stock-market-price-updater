import os

ALPHA_VANTAGE_API_KEY = os.environ["ALPHA_VANTAGE_API_KEY"]
POSTGRES_USER = os.environ["POSTGRES_USER"]
POSTGRES_PASSWORD = os.environ["POSTGRES_PASSWORD"]
POSTGRES_HOST = os.environ["POSTGRES_HOST"]
POSTGRES_PORT = os.environ["POSTGRES_PORT"]
POSTGRES_DB = os.environ["POSTGRES_DB"]

STOCK_INFO = [
    ("AAPL", "Apple"),
    ("AMGN", "Amgen, Inc."),
    ("AXP", "American Express Company"),
    ("BA", "The Boeing Company"),
    ("CAT", "Caterpillar Inc."),
    ("CRM", "Salesforce.com, Inc."),
    ("CSCO", "Cisco Systems, Inc."),
    ("CVX", "Chevron Corporation"),
    ("DIS", "The Walt Disney Company"),
    ("DOW", "Dow Inc."),
    ("GS", "The Goldman Sachs Group, Inc."),
    ("HD", "The Home Depot, Inc."),
    ("HON", "Honeywell International Inc."),
    ("IBM", "International Business Machines Corporation"),
    ("INTC", "Intel Corporation"),
    ("JNJ", "Johnson & Johnson"),
    ("JPM", "JPMorgan Chase & Co."),
    ("KO", "The Coca-Cola Company"),
    ("MCD", "McDonald's Corporation"),
    ("MMM", "3M Company"),
    ("MRK", "Merck & Co., Inc."),
    ("MSFT", "Microsoft Corporation"),
    ("NKE", "NIKE, Inc."),
    ("PG", "The Procter & Gamble Company"),
    ("TRV", "The Travelers Companies, Inc."),
    ("UNH", "UnitedHealth Group Incorporated"),
    ("V", "Visa Inc."),
    ("VZ", "Verizon Communications Inc."),
    ("WBA", "Walgreens Boots Alliance, Inc."),
    ("WMT", "Walmart Inc."),
]
STOCK_MAX_NUMBER_OF_DAYS = 730
STOCK_UPDATE_INTERVAL_IN_SECONDS = 20
