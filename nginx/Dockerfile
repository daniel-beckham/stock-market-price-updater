FROM nginx:1.17-alpine

# Remove the default.conf file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx.conf file
COPY nginx.conf /etc/nginx/conf.d
