# Use an official Node.js runtime as the base image.
FROM node:24-alpine

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json to the container.
COPY package*.json ./

# Install app dependencies.
RUN npm install

# Copy the rest of the application code into the container.
COPY . .

# Expose the port the backend runs on.
EXPOSE 5000

# Define the command to run the application.
CMD ["npm", "run", "start"]
