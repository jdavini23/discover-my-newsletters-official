# Git Branch Setup Script

# Ensure we're in the right directory
Set-Location $PSScriptRoot

# Initialize git if not already initialized
if (-not (Test-Path .git)) {
    git init
}

# Create develop branch
git checkout -b develop

# Create initial branches
git branch main
git branch staging

# Configure branch protections (conceptual - actual implementation depends on GitHub/GitLab settings)
Write-Host "Branch Structure Created:"
Write-Host "- main (Production)"
Write-Host "- develop (Staging/Integration)"
Write-Host "- staging (Optional testing environment)"

# Update Firebase configuration for multiple environments
$firebaseConfig = @{
    "hosting" = @{
        "site" = @{
            "main" = "discover-my-newsletters-prod";
            "staging" = "discover-my-newsletters-staging"
        }
    }
}

$firebaseConfig | ConvertTo-Json | Set-Content .firebaserc

# Recommend adding deployment scripts
Add-Content package.json @"
  "scripts": {
    "deploy:staging": "firebase use staging && npm run build && firebase deploy --only hosting:staging",
    "deploy:production": "firebase use main && npm run build && firebase deploy --only hosting:main"
  }
"@

Write-Host "Updated package.json with environment-specific deployment scripts"
