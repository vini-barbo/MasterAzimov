#!/bin/bash

# Script para atualizar todos os services para usar API_ENDPOINTS

SERVICES_DIR="/home/vinicius/Documents/master-azimov/FE/lib/services"

# Function to update each service file
update_service() {
    local file="$1"
    local endpoint_base="$2"
    
    echo "Updating $file..."
    
    # Add import if not exists
    if ! grep -q "API_ENDPOINTS" "$file"; then
        sed -i "1a import { API_ENDPOINTS } from '../config/env'" "$file"
    fi
    
    # Remove BASE_PATH declaration
    sed -i '/private static readonly BASE_PATH/d' "$file"
    
    # Replace this.BASE_PATH with endpoint
    sed -i "s/this\.BASE_PATH/$endpoint_base/g" "$file"
    
    echo "✅ Updated $file"
}

# Update each service
update_service "$SERVICES_DIR/batch.service.ts" "API_ENDPOINTS.BATCHES.BASE"
update_service "$SERVICES_DIR/stock-movement.service.ts" "API_ENDPOINTS.STOCK_MOVEMENTS.BASE" 
update_service "$SERVICES_DIR/purchase.service.ts" "API_ENDPOINTS.PURCHASES.BASE"
update_service "$SERVICES_DIR/sale.service.ts" "API_ENDPOINTS.SALES.BASE"
update_service "$SERVICES_DIR/production.service.ts" "API_ENDPOINTS.PRODUCTION.BASE"
update_service "$SERVICES_DIR/notification.service.ts" "API_ENDPOINTS.NOTIFICATIONS.BASE"

echo "🚀 All services updated successfully!"
