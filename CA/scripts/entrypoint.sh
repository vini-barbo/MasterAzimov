#!/bin/bash
set -e

# Redis Entrypoint Script
echo "Starting Redis Cache..."

# Create necessary directories
mkdir -p /var/run/redis /var/log/redis /data
chown redis:redis /var/run/redis /var/log/redis /data

# Set default environment variables
export REDIS_PASSWORD=${REDIS_PASSWORD:-}
export REDIS_MAXMEMORY=${REDIS_MAXMEMORY:-256mb}
export REDIS_MAXMEMORY_POLICY=${REDIS_MAXMEMORY_POLICY:-allkeys-lru}

# Function to wait for Redis to be ready
wait_for_redis() {
    echo "Waiting for Redis to be ready..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if redis-cli ping >/dev/null 2>&1; then
            echo "Redis is ready!"
            return 0
        fi
        echo "Waiting for Redis... ($timeout seconds remaining)"
        sleep 1
        timeout=$((timeout - 1))
    done
    echo "Redis failed to start within 30 seconds"
    return 1
}

# Function to setup Redis configuration
setup_redis_config() {
    local config_file="/etc/redis/redis.conf"
    
    # Replace environment variables in config
    if [ -n "$REDIS_PASSWORD" ]; then
        sed -i "s/# requirepass.*/requirepass $REDIS_PASSWORD/" "$config_file"
    fi
    
    if [ -n "$REDIS_MAXMEMORY" ]; then
        sed -i "s/maxmemory.*/maxmemory $REDIS_MAXMEMORY/" "$config_file"
    fi
    
    if [ -n "$REDIS_MAXMEMORY_POLICY" ]; then
        sed -i "s/maxmemory-policy.*/maxmemory-policy $REDIS_MAXMEMORY_POLICY/" "$config_file"
    fi
}

# Function to run Redis initialization scripts
run_init_scripts() {
    if [ -d "/docker-entrypoint-initdb.d" ]; then
        echo "Running initialization scripts..."
        for script in /docker-entrypoint-initdb.d/*; do
            if [ -f "$script" ]; then
                echo "Executing $script"
                case "$script" in
                    *.sh)
                        bash "$script"
                        ;;
                    *.redis)
                        redis-cli < "$script"
                        ;;
                    *)
                        echo "Ignoring $script (unsupported file type)"
                        ;;
                esac
            fi
        done
        echo "Initialization scripts completed"
    fi
}

# Main execution
case "$1" in
    redis-server)
        echo "Setting up Redis configuration..."
        setup_redis_config
        
        echo "Starting Redis server..."
        exec "$@"
        ;;
    redis-cli)
        exec "$@"
        ;;
    bash|sh)
        exec "$@"
        ;;
    *)
        # Run custom command
        exec "$@"
        ;;
esac
