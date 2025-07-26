#!/bin/bash
set -e

# Redis Backup Script
BACKUP_DIR=${BACKUP_DIR:-/backups}
BACKUP_RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="redis_backup_${TIMESTAMP}.rdb"

echo "Starting Redis backup process..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to perform backup
perform_backup() {
    echo "Creating Redis backup..."
    
    # Trigger a background save
    if ! redis-cli bgsave >/dev/null 2>&1; then
        echo "ERROR: Failed to trigger background save"
        exit 1
    fi
    
    # Wait for background save to complete
    while [ "$(redis-cli lastsave)" = "$(redis-cli lastsave)" ]; do
        if redis-cli info persistence | grep -q "rdb_bgsave_in_progress:0"; then
            break
        fi
        echo "Waiting for background save to complete..."
        sleep 2
    done
    
    # Copy the RDB file
    if [ -f "/data/dump.rdb" ]; then
        cp "/data/dump.rdb" "$BACKUP_DIR/$BACKUP_FILE"
        echo "Backup created: $BACKUP_DIR/$BACKUP_FILE"
        
        # Compress the backup
        gzip "$BACKUP_DIR/$BACKUP_FILE"
        echo "Backup compressed: $BACKUP_DIR/${BACKUP_FILE}.gz"
        
        # Verify backup
        if [ -f "$BACKUP_DIR/${BACKUP_FILE}.gz" ]; then
            backup_size=$(stat -f%z "$BACKUP_DIR/${BACKUP_FILE}.gz" 2>/dev/null || stat -c%s "$BACKUP_DIR/${BACKUP_FILE}.gz" 2>/dev/null)
            echo "Backup size: ${backup_size} bytes"
        fi
    else
        echo "ERROR: Redis dump file not found"
        exit 1
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    echo "Cleaning up backups older than $BACKUP_RETENTION_DAYS days..."
    
    find "$BACKUP_DIR" -name "redis_backup_*.rdb.gz" -type f -mtime +$BACKUP_RETENTION_DAYS -delete
    
    remaining_backups=$(find "$BACKUP_DIR" -name "redis_backup_*.rdb.gz" -type f | wc -l)
    echo "Remaining backups: $remaining_backups"
}

# Function to list existing backups
list_backups() {
    echo "Existing backups:"
    find "$BACKUP_DIR" -name "redis_backup_*.rdb.gz" -type f -exec ls -lh {} \; | sort
}

# Function to restore from backup
restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        echo "Usage: $0 restore <backup_file>"
        echo "Available backups:"
        list_backups
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        echo "ERROR: Backup file not found: $backup_file"
        exit 1
    fi
    
    echo "Restoring from backup: $backup_file"
    
    # Stop Redis (if running)
    redis-cli shutdown nosave || true
    
    # Extract and restore
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" > /data/dump.rdb
    else
        cp "$backup_file" /data/dump.rdb
    fi
    
    chown redis:redis /data/dump.rdb
    echo "Backup restored. Please restart Redis."
}

# Main script logic
case "${1:-backup}" in
    backup)
        perform_backup
        cleanup_old_backups
        ;;
    restore)
        restore_backup "$2"
        ;;
    list)
        list_backups
        ;;
    cleanup)
        cleanup_old_backups
        ;;
    *)
        echo "Usage: $0 {backup|restore|list|cleanup}"
        echo "  backup  - Create a new backup (default)"
        echo "  restore - Restore from a backup file"
        echo "  list    - List existing backups"
        echo "  cleanup - Remove old backups"
        exit 1
        ;;
esac

echo "Redis backup operation completed successfully."
