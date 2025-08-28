# -----------------------------
# Stage 1: Build dependencies
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install all dependencies (needed to build node_modules)
RUN npm ci

# Copy source code (for dev dependencies if needed)
COPY . .

# -----------------------------
# Stage 2: Production image
# -----------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies from builder
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy app source code
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/db.js ./db.js

# If you have other source files or folders, copy them too
# COPY --from=builder /app/routes ./routes
# COPY --from=builder /app/controllers ./controllers

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Start the backend server
CMD ["node", "server.js"]