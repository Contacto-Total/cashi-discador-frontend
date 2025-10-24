# ================================================================================
# Multi-stage Dockerfile for Call Center Frontend (Angular)
# ================================================================================

# ================================================================================
# Stage 1: Build Stage
# ================================================================================
FROM node:18-alpine AS build

LABEL maintainer="Call Center System"
LABEL description="Angular Frontend Build Stage"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm ci for faster, more reliable builds
RUN npm ci --silent

# Copy source code
COPY . .

# Build application for production
# This creates optimized bundle in dist/frontend
RUN npm run build -- --configuration production

# ================================================================================
# Stage 2: Runtime Stage with Nginx
# ================================================================================
FROM nginx:1.25-alpine

LABEL maintainer="Call Center System"
LABEL description="Angular Frontend Runtime with Nginx"

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Create non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ================================================================================
# Build Instructions:
# ================================================================================
#
# Build the image:
#   docker build -t callcenter-frontend:latest .
#
# Run the container:
#   docker run -d -p 4200:80 \
#     --name callcenter-frontend \
#     callcenter-frontend:latest
#
# View logs:
#   docker logs -f callcenter-frontend
#
# ================================================================================
