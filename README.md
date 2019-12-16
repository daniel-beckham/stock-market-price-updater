# Stock Market Price Updater
### [Live Demo](https://danielbeckham.com/stock-market-price-updater)

This is a web app that retrieves daily stock prices and also allows two years of historical data to be viewed for each stock. It is powered by Flask and React and uses the [Alpha Vantage](https://www.alphavantage.co/) API to store the stock prices in a PostgreSQL database.

## Instructions
This app is separated into two components: the front end (Flask) and the back end (React). The back end is configured primarily for use with Docker Compose, but there are also instructions for deploying it on both Google App Engine and AWS Elastic Beanstalk.

## Front End
* Navigate to the front end directory (`cd frontend`). 
* Install the dependencies:
  ```
  npm install
  ```
* Create the production build so that the static files can be served by the back end:
  ```
  npm run build
  ```

## Back End
### Docker Compose
* Navigate to the back end directory (`cd backend`).
* Supply the correct database and Alpha Vantage information in the `.env` file.
* Configure, build, and start the app:
  ```
  docker-compose up
  ```

### Google App Engine
* On the Google Cloud Platform Console, create a Cloud SQL PostgreSQL instance.
* Navigate to the back end directory containing the Flask files (`cd backend/web`).
* Replace the contents of the `config.py` file in the `package` directory with the following:
  ```
  POSTGRES_USER = 'username'
  POSTGRES_PASSWORD = 'password'
  POSTGRES_HOST = 'host'
  POSTGRES_PORT = port
  POSTGRES_DB = 'database'
  POSTGRES_INSTANCE = 'project:region:instance'
  ALPHA_VANTAGE_API_KEY = 'key'
  ```
  Edit the values as necessary in order to supply the correct database and Alpha Vantage information.
* Deploy the app.

### AWS Elastic Beanstalk
* On the AWS Management Console, create a new Elastic Beanstalk web server environment. Choose Python as the preconfigured platform, and add an Amazon RDS PostgreSQL database to the environment.
* Go to Configuration and then Software. Under Container Options, change WSGIPath to `main.py`. Under Static Files, add a field for `/static/` (Path) and `package/static/` (Directory).
* Navigate to the back end directory containing the Flask files (`cd backend/web`).
* Replace the contents of the `config.py` file in the `package` directory with the following:
  ```
  import os

  POSTGRES_USER = os.environ['RDS_USERNAME']
  POSTGRES_PASSWORD = os.environ['RDS_PASSWORD']
  POSTGRES_HOST = os.environ['RDS_HOSTNAME']
  POSTGRES_PORT = os.environ['RDS_PORT']
  POSTGRES_DB = os.environ['RDS_DB_NAME']
  ALPHA_VANTAGE_API_KEY = 'key'
  ```
  Edit the value corresponding to the Alpha Vantage API key.
* Deploy the app.

### Manual Configuration
* Navigate to the back end directory containing the Flask files (`cd backend/web`).
* Create and activate a virtualenv, and then install the requirements:
  ```
  python -m pip install -r requirements.txt
  ```
* Install and configure PostgreSQL.
* Supply the correct database and Alpha Vantage information in the `config.py` file in the `package` directory.
* Start the Flask server:
  ```
  python main.py
  ```
