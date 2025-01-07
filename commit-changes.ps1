# Git Commit and Push Script

# Function for colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = 'Green'
    )
    Write-Host $Message -ForegroundColor $Color
}

# Set the project directory
$projectDir = "c:/Users/joeda/Desktop/discover-my-newsletters"

# Change to project directory
Set-Location $projectDir

# Check Git configuration
try {
    $gitConfig = & git config --list
    Write-ColorOutput "Git Configuration Verified" Green
} catch {
    Write-ColorOutput "Git is not configured. Setting up user details..." Yellow
    & git config --global user.name "Your Name"
    & git config --global user.email "your.email@example.com"
}

# Add all changes
Write-ColorOutput "Adding all changes..." Yellow
& git add .

# Commit with a timestamped message
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Project Update: Security, Performance, and Documentation Improvements - $timestamp"

Write-ColorOutput "Committing changes..." Yellow
& git commit -m $commitMessage

# Push changes
try {
    Write-ColorOutput "Pushing changes to remote repository..." Yellow
    & git push origin main
    Write-ColorOutput "Changes successfully pushed!" Green
} catch {
    Write-ColorOutput "Error pushing changes. Please check your remote repository connection." Red
    Write-ColorOutput $_.Exception.Message Yellow
}

# Show commit status
Write-ColorOutput "`nCommit Status:" Cyan
& git status
