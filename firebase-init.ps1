# PowerShell script for Firebase project initialization

# Ensure Firebase CLI is installed
firebase --version

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init hosting

# Optional: Initialize other Firebase services if needed
# firebase init firestore
# firebase init functions

Write-Host "Firebase project initialization complete."
Write-Host "Next steps:"
Write-Host "1. Review .firebaserc and firebase.json"
Write-Host "2. Run 'npm run build' to create dist folder"
Write-Host "3. Run 'firebase deploy' to deploy"
