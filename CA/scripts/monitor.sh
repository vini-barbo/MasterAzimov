#!/bin/bash
set -e

# Redis Monitoring Script
REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_PASSWORD=${REDIS_PASSWORD:-}

# Function to connect to Redis with optional password
redis_cmd() {
    if [ -n "$REDIS_PASSWORD" ]; then
        redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" "$@"
    else
        redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" "$@"
    fi
}

# Function to get Redis info
get_redis_info() {
    echo "=== Redis Server Information ==="
    redis_cmd info server | grep -E "(redis_version|redis_mode|os|arch_bits|process_id|uptime_in_seconds)"
    echo ""
}

# Function to get memory information
get_memory_info() {
    echo "=== Memory Information ==="
    local memory_info=$(redis_cmd info memory)
    
    local used_memory=$(echo "$memory_info" | grep "used_memory_human:" | cut -d: -f2 | tr -d '\r')
    local used_memory_peak=$(echo "$memory_info" | grep "used_memory_peak_human:" | cut -d: -f2 | tr -d '\r')
    local maxmemory=$(echo "$memory_info" | grep "maxmemory_human:" | cut -d: -f2 | tr -d '\r')
    
    echo "Used Memory: $used_memory"
    echo "Peak Memory: $used_memory_peak"
    echo "Max Memory: ${maxmemory:-unlimited}"
    echo ""
}

# Function to get client information
get_client_info() {
    echo "=== Client Information ==="
    local client_info=$(redis_cmd info clients)
    
    local connected_clients=$(echo "$client_info" | grep "connected_clients:" | cut -d: -f2 | tr -d '\r')
    local blocked_clients=$(echo "$client_info" | grep "blocked_clients:" | cut -d: -f2 | tr -d '\r')
    
    echo "Connected Clients: $connected_clients"
    echo "Blocked Clients: $blocked_clients"
    echo ""
}

# Function to get stats information
get_stats_info() {
    echo "=== Statistics ==="
    local stats_info=$(redis_cmd info stats)
    
    local total_commands=$(echo "$stats_info" | grep "total_commands_processed:" | cut -d: -f2 | tr -d '\r')
    local expired_keys=$(echo "$stats_info" | grep "expired_keys:" | cut -d: -f2 | tr -d '\r')
    local evicted_keys=$(echo "$stats_info" | grep "evicted_keys:" | cut -d: -f2 | tr -d '\r')
    local keyspace_hits=$(echo "$stats_info" | grep "keyspace_hits:" | cut -d: -f2 | tr -d '\r')
    local keyspace_misses=$(echo "$stats_info" | grep "keyspace_misses:" | cut -d: -f2 | tr -d '\r')
    
    echo "Total Commands: $total_commands"
    echo "Expired Keys: $expired_keys"
    echo "Evicted Keys: $evicted_keys"
    echo "Keyspace Hits: $keyspace_hits"
    echo "Keyspace Misses: $keyspace_misses"
    
    if [ -n "$keyspace_hits" ] && [ -n "$keyspace_misses" ] && [ "$keyspace_hits" != "0" ] && [ "$keyspace_misses" != "0" ]; then
        local hit_rate=$(( (keyspace_hits * 100) / (keyspace_hits + keyspace_misses) ))
        echo "Hit Rate: ${hit_rate}%"
    fi
    echo ""
}

# Function to get keyspace information
get_keyspace_info() {
    echo "=== Keyspace Information ==="
    redis_cmd info keyspace | grep "db[0-9]"
    echo ""
}

# Function to get slowlog
get_slowlog() {
    echo "=== Slow Log (Last 10 entries) ==="
    redis_cmd slowlog get 10 | head -20
    echo ""
}

# Function to monitor real-time stats
monitor_realtime() {
    echo "=== Real-time Monitoring (Press Ctrl+C to stop) ==="
    redis_cmd monitor
}

# Function to check Redis performance
performance_test() {
    echo "=== Performance Test ==="
    echo "Running benchmark..."
    redis-benchmark -h "$REDIS_HOST" -p "$REDIS_PORT" ${REDIS_PASSWORD:+-a $REDIS_PASSWORD} -t set,get -n 10000 -c 50 -q
    echo ""
}

# Function to show current configuration
show_config() {
    echo "=== Redis Configuration ==="
    redis_cmd config get "*" | sed 'N;s/\n/ = /' | head -20
    echo "... (showing first 20 config items)"
    echo ""
}

# Main monitoring function
monitor_all() {
    echo "Redis Monitoring Report - $(date)"
    echo "========================================"
    get_redis_info
    get_memory_info
    get_client_info
    get_stats_info
    get_keyspace_info
    get_slowlog
}

# Script usage
case "${1:-all}" in
    info)
        get_redis_info
        ;;
    memory)
        get_memory_info
        ;;
    clients)
        get_client_info
        ;;
    stats)
        get_stats_info
        ;;
    keyspace)
        get_keyspace_info
        ;;
    slowlog)
        get_slowlog
        ;;
    config)
        show_config
        ;;
    monitor)
        monitor_realtime
        ;;
    benchmark)
        performance_test
        ;;
    all)
        monitor_all
        ;;
    *)
        echo "Usage: $0 {info|memory|clients|stats|keyspace|slowlog|config|monitor|benchmark|all}"
        echo "  info      - Show server information"
        echo "  memory    - Show memory usage"
        echo "  clients   - Show client connections"
        echo "  stats     - Show statistics"
        echo "  keyspace  - Show keyspace information"
        echo "  slowlog   - Show slow query log"
        echo "  config    - Show configuration"
        echo "  monitor   - Real-time monitoring"
        echo "  benchmark - Run performance test"
        echo "  all       - Show all information (default)"
        exit 1
        ;;
esac
