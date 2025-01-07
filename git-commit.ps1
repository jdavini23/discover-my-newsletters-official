param(
    [string]$message
)

# Ensure we're in the right directory
Set-Location "c:/Users/joeda/Desktop/discover-my-newsletters"

# Check if there are any changes to commit
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to commit."
    exit 0
}

# Add all changes
git add .

# Commit with the provided message
git commit -m $message

# Optional: Push to remote (uncomment if you want automatic pushing)
# git push
