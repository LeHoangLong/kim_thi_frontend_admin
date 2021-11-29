#!/bin/bash
cd /opt/app
npm run build

rm /etc/nginx/conf.d/* 2> /dev/null
envsubst < nginx-prod.template > /etc/nginx/conf.d/default.conf
nginx -s stop
nginx
sleep infinity
