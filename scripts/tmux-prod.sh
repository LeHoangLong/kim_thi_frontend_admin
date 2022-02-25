#!/bin/bash
cd /opt/app
rm /etc/nginx/conf.d/* 2> /dev/null
envsubst < nginx-prod.template > /etc/nginx/conf.d/default.conf
nginx
sleep infinity
