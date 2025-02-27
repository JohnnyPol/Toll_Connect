# Build Stage
FROM denoland/deno:alpine AS build
WORKDIR /app
COPY deno.json ./
RUN deno cache deno.json
COPY . ./
RUN deno run build

# Production Stage
ARG APACHE_VERSION=""
FROM httpd:alpine AS production

RUN apk update; \
    apk upgrade;

COPY --from=build /app/dist /var/www/html

# Copy apache vhost file to proxy php requests to php-fpm container
COPY demo.apache.conf /usr/local/apache2/conf/demo.apache.conf
RUN echo "Include /usr/local/apache2/conf/demo.apache.conf" \
    >> /usr/local/apache2/conf/httpd.conf

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

RUN { \
  echo 'IncludeOptional conf.d/*.conf'; \
} >> /usr/local/apache2/conf/httpd.conf \
  && mkdir /usr/local/apache2/conf.d
