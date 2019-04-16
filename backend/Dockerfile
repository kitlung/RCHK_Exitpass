    FROM node:10.15.1-alpine

    WORKDIR /exitpass/backend/

    COPY package*.json /exitpass/backend/

    RUN npm install

    COPY . .

    EXPOSE 7082

    CMD npm start
