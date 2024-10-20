FROM node:18-alpine

WORKDIR /app

# Copy .env file into the image
COPY .env .env

# Print the .env file content
RUN echo "Conteúdo do .env no build:" && cat .env

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["/bin/sh", "entrypoint.sh"]
