#!/usr/bin/env pwsh

# Cross-Platform Project Synchronization Script

# Ensure we're in the right directory
Set-Location $PSScriptRoot

# Fetch the latest changes from the remote repository
git fetch origin

# Pull the latest changes, allowing unrelated histories
git pull origin main --allow-unrelated-histories

# Update submodules if any
git submodule update --init --recursive

# Install root project dependencies
npm install

# Install frontend dependencies
Set-Location .\newsletter-frontend
npm install

# Install backend dependencies
Set-Location ..\newsletter-backend
npm install

# Return to root directory
Set-Location ..

Write-Host "Synchronization complete!" -ForegroundColor Green
