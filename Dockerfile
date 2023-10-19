FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY package*.json /app/

RUN npm install

ADD . /app/
CMD [ "node", "index.js" ]
