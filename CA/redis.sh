#!/bin/bash

# Makefile-style commands for Redis Cache management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment detection
ENV=${1:-dev}
COMPOSE_FILE="docker-compose.yml"

case $ENV in
    prod|production)
        COMPOSE_FILE="docker-compose.prod.yml"
        ENV_FILE=".env.prod"
        ;;
    test|testing)
        COMPOSE_FILE="docker-compose.test.yml"
        ENV_FILE=".env.test"
        ;;
    dev|development|*)
        COMPOSE_FILE="docker-compose.yml"
        ENV_FILE=".env.dev"
        ;;
esac

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if docker-compose file exists
check_compose_file() {
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "Docker compose file not found: $COMPOSE_FILE"
        exit 1
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p data logs backups
    chmod 755 data logs backups
}

# Function to load environment variables
load_env() {
    if [ -f "$ENV_FILE" ]; then
        print_status "Loading environment from $ENV_FILE"
        export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
    else
        print_warning "Environment file not found: $ENV_FILE"
    fi
}

# Main commands
case "${2:-help}" in
    build)
        print_header "Building Redis Cache ($ENV)"
        check_compose_file
        load_env
        create_directories
        docker-compose -f "$COMPOSE_FILE" build
        ;;
    up|start)
        print_header "Starting Redis Cache ($ENV)"
        check_compose_file
        load_env
        create_directories
        docker-compose -f "$COMPOSE_FILE" up -d
        print_status "Redis Cache started successfully"
        ;;
    down|stop)
        print_header "Stopping Redis Cache ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" down
        print_status "Redis Cache stopped successfully"
        ;;
    restart)
        print_header "Restarting Redis Cache ($ENV)"
        check_compose_file
        load_env
        docker-compose -f "$COMPOSE_FILE" restart
        print_status "Redis Cache restarted successfully"
        ;;
    logs)
        print_header "Showing Redis Cache Logs ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" logs -f redis
        ;;
    status)
        print_header "Redis Cache Status ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" ps
        ;;
    health)
        print_header "Redis Cache Health Check ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" exec redis /usr/local/bin/healthcheck.sh
        ;;
    monitor)
        print_header "Redis Cache Monitoring ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" exec redis /usr/local/bin/scripts/monitor.sh all
        ;;
    backup)
        print_header "Creating Redis Backup ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" exec redis /usr/local/bin/scripts/backup.sh backup
        ;;
    restore)
        if [ -z "$3" ]; then
            print_error "Please specify backup file to restore"
            print_status "Usage: $0 $ENV restore <backup_file>"
            exit 1
        fi
        print_header "Restoring Redis from Backup ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" exec redis /usr/local/bin/scripts/backup.sh restore "$3"
        ;;
    shell)
        print_header "Opening Redis Shell ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" exec redis redis-cli
        ;;
    bash)
        print_header "Opening Bash Shell ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" exec redis bash
        ;;
    clean)
        print_header "Cleaning Redis Cache ($ENV)"
        check_compose_file
        print_warning "This will remove all containers, volumes, and networks"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans
            docker system prune -f
            print_status "Redis Cache cleaned successfully"
        else
            print_status "Clean operation cancelled"
        fi
        ;;
    reset)
        print_header "Resetting Redis Data ($ENV)"
        check_compose_file
        print_warning "This will remove all Redis data"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f "$COMPOSE_FILE" exec redis redis-cli flushall
            print_status "Redis data reset successfully"
        else
            print_status "Reset operation cancelled"
        fi
        ;;
    benchmark)
        print_header "Running Redis Benchmark ($ENV)"
        check_compose_file
        docker-compose -f "$COMPOSE_FILE" exec redis /usr/local/bin/scripts/monitor.sh benchmark
        ;;
    help|*)
        print_header "Redis Cache Management Commands"
        echo ""
        echo "Usage: $0 <environment> <command>"
        echo ""
        echo "Environments:"
        echo "  dev, development  - Development environment (default)"
        echo "  prod, production  - Production environment"
        echo "  test, testing     - Testing environment"
        echo ""
        echo "Commands:"
        echo "  build     - Build Redis containers"
        echo "  up/start  - Start Redis services"
        echo "  down/stop - Stop Redis services"
        echo "  restart   - Restart Redis services"
        echo "  logs      - Show Redis logs"
        echo "  status    - Show service status"
        echo "  health    - Run health check"
        echo "  monitor   - Show monitoring information"
        echo "  backup    - Create a backup"
        echo "  restore   - Restore from backup"
        echo "  shell     - Open Redis CLI"
        echo "  bash      - Open bash shell"
        echo "  clean     - Clean all containers and volumes"
        echo "  reset     - Reset all Redis data"
        echo "  benchmark - Run performance benchmark"
        echo "  help      - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 dev up          # Start development environment"
        echo "  $0 prod logs       # Show production logs"
        echo "  $0 test health     # Check test environment health"
        echo ""
        ;;
esac
