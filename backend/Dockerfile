FROM python:3.8-slim

# Set the build-time variables
ARG SUBDIRECTORY

# Set the environment variables
ENV SUBDIRECTORY $SUBDIRECTORY

# Change the working directory
WORKDIR /app/backend

# Copy the requirements.txt file
COPY ./backend/requirements.txt /app/backend

# Install the dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the remaining files
COPY ./backend/ /app/backend
