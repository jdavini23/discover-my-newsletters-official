FROM node:18

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++

# Copy package files
COPY package*.json ./

# Clean install dependencies with a clean slate
RUN rm -rf node_modules package-lock.json && \
    npm cache clean --force && \
    npm install && \
    npm prune

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
