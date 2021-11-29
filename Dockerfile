FROM lehoanglong/nodejs:14

WORKDIR /opt/app

COPY . .

RUN apt update && apt install nginx gettext-base bash -y

RUN npm install

ENV PUBLIC_URL /admin

RUN npm run build

ENV PORT 80

CMD /opt/app/scripts/tmux-prod.sh
