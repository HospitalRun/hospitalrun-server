FROM nginx:1.11.10
LABEL Maintainer Mofesola Babalola <me@mofesola.com>

ARG DOMAIN_NAME

RUN apt-get -y update && apt-get install -y cron

COPY conf/certbot-auto /usr/bin/
RUN  certbot-auto --os-packages-only --non-interactive

ENV DOMAIN_NAME $DOMAIN_NAME

WORKDIR /etc/nginx
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/default.conf.tmpl /etc/nginx/conf.d/default.conf.tmpl
COPY conf/defaultssl.conf.tmpl /etc/nginx/conf.d/defaultssl.conf.tmpl
COPY conf/entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh
RUN envsubst < /etc/nginx/conf.d/default.conf.tmpl > /etc/nginx/conf.d/default.conf \
        && envsubst < /etc/nginx/conf.d/defaultssl.conf.tmpl > /etc/nginx/conf.d/defaultssl.conf

ENTRYPOINT /etc/nginx/entrypoint.sh
EXPOSE 80 443
