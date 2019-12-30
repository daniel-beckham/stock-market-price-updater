from flask import Flask, Blueprint
from os import getenv
from pathlib import Path

from website.models import db, ma
from website.routes import general, stock_data_api, stock_info_api
from website.schedulers import UpdateScheduler

def create_app():
  # Initialize Flask
  app = Flask(__name__, static_url_path=getenv('SUBDIRECTORY', '') + '/static', template_folder='static')
  app.config.from_pyfile('config.py')
  app.url_map.strict_slashes = False

  # Get the database settings
  postgres = {
    'username': app.config['POSTGRES_USER'],
    'password': app.config['POSTGRES_PASSWORD'],
    'host': app.config['POSTGRES_HOST'],
    'port': app.config['POSTGRES_PORT'],
    'database': app.config['POSTGRES_DB'],
    'instance': app.config.get('POSTGRES_INSTANCE', '')
  }

  # Connect to the database
  if getenv('GOOGLE_CLOUD_PROJECT', '') != '':
    # For connecting once deployed to Google Cloud Platform
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

  blueprint_subdirectory = getenv('SUBDIRECTORY')

  # Register the blueprints
  app.register_blueprint(general, url_prefix=blueprint_subdirectory)
  app.register_blueprint(stock_data_api, url_prefix=blueprint_subdirectory)
  app.register_blueprint(stock_info_api, url_prefix=blueprint_subdirectory)

  db.app = app

  # Create the update scheduler
  update_scheduler = UpdateScheduler()
  update_scheduler.create()

  return app
