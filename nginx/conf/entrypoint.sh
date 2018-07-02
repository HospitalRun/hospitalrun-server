#!/usr/bin/env bash
rm /etc/nginx/conf.d/*.conf
if [ "$ENCRYPTION_TYPE" = "auto" ]; then
	if [ ! -f /etc/letsencrypt/live/${DOMAIN_NAME}/cert.pem ]; then
		mkdir -p /var/log/letsencrypt && touch /var/log/letsencrypt/install.log \
		&& certbot-auto certonly --standalone --non-interactive --agree-tos --email admin@${DOMAIN_NAME} -d ${DOMAIN_NAME} 2>&1 | tee /var/log/letsencrypt/install.log
	fi \
	&& (crontab -l 2>/dev/null; echo "30 2 * * 1 /usr/bin/certbot-auto renew --quiet --no-self-upgrade >> /var/log/letsencrypt/le-renew.log") | crontab - \
	&& cp /etc/nginx/conf.d/defaultautossl /etc/nginx/conf.d/defaultautossl.conf
elif [ "$ENCRYPTION_TYPE" = "self" ]; then
    	cp /etc/nginx/conf.d/defaultselfssl /etc/nginx/conf.d/defaultselfssl.conf
elif [ "$ENCRYPTION_TYPE" = "none" ]; then
   	cp /etc/nginx/conf.d/default /etc/nginx/conf.d/default.conf
fi
nginx -g "daemon off;"
