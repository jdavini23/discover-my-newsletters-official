# Git Branch Verification and Setup Script

# Check if git repository exists
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..."
    git init
}

# Check existing branches
$branches = git branch

Write-Host "Current Branches:"
$branches

# Create branches if they don't exist
$requiredBranches = @("main", "develop", "staging")

foreach ($branch in $requiredBranches) {
    if ($branches -notcontains $branch) {
        Write-Host "Creating branch: $branch"
        git branch $branch
    }
}

# Ensure we have an initial commit
$commitCount = (git rev-list --count HEAD 2>$null)
if ($commitCount -eq 0) {
    Write-Host "No commits found. Creating initial commit..."
    git add .
    git commit -m "Initial project setup"
}

# List all branches again
Write-Host "`nUpdated Branches:"
git branch -a
