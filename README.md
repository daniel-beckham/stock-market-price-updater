# Stock Market Price Updater
### [Live Demo](http://stock-market-price-updater.us-east-2.elasticbeanstalk.com/)

This is a web app that retrieves daily stock prices and also allows two years of historical data to be viewed for each stock. It is powered by Flask and React and uses the [Alpha Vantage](https://www.alphavantage.co/) API to store the stock prices in a PostgreSQL database.

## Instructions
This app is separated into two components: the front end (Flask) and the back end (React). It is also configured for use on both Google App Engine and AWS Elastic Beanstalk. Follow the instructions below in order to use and deploy it.

### Back End
* Create and activate a virtualenv, and then install the requirements:
  ```
  python -m pip install -r requirements.txt
  ```
* Start the Flask server:
  ```
  python main.py
  ```

### Front End
* Navigate to the front end directory (`cd frontend`). 
* Install the dependencies:
  ```
  npm install
  ```
* Start the Webpack Dev Server:
  ```
  npm run start
  ```
* To see the latest version of the page, open http://localhost:8081 in a browser window. Note that some pages pages will not be operational until the database is created and the app is deployed for the first time.
* When ready to deploy, create the production build:
  ```
  npm run build
  ```

### Google App Engine
* On the Google Cloud Platform Console, create a Cloud SQL PostgreSQL instance.
* Create a `config.py` file in the `backend` directory with the following contents:
  ```
  POSTGRES_USERNAME = 'username'
  POSTGRES_PASSWORD = 'password'
  POSTGRES_HOST = 'host'
  POSTGRES_PORT = port
  POSTGRES_DATABASE = 'database'
  POSTGRES_INSTANCE = 'project:region:instance'
  ALPHA_VANTAGE_API_KEY = 'key'
  ```
  Edit the values as necessary in order to supply the correct database and Alpha Vantage information.
* Deploy the app.

### AWS Elastic Beanstalk
* On the AWS Console, create a new Elastic Beanstalk web server environment. Choose Python as the preconfigured platform, and add an Amazon RDS PostgreSQL database to the environment.
* Go to Configuration and then Software. Under Container Options, change WSGIPath to `main.py`. Under Static Files, add a field for `/static/` (Path) and `backend/static/` (Directory).
* Create a `config.py` file in the `backend` directory with the following contents:
  ```
  import os

  POSTGRES_USERNAME = os.environ['RDS_USERNAME']
  POSTGRES_PASSWORD = os.environ['RDS_PASSWORD']
  POSTGRES_HOST = os.environ['RDS_HOSTNAME']
  POSTGRES_PORT = os.environ['RDS_PORT']
  POSTGRES_DATABASE = os.environ['RDS_DB_NAME']
  ALPHA_VANTAGE_API_KEY = 'key'
  ```
  Edit the value corresponding to the Alpha Vantage API key.
* Deploy the app.
