# Dockerfile
FROM node:22

# Create app directory
WORKDIR /workspace

# Install deps
COPY package*.json ./
RUN npm ci

# Copy sources
COPY . . 

# Expose ports
EXPOSE 3000 9229

# Default to dev (no debug)
CMD ["npm", "run", "dev"]