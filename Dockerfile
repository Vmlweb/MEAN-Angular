FROM node:alpine

VOLUME /home/logs
VOLUME /home/certs

COPY node_modules /home/node_modules
COPY server /home/server
COPY client /home/client

ENV NODE_ENV production

WORKDIR /home

CMD ["node_modules/pm2/bin/pm2", "start", "/home/server/main.js", "-i", "$(nproc)", "--no-daemon"]