# Advanced Syntax Error Fixing Script

$ErrorActionPreference = 'Stop'

function Fix-SyntaxErrors($filePath) {
    try {
        # Check if file is in use
        try {
            $fileStream = [System.IO.File]::Open($filePath, 'Open', 'Read', 'None')
            $fileStream.Close()
        }
        catch {
            Write-Host "File $filePath is currently in use. Skipping."
            return
        }

        $content = Get-Content $filePath -Raw
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($filePath)
        $fileExtension = [System.IO.Path]::GetExtension($filePath)

        # Normalize line endings
        $content = $content -replace "`r`n", "`n"

        # Remove multiple consecutive blank lines
        $content = [regex]::Replace($content, '\n{3,}', "`n`n")

        # Specific fixes for TypeScript files
        if ($fileExtension -in @('.ts', '.tsx', '.d.ts')) {
            # Remove stray or duplicate export statements
            $content = [regex]::Replace($content, '(export\s+type\s+\w+\s*=\s*\w+;)\s*\1', '$1')
            
            # Remove incomplete type definitions
            $content = [regex]::Replace($content, 'export\s+type\s+\w+\s*=\s*{[^}]*$', '')
            
            # Ensure React import for .tsx files
            if ($fileExtension -eq '.tsx' -and $content -notmatch 'import\s+React\s+from\s+[''"]react[''"]') {
                $content = "import React from 'react';" + "`n" + $content
            }
        }

        # Ensure default export for components and pages
        if ($filePath -match '\\(components|pages|services)\\' -and $fileExtension -in @('.tsx', '.ts')) {
            if ($content -notmatch 'export\s+default\s+') {
                $defaultExportLine = "export default $fileName;"
                $content += "`n`n$defaultExportLine"
            }
        }

        # Trim and add final newline
        $content = $content.Trim() + "`n"

        # Write back to file
        $content | Set-Content $filePath -Encoding UTF8
    }
    catch {
        Write-Host "Error processing $filePath`: $($_.Exception.Message)"
    }
}

# Directories to scan
$directories = @(
    "src/components",
    "src/pages", 
    "src/stores", 
    "src/types", 
    "src/utils", 
    "src/services", 
    "src/hooks", 
    "src/ml"
)

# Problematic files that might need special handling
$problematicFiles = @(
    "src/types/roles.ts",
    "src/types/recommendation.ts",
    "src/types/global.ts",
    "src/utils/analytics.ts",
    "src/utils/errorHandler.ts",
    "src/utils/performanceMonitor.ts"
)

# Process problematic files first
foreach ($file in $problematicFiles) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Fix-SyntaxErrors $fullPath
    }
}

# Process all files in specified directories
foreach ($dir in $directories) {
    $fullPath = Join-Path $PSScriptRoot $dir
    Get-ChildItem -Path $fullPath -Recurse -Include *.ts,*.tsx | ForEach-Object {
        Fix-SyntaxErrors $_.FullName
    }
}

Write-Host "Syntax error fixing completed."
