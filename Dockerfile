FROM lehoanglong/nodejs:14

WORKDIR /opt/app

RUN apt update && apt install nginx gettext-base bash -y

COPY build ./build

COPY scripts ./scripts

COPY nginx-prod.template .

CMD /opt/app/scripts/tmux-prod.sh
