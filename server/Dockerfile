# Use an official Node.js runtime as a parent image
FROM node:20-alpine

WORKDIR /app

# ENV MONGODB_URI=mongodb://expensebook-db:rhdARwKJZIMTZYy89jr5OKsTl42xY2KcaGizbsrmHkd11tTuRaUeySXTAzNv0tTUQn6VzDpP3f0zACDbo8SCDQ%3D%3D@expensebook-db.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@expensebook-db@

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8088

CMD [ "npm", "start" ]
