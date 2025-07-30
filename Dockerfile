FROM node:22.17-alpine3.22

WORKDIR /app

# Install pnpm globally and create node user
RUN npm install -g pnpm && \
    addgroup -g 1000 node && \
    adduser -u 1000 -G node -s /bin/sh -D node

# Set production environment
ENV NODE_ENV=production

# Accept the build argument for the .env file content
ARG ENV_FILE

# Write the .env content into the .env file in the container (without showing the content in the logs)
RUN sh -c 'echo "$ENV_FILE" > .env'

# Copy package.json, pnpm-lock.yaml and install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the app
COPY . .

# Build the app
RUN pnpm build

# Set ownership of app directory
RUN chown -R node:node /app

# Switch to the node user
USER node

# Expose the port
EXPOSE 3000

# Run the app
CMD ["pnpm", "start"]