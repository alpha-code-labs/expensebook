# Use the official Node.js 14 image.
FROM node:20-alpine

# Create and change to the working directory.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of your application code.
COPY . .

# Expose the port the app runs on
EXPOSE 8088

# Run the application
CMD ["node", "index.js"] 