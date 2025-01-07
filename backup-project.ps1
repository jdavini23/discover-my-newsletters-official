# Project Backup Script

# Function for colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = 'Green'
    )
    Write-Host $Message -ForegroundColor $Color
}

# Main Backup Function
function Backup-Project {
    # Project details
    $projectRoot = "c:/Users/joeda/Desktop/discover-my-newsletters"
    $backupRoot = "c:/Users/joeda/Desktop/project-backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupName = "discover-my-newsletters_$timestamp"
    $backupPath = Join-Path $backupRoot $backupName

    # Create backup directory
    Write-ColorOutput "=== Project Backup Tool ===" Cyan
    
    # Ensure backup root exists
    if (-not (Test-Path $backupRoot)) {
        New-Item -ItemType Directory -Path $backupRoot | Out-Null
        Write-ColorOutput "Created backup directory: $backupRoot" Green
    }

    # Create backup directory
    New-Item -ItemType Directory -Path $backupPath | Out-Null
    Write-ColorOutput "Creating backup: $backupName" Yellow

    # List of directories to backup
    $directoriesToBackup = @(
        "backend",
        "src",
        "config"
    )

    # Backup specified directories
    foreach ($dir in $directoriesToBackup) {
        $sourcePath = Join-Path $projectRoot $dir
        $destPath = Join-Path $backupPath $dir

        if (Test-Path $sourcePath) {
            try {
                Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
                Write-ColorOutput "Backed up directory: $dir" Green
            } catch {
                Write-ColorOutput "Failed to backup directory: $dir" Red
            }
        } else {
            Write-ColorOutput "Directory not found: $dir" Yellow
        }
    }

    # Backup critical files
    $criticalFiles = @(
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        ".env"
    )

    foreach ($file in $criticalFiles) {
        $sourcePath = Join-Path $projectRoot $file
        $destPath = Join-Path $backupPath $file

        if (Test-Path $sourcePath) {
            try {
                Copy-Item -Path $sourcePath -Destination $destPath -Force
                Write-ColorOutput "Backed up file: $file" Green
            } catch {
                Write-ColorOutput "Failed to backup file: $file" Red
            }
        }
    }

    # Create a backup manifest
    $manifestPath = Join-Path $backupPath "BACKUP_MANIFEST.txt"
    $manifestContent = @"
Backup Created: $timestamp
Backed up Directories:
$($directoriesToBackup -join "`n")

Backed up Files:
$($criticalFiles -join "`n")
"@
    
    $manifestContent | Out-File -FilePath $manifestPath

    # Compress backup (optional)
    try {
        $zipPath = "$backupRoot/$backupName.zip"
        Compress-Archive -Path "$backupPath/*" -DestinationPath $zipPath -Force
        Write-ColorOutput "Created compressed backup: $backupName.zip" Green
    } catch {
        Write-ColorOutput "Failed to create compressed backup" Yellow
    }

    Write-ColorOutput "`nBackup Complete!" Cyan
    Write-ColorOutput "Backup Location: $backupPath" White
    Write-ColorOutput "Compressed Backup: $zipPath" White
}

# Run the backup
Backup-Project
