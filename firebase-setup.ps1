# Firebase Project Setup Script

# Reinstall Firebase CLI to resolve potential issues
npm install -g firebase-tools

# Login to Firebase
firebase login

# List available projects
firebase projects:list

# Initialize Firebase hosting
firebase init hosting

# Setup multiple environments
Write-Host "Configuring Firebase environments..."

# Create .firebaserc with multiple project configurations
$firebaseConfig = @{
    "projects" = @{
        "default" = "discover-my-newsletters"
        "staging" = "discover-my-newsletters-staging"
        "production" = "discover-my-newsletters-prod"
    }
    "targets" = @{
        "discover-my-newsletters" = @{
            "hosting" = @{
                "main" = @("discover-my-newsletters-main")
                "staging" = @("discover-my-newsletters-staging")
            }
        }
    }
}

$firebaseConfig | ConvertTo-Json | Set-Content .firebaserc

# Create Firebase configuration files if not exists
if (-not (Test-Path firebase.json)) {
    @{
        "hosting" = @{
            "public" = "dist"
            "ignore" = @("firebase.json", "**/.*", "**/node_modules/**")
            "rewrites" = @(
                @{
                    "source" = "**"
                    "destination" = "/index.html"
                }
            )
        }
    } | ConvertTo-Json | Set-Content firebase.json
}

Write-Host "Firebase project setup complete!"
Write-Host "Next steps:"
Write-Host "1. Verify .firebaserc and firebase.json"
Write-Host "2. Run 'npm run build'"
Write-Host "3. Run 'firebase deploy'"
