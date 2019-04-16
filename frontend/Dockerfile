# check version in docker hub

FROM node:10.15.1-alpine

WORKDIR /exitpass/frontend/

COPY package*.json /exitpass/frontend/

RUN npm install

COPY . .

RUN npm run build


EXPOSE 8080