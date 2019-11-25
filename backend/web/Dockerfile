FROM python:3.8.0-alpine

# Change the working directory
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt /app

# Install the dependencies (the psycopg2 dependencies are deleted in order to keep the size down)
RUN apk update \
    && apk add --virtual build-deps gcc musl-dev python3-dev \
    && apk add postgresql-dev \
	&& pip install --upgrade pip \
    && pip install -r requirements.txt \
    && apk del build-deps

# Copy the remaining files
COPY . /app
