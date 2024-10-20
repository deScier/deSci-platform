FROM node:18-alpine

WORKDIR /app

# Accept the build argument for the .env file content
ARG ENV_FILE

# Write the .env content into the .env file in the container (without showing the content in the logs)
RUN sh -c 'echo "$ENV_FILE" > .env'

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Set ownership of app directory
RUN chown -R node:node /app

# Switch to the node user
USER node

# Expose the port
EXPOSE 3000

# List directories and check for .env file
RUN ls -la /app && echo "Checking for .env file:" && ls -la /app/.env || echo ".env file not found"

# Run the app
CMD ["npm", "start"]