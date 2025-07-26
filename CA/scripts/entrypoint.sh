#!/bin/bash
set -e

# Redis Entrypoint Script
echo "Starting Redis Cache..."

# Ensure directories exist and have correct permissions
[ -d /var/run/redis ] || mkdir -p /var/run/redis 2>/dev/null || true
[ -d /var/log/redis ] || mkdir -p /var/log/redis 2>/dev/null || true
[ -d /data ] || mkdir -p /data 2>/dev/null || true

# Try to set ownership (will work if running as root, silently fail otherwise)
chown -f redis:redis /var/run/redis /var/log/redis /data 2>/dev/null || true

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
    local source_config="/etc/redis/redis.conf"
    local temp_config="/tmp/redis.conf"
    
    # Copy the config file to a writable location
    cp "$source_config" "$temp_config"
    
    # Replace environment variables in temp config
    if [ -n "$REDIS_PASSWORD" ]; then
        sed -i "s/# requirepass.*/requirepass $REDIS_PASSWORD/" "$temp_config"
    fi
    
    if [ -n "$REDIS_MAXMEMORY" ]; then
        sed -i "s/maxmemory.*/maxmemory $REDIS_MAXMEMORY/" "$temp_config"
    fi
    
    if [ -n "$REDIS_MAXMEMORY_POLICY" ]; then
        sed -i "s/maxmemory-policy.*/maxmemory-policy $REDIS_MAXMEMORY_POLICY/" "$temp_config"
    fi
    
    # Export the temp config path for use in the main command
    export REDIS_CONFIG_FILE="$temp_config"
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
        # Use the modified config file if it was created, otherwise use the original
        if [ -n "$REDIS_CONFIG_FILE" ] && [ -f "$REDIS_CONFIG_FILE" ]; then
            exec redis-server "$REDIS_CONFIG_FILE"
        else
            exec "$@"
        fi
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
