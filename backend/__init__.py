from flask import Flask, Blueprint
from os import getenv
from pathlib import Path

from backend.models import db, ma
from backend.routes import general, stock_data_api, stock_info_api
from backend.schedulers import UpdateScheduler

# Initialize Flask
app = Flask(__name__, template_folder='static')
app.config.from_pyfile('config.py')
app.url_map.strict_slashes = False

# Get the database settings
postgres = {
  'username': app.config['POSTGRES_USERNAME'],
  'password': app.config['POSTGRES_PASSWORD'],
  'host': app.config['POSTGRES_HOST'],
  'port': app.config['POSTGRES_PORT'],
  'database': app.config['POSTGRES_DATABASE'],
  'instance': app.config['POSTGRES_INSTANCE']
}

# Connect to the database
if getenv('GOOGLE_CLOUD_PROJECT', '') is not '':
  # For connecting once deployed
  app.config['SQLALCHEMY_DATABASE_URI'] = ('postgresql+psycopg2://{username}:'
    '{password}@/{database}?host=/cloudsql/{instance}').format(**postgres)
else:
  # For connecting locally
  app.config['SQLALCHEMY_DATABASE_URI'] = ('postgresql+psycopg2://{username}:'
    '{password}@{host}:{port}/{database}').format(**postgres)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the app to be used with SQLAlchemy and Marshmallow
db.init_app(app)
ma.init_app(app)

# Register the blueprints
app.register_blueprint(general)
app.register_blueprint(stock_data_api)
app.register_blueprint(stock_info_api)

# Create the update scheduler if the app is deployed
if getenv('GOOGLE_CLOUD_PROJECT', '') is not '':
  update_scheduler = UpdateScheduler()
  update_scheduler.create(app)
