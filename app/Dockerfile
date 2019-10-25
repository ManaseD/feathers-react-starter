FROM node:8.0

WORKDIR /home/node
COPY --chown=node:node package.json yarn.lock /home/node/
USER node
RUN yarn install

COPY entrypoint.sh /usr/local/bin
COPY --chown=node:node . /home/node

ENV PORT=8000 STATIC_ROOT=/home/node/dist

VOLUME $STATIC_ROOT

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
USER node

EXPOSE $PORT

CMD [ "node", "bin/www" ]
