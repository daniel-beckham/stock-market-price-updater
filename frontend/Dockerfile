FROM node:16-alpine as base

# Set the build-time variables
ARG SUBDIRECTORY

# Set the environment variables
ENV SUBDIRECTORY $SUBDIRECTORY

# Change the working directory
WORKDIR /app/frontend

# Copy the package.json file
COPY ./frontend/package.json /app/frontend

# Install the dependencies
RUN npm install --legacy-peer-deps --silent

# Copy the remaining files
COPY ./backend/website/static /app/backend/website/static
COPY ./backend/website/templates /app/backend/website/templates
COPY ./frontend /app/frontend

# Create the production build
RUN npm run build

FROM alpine:latest

# Copy all of the static files, including the production build
COPY --from=base /app/backend/website/static /app/backend/website/static
