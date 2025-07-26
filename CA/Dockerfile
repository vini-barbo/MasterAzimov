# Redis Cache Dockerfile
FROM redis:8.0-alpine

# Install necessary packages
RUN apk add --no-cache \
    bash \
    curl \
    procps

# Create redis user and directories
RUN addgroup -g 999 redis && \
    adduser -D -u 999 -G redis redis

# Create necessary directories
RUN mkdir -p /data /etc/redis /var/log/redis && \
    chown -R redis:redis /data /etc/redis /var/log/redis

# Copy configuration files
COPY config/redis.conf /etc/redis/redis.conf
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY scripts/healthcheck.sh /usr/local/bin/healthcheck.sh

# Make scripts executable
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/healthcheck.sh

# Switch to redis user
USER redis

# Expose Redis port
EXPOSE 6379

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /usr/local/bin/healthcheck.sh

# Use custom entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["redis-server", "/etc/redis/redis.conf"]
