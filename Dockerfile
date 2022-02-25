FROM lehoanglong/nodejs:14

WORKDIR /opt/app

COPY . .

RUN apt update && apt install nginx gettext-base bash -y

RUN npm install

ENV PUBLIC_URL /admin

ARG ECOMMERCE_ADMIN_BACKEND_URL
ARG ECOMMERCE_ADMIN_FILESERVER_URL

ENV REACT_APP_BACKEND_URL=${ECOMMERCE_ADMIN_BACKEND_URL}
ENV REACT_APP_FILESERVER_URL=${ECOMMERCE_ADMIN_FILESERVER_URL}

RUN npm run build

ENV PORT 80

CMD /opt/app/scripts/tmux-prod.sh
