#!/usr/bin/env pwsh

# Dependency Audit Script for Discover My Newsletters

# Exit on first error
$ErrorActionPreference = 'Stop'

# Check npm outdated packages
Write-Host "Checking for outdated packages..." -ForegroundColor Cyan
npm outdated

# Run npm audit
Write-Host "`nRunning security audit..." -ForegroundColor Cyan
npm audit

# Check for vulnerabilities
Write-Host "`nChecking for known vulnerabilities..." -ForegroundColor Cyan
npm audit --audit-level=high

# Optional: Generate a dependency report
Write-Host "`nGenerating dependency report..." -ForegroundColor Cyan
npm ls --depth=0

Write-Host "`nDependency audit complete." -ForegroundColor Green
