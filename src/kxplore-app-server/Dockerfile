FROM node:8.12-alpine as builder

WORKDIR /var/src

RUN npm install typescript -g

COPY . .

RUN npm install 

WORKDIR /var/src/front-end/

RUN ng build