FROM node:8.11.2
WORKDIR /server
COPY . /server
EXPOSE 3000
RUN npm run install
CMD [ "npm", "start" ]