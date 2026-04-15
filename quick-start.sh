#!/bin/bash

# PharmChain Docker Quick Start Script
# Makes it easy to build, run, and manage the project

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check Docker installation
check_docker() {
    print_header "Checking Docker Installation"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker found: $(docker --version)"
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose found: $(docker-compose --version)"
}

# Build images
build_images() {
    print_header "Building Docker Images"
    print_warning "This may take 5-10 minutes on first build..."
    docker-compose build
    print_success "All images built successfully!"
}

# Start services
start_services() {
    print_header "Starting Services"
    
    if [ "$1" == "background" ]; then
        docker-compose up -d
        print_success "Services started in background"
        show_status
    else
        print_info "Starting services in foreground (Ctrl+C to stop)..."
        docker-compose up
    fi
}

# Stop services
stop_services() {
    print_header "Stopping Services"
    docker-compose stop
    print_success "Services stopped"
}

# Show service status
show_status() {
    print_header "Service Status"
    docker-compose ps
    
    print_header "Service URLs"
    echo "Frontend:    http://localhost:5173"
    echo "Backend:     http://localhost:8000"
    echo "AI Service:  http://localhost:8001"
    echo "API Docs:    http://localhost:8000/docs"
}

# Show logs
show_logs() {
    service=$1
    if [ -z "$service" ]; then
        print_header "Showing Logs (All Services)"
        docker-compose logs -f
    else
        print_header "Showing Logs ($service)"
        docker-compose logs -f $service
    fi
}

# Health check
health_check() {
    print_header "Health Check"
    
    services=("backend" "ai_service" "frontend")
    
    for service in "${services[@]}"; do
        if docker-compose exec -T $service true &>/dev/null; then
            print_success "$service is running"
        else
            print_error "$service is not running"
        fi
    done
    
    # Test endpoints
    echo ""
    print_info "Testing API endpoints..."
    
    if curl -s http://localhost:8000/health > /dev/null; then
        print_success "Backend API responding"
    else
        print_warning "Backend API not responding yet (may be starting)"
    fi
    
    if curl -s http://localhost:8001/health > /dev/null; then
        print_success "AI Service responding"
    else
        print_warning "AI Service not responding yet (may be starting)"
    fi
}

# Clean all
clean_all() {
    print_warning "This will remove containers and volumes"
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        print_success "Cleanup complete"
    fi
}

# Show usage
show_usage() {
    cat << EOF
${BLUE}PharmChain Docker Management${NC}

Usage: ./quick-start.sh [COMMAND]

Commands:
    check              Check Docker installation
    build              Build all Docker images
    start              Start services in foreground
    start-bg           Start services in background
    stop               Stop running services
    status             Show service status
    logs               Show logs (all services)
    logs [service]     Show logs from specific service
    health             Run health checks
    clean              Remove containers and volumes
    help               Show this message

Examples:
    ./quick-start.sh build          # Build images
    ./quick-start.sh start-bg       # Start in background
    ./quick-start.sh logs backend   # Show backend logs
    ./quick-start.sh health         # Check all services

EOF
}

# Main script
main() {
    if [ -z "$1" ]; then
        show_usage
        exit 0
    fi
    
    case "$1" in
        check)
            check_docker
            ;;
        build)
            check_docker
            build_images
            ;;
        start)
            check_docker
            start_services
            ;;
        start-bg)
            check_docker
            start_services background
            ;;
        stop)
            stop_services
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs $2
            ;;
        health)
            health_check
            ;;
        clean)
            clean_all
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
