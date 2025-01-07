#!/bin/bash

# Solo Developer Dependency Update Script

# Emojis and colors for fun, personal touch
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backup directory
BACKUP_DIR="$HOME/newsletter_backups"

# Logging function
log() {
    echo -e "🔧 ${GREEN}[DEV UPDATE]${NC} $1"
}

# Warning function
warn() {
    echo -e "⚠️  ${YELLOW}[WARNING]${NC} $1"
}

# Error function
error() {
    echo -e "❌ ${RED}[ERROR]${NC} $1"
    exit 1
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Timestamp for backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PROJECT_BACKUP="$BACKUP_DIR/newsletter_backup_$TIMESTAMP"

# Backup entire project
log "Creating project backup to $PROJECT_BACKUP..."
cp -R . "$PROJECT_BACKUP"

# Change to frontend directory
cd newsletter-frontend || error "Cannot change to frontend directory"

# Clear npm cache to ensure clean update
log "Clearing npm cache..."
npm cache clean --force

# Check for outdated packages
log "Checking for dependency updates..."
OUTDATED=$(npm outdated)

if [ -n "$OUTDATED" ]; then
    echo "$OUTDATED"
    
    read -p "👀 Do you want to update dependencies? (y/n) " update_choice

    if [[ $update_choice == "y" ]]; then
        # Update npm packages
        log "Updating npm packages..."
        npm update

        # Run security audit
        log "Running security audit..."
        npm audit || warn "Potential security vulnerabilities found!"

        # Fix any audit issues
        npm audit fix --force

        # Rebuild project
        log "Rebuilding project..."
        npm run build || error "Build failed"

        # Run tests
        log "Running tests..."
        npm test || warn "Some tests failed. Review before committing."

        # Optional: Commit updates
        read -p "📦 Commit dependency updates? (y/n) " commit_choice
        if [[ $commit_choice == "y" ]]; then
            git add package.json package-lock.json
            git commit -m "chore: Update project dependencies"
        fi

        # Desktop notification (macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            osascript -e 'display notification "Dependency updates completed!" with title "Dev Toolkit"'
        fi
    else
        log "Dependency update cancelled."
    fi
else
    log "No dependency updates available."
fi

log "Update process complete! ✨"
