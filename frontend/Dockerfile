# PharmChain Frontend - Development Dockerfile
# Uses Vite dev server for development mode
# For production, use: npm run build && serve -s dist

FROM node:20-alpine

WORKDIR /app

# Install serve for production serving and git for dependencies
RUN npm install -g serve && \
    apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies with retry logic and legacy peer deps
RUN npm install --legacy-peer-deps --prefer-offline --no-audit || \
    (echo "First install failed, retrying with clean cache..." && \
    rm -rf node_modules package-lock.json && \
    npm cache clean --force && \
    npm install --legacy-peer-deps --no-optional --no-audit)

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001 && \
    chown -R frontend:nodejs /app

USER frontend

# Expose ports
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

# Development mode: Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
