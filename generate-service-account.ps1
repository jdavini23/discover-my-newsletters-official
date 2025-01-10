# Firebase Service Account Generation Script

# Ensure Firebase CLI is installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# List available projects
firebase projects:list

# Prompt user to select or create a project
Write-Host "Please select or create a Firebase project for Discover My Newsletters"
Write-Host "1. Select existing project"
Write-Host "2. Create new project"

$choice = Read-Host "Enter your choice (1/2)"

if ($choice -eq "1") {
    $projectId = Read-Host "Enter the Firebase project ID"
    firebase use $projectId
} else {
    $projectName = Read-Host "Enter a name for your Firebase project"
    firebase projects:create $projectName
}

# Generate service account key
$serviceAccountPath = ".\firebase-service-account.json"
firebase projects:serviceaccounts:list
Write-Host "Generating service account key..."
firebase projects:serviceaccounts:create --display-name "GitHub Actions" $serviceAccountPath

Write-Host "Service account key generated at: $serviceAccountPath"
Write-Host "IMPORTANT: Keep this file secure and do NOT commit it to version control!"
Write-Host "Next steps:"
Write-Host "1. Go to GitHub repository Settings > Secrets"
Write-Host "2. Create a new repository secret named FIREBASE_SERVICE_ACCOUNT_DISCOVER_MY_NEWSLETTERS"
Write-Host "3. Paste the contents of the generated JSON file"
