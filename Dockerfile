# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Use a lightweight Node.js image for the runtime
FROM node:18-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/.output ./

# Expose the port Nuxt will run on
EXPOSE 3000

# Start the application
CMD ["node", "server/index.mjs"]
