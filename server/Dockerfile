# Use an official Node.js runtime as a parent image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 6098

CMD [ "npm", "start" ]
