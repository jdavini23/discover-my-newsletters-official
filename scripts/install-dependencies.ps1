# PowerShell script to install and fix dependencies

# Clear npm cache
npm cache clean --force

# Remove existing node_modules
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Remove package-lock.json
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Install dependencies
npm install

# Run type fixing
npm run fix:types

# Rebuild project
npm run build

Write-Host "Dependency installation and type fixing complete!"
