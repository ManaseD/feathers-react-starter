FROM node:11

WORKDIR /home/node

COPY --chown=node:node package.json yarn.lock /home/node/
USER node
RUN yarn install

ENV PORT=8000 UPLOAD_ROOT=/home/node/uploads

COPY --chown=node:node . /home/node

VOLUME $UPLOAD_ROOT

USER node
EXPOSE $PORT

CMD [ "node", "src/index.js" ]
