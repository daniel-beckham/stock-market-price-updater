# Stock Market Price Updater
### [Live Demo](https://danielbeckham.com/stock-market-price-updater)

This is a web app that retrieves the latest stock prices on a daily basis and allows the data to be viewed as a series of interactive charts.

The back end is powered by [Flask](https://palletsprojects.com/p/flask/) and uses the [Alpha Vantage](https://www.alphavantage.co/) API to store the stock prices in a PostgreSQL database. The front end is built with [React](https://reactjs.org/) and a number of other supporting JavaScript libraries, including [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/).

The app has been configured primarily for use with Docker Compose, but it can also be set up manually. Instructions for deploying it on both Google App Engine and AWS Elastic Beanstalk have been provided as well.

## Docker Compose Instructions
* Provide the required information in the `.env` file.
* Build and start the app:
  ```
  docker-compose up
  ```

## Manual Setup Instructions
### Front End
* Navigate to the front end directory (`cd frontend`). 
* Install the dependencies:
  ```
  npm install
  ```
* Create the production build so that the static files can be served by the back end:
  ```
  npm run build
  ```

### Back End
#### Local Server
* Navigate to the back end directory (`cd backend`).
* Create and activate a virtualenv, and then install the requirements:
  ```
  python -m pip install -r requirements.txt
  ```
* Install and configure PostgreSQL.
* Provide the required information in the `config.py` file in the `website` directory.
* Start the Flask server:
  ```
  python main.py
  ```

#### Google App Engine
* On the Google Cloud Platform Console, create a Cloud SQL PostgreSQL instance.
* Navigate to the back end directory (`cd backend`).
* Create an `app.yaml` file in this directory for serving the static files:
  ```
  runtime: python38
  handlers:
  - url: /static
    static_dir: website/static
  - url: /.*
    script: auto
  ```
* Replace the PostgreSQL-specific contents of the `config.py` file in the `website` directory with the following:
  ```
  POSTGRES_USER = 'username'
  POSTGRES_PASSWORD = 'password'
  POSTGRES_HOST = 'host'
  POSTGRES_PORT = port
  POSTGRES_DB = 'database'
  POSTGRES_INSTANCE = 'project:region:instance'
  ```
  Edit the values as necessary in order to provide the required information.
* Ensure that the production build from the front end has been created.
* Deploy the app.

#### AWS Elastic Beanstalk
* On the AWS Management Console, create a new Elastic Beanstalk web server environment. Choose Python as the preconfigured platform, and add an Amazon RDS PostgreSQL database to the environment.
* Go to Configuration and then Software. Under Container Options, change WSGIPath to `main.py`. Under Static Files, add a field for `/static/` (Path) and `website/static/` (Directory).
* Navigate to the back end directory (`cd backend`).
* Replace the PostgreSQL-specific contents of the `config.py` file in the `website` directory with the following:
  ```
  POSTGRES_USER = os.environ['RDS_USERNAME']
  POSTGRES_PASSWORD = os.environ['RDS_PASSWORD']
  POSTGRES_HOST = os.environ['RDS_HOSTNAME']
  POSTGRES_PORT = os.environ['RDS_PORT']
  POSTGRES_DB = os.environ['RDS_DB_NAME']
  ```
* Ensure that the production build has been created.
* Deploy the app.
