# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY src ./src
COPY output ./output
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20 AS runner

WORKDIR /app

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy built files and node_modules from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["node", "./dist/index.js"]