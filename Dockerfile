FROM node:17.6-buster

WORKDIR /opt/app

RUN apt update && apt install nginx gettext-base bash -y

COPY build ./build

COPY scripts ./scripts

COPY nginx-prod.template .

CMD /opt/app/scripts/tmux-prod.sh
