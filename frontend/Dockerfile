# PharmChain Frontend Dockerfile
# Optimized for development with Vite

FROM node:20-alpine

WORKDIR /app

# Install build tools
RUN apk add --no-cache python3 make g++

# Copy package files (in this order for optimal caching)
COPY package*.json ./

# Install dependencies
# Using --no-optional to skip optional dependencies that may cause issues
# Using --legacy-peer-deps to handle peer dependency conflicts
RUN npm ci --no-optional --legacy-peer-deps 2>/dev/null || \
    npm install --legacy-peer-deps

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001 && \
    chown -R frontend:nodejs /app

USER frontend

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5173/ 2>/dev/null || exit 1

# Run Vite development server
# Note: In production, run: npm run build && serve -s dist
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
