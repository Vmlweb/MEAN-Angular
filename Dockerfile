FROM node:slim

VOLUME /home/logs
VOLUME /home/certs

COPY package.json /home/package.json
COPY server /home/server
COPY client /home/client

ENV NODE_ENV production

WORKDIR /home

RUN apt-get update && apt-get upgrade; exit 0
RUN npm install -g pm2 && npm install --production && rm /home/package.json; exit 0

CMD ["pm2", "start", "/home/server/app.js", "-i", "$(nproc)", "--no-daemon"]