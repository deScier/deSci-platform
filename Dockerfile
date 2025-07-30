FROM node:22.17-alpine3.22

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

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
# The official node:alpine image includes the 'node' user by default, so this should not fail.
# If you encounter errors, you can replace 'node:node' with 'root:root' or remove this line.
RUN chown -R node:node /app

# Switch to the node user (already exists in node:alpine image)
USER node

# Expose the port
EXPOSE 3000

# Run the app
CMD ["pnpm", "start"]