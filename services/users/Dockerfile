FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5001

CMD [ "npm", "start" ]