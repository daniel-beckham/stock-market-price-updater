# Stock Market Price Updater
### [Live Demo](https://stock-market-price-updater.appspot.com/)

This is a web app that retrieves daily stock prices and also stores two years of historical data for each stock. It is powered by Flask and React and uses the [Alpha Vantage](https://www.alphavantage.co/) API to store the prices in a PostgreSQL database.

## Instructions
This app is separated into two components: the front end (Flask) and the back end (React). It is also configured for use on Google App Engine. Follow the instructions below in order to use and deploy it.

### Back End
* Create and activate a virtualenv, and then install the requirements: `python -m pip install -r requirements.txt`
* Start the Flask server: `python main.py`

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
  npm run build`
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
  Edit the values as necessary in order to supply the correct database and Alpha Vantage information.
  ```
* Deploy the app:
  ```
  gcloud app deploy
  ```
