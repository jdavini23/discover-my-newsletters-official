param(
    [string]$ProjectRoot = "."
)

# Function to fix common TypeScript syntax errors
function Fix-TypeScriptFile {
    param(
        [string]$FilePath
    )

    $content = Get-Content $FilePath -Raw

    # Remove multiple consecutive export type interface statements
    $content = $content -replace 'export\s+type\s+interface\s*=\s*[^;]+;(\s*export\s+type\s+interface\s*=\s*[^;]+;)+', ''

    # Remove invalid type and interface declarations
    $content = $content -replace 'type;', ''
    $content = $content -replace 'export\s+type\s+interface\s*=\s*[^;]+;', ''

    # Fix unterminated regex literals
    $content = $content -replace '\/([^\/\n]+)(?!\/)', '/$1/'

    # Remove empty or malformed export statements
    $content = $content -replace 'export\s+type\s*;', ''
    $content = $content -replace 'export\s*=\s*export;', ''

    # Remove duplicate or malformed export statements
    $content = $content -replace '(export\s+type\s*[^;]+;)\s*\1', '$1'

    # Trim excessive whitespace and newlines
    $content = $content -replace '\n{3,}', "`n`n"

    # Write back to file
    $content | Set-Content $FilePath -Encoding UTF8
}

# Find and fix TypeScript files
Get-ChildItem -Path $ProjectRoot -Recurse -Include *.ts,*.tsx | ForEach-Object {
    Write-Host "Processing file: $($_.FullName)"
    Fix-TypeScriptFile -FilePath $_.FullName
}

Write-Host "TypeScript syntax error fixing completed."
