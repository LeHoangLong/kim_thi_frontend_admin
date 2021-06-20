#!/bin/bash
cd /opt/app
npm install
npm rebuild node-sass
nginx -s stop
npm run start
