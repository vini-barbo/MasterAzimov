#!/bin/bash
set -e

# Redis Health Check Script
echo "Performing Redis health check..."

# Check if Redis is responding to ping
if ! redis-cli ping >/dev/null 2>&1; then
    echo "FAIL: Redis is not responding to ping"
    exit 1
fi

# Check Redis info
info_output=$(redis-cli info server 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "FAIL: Cannot get Redis server info"
    exit 1
fi

# Extract Redis version
redis_version=$(echo "$info_output" | grep "redis_version:" | cut -d: -f2 | tr -d '\r')
if [ -z "$redis_version" ]; then
    echo "FAIL: Cannot determine Redis version"
    exit 1
fi

# Check memory usage
memory_info=$(redis-cli info memory 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "FAIL: Cannot get Redis memory info"
    exit 1
fi

# Extract memory usage percentage
used_memory=$(echo "$memory_info" | grep "used_memory:" | cut -d: -f2 | tr -d '\r')
max_memory=$(echo "$memory_info" | grep "maxmemory:" | cut -d: -f2 | tr -d '\r')

if [ "$max_memory" != "0" ] && [ -n "$used_memory" ] && [ -n "$max_memory" ]; then
    memory_usage_percent=$(( (used_memory * 100) / max_memory ))
    if [ $memory_usage_percent -gt 90 ]; then
        echo "WARN: High memory usage: ${memory_usage_percent}%"
    fi
fi

# Check if Redis is in cluster mode or standalone
redis_mode=$(echo "$info_output" | grep "redis_mode:" | cut -d: -f2 | tr -d '\r')

# Check connected clients
clients_info=$(redis-cli info clients 2>/dev/null)
connected_clients=$(echo "$clients_info" | grep "connected_clients:" | cut -d: -f2 | tr -d '\r')

# Test basic operations
test_key="health_check_$(date +%s)"
if ! redis-cli set "$test_key" "test_value" ex 10 >/dev/null 2>&1; then
    echo "FAIL: Cannot write to Redis"
    exit 1
fi

if ! redis-cli get "$test_key" >/dev/null 2>&1; then
    echo "FAIL: Cannot read from Redis"
    exit 1
fi

if ! redis-cli del "$test_key" >/dev/null 2>&1; then
    echo "FAIL: Cannot delete from Redis"
    exit 1
fi

echo "PASS: Redis health check successful"
echo "Redis Version: $redis_version"
echo "Redis Mode: ${redis_mode:-standalone}"
echo "Connected Clients: ${connected_clients:-0}"

if [ -n "$memory_usage_percent" ]; then
    echo "Memory Usage: ${memory_usage_percent}%"
fi

exit 0
