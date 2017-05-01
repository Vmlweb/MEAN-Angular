FROM node:alpine

VOLUME /data/logs
VOLUME /data/certs

COPY node_modules /data/node_modules
COPY server /data/server

ENV NODE_ENV production

WORKDIR /data

CMD ["node_modules/pm2/bin/pm2", "start", "/data/server/main.js", "-i", "$(nproc)", "--no-daemon"]