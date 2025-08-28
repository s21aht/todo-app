# Use official Node LTS image
FROM node:20-alpine

WORKDIR /app

# Copy package.json & install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy source code
COPY . .

# Expose backend port
ENV PORT=4000
EXPOSE 4000

# Start server
CMD ["node", "server.js"]