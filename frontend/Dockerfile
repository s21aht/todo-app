# -----------------------------
# Stage 1: Build
# -----------------------------
FROM node:20-alpine AS builder

# Install dependencies needed for building Next.js
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install all dependencies (dev + prod) for build
RUN npm ci

# Copy the source code
COPY . .

# Build the Next.js app
RUN npm run build

# -----------------------------
# Stage 2: Production
# -----------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies from builder
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy built Next.js files
COPY --from=builder /app/.next ./.next

# Optional: copy next.config.js if needed
COPY --from=builder /app/next.config.js ./next.config.js

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start the Next.js app in production
CMD ["npm", "start"]
