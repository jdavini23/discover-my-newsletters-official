$ErrorActionPreference = 'Stop'

function Fix-FileExports($filePath) {
    $content = Get-Content $filePath -Raw
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($filePath)
    $fileExtension = [System.IO.Path]::GetExtension($filePath)

    # Remove problematic export lines and trailing semicolons
    $content = $content -replace 'export\s+type\s*=\s*default;', ''
    $content = $content -replace ';\s*$', ''

    # Determine file type
    $isTypeFile = $filePath -match '\\types\\' -or $fileExtension -eq '.ts'
    $isComponentFile = $fileExtension -eq '.tsx'
    $isServiceFile = $filePath -match '\\(services|stores|hooks|ml)\\' -or $fileName -match '(Service|Store|Hook)'

    # Regex patterns for type and interface detection
    $typePattern = '(type|interface)\s+(\w+)'
    $typeMatches = [regex]::Matches($content, $typePattern)
    $typeNames = $typeMatches | ForEach-Object { $_.Groups[2].Value }

    # Add type exports for type files
    if ($isTypeFile -and $typeNames.Count -gt 0) {
        $typeExportLines = $typeNames | ForEach-Object { "export type $_ = $_;" }
        $content += "`n`n" + ($typeExportLines -join "`n")
    }

    # Ensure default export for components, services, and pages
    if ($isComponentFile -or $isServiceFile -or $filePath -match '\\(components|pages|services)\\') {
        if ($content -notmatch 'export\s+default\s+') {
            $defaultExportLine = "export default $fileName;"
            $content += "`n`n$defaultExportLine"
        }
    }

    # Special handling for some known problematic files
    $specialFiles = @{
        'analytics.ts' = { 
            $content = $content -replace 'export\s+type\s+export', 'export'
        }
    }

    # Apply special handling if needed
    $fileName = [System.IO.Path]::GetFileName($filePath)
    if ($specialFiles.ContainsKey($fileName)) {
        $specialFiles[$fileName].Invoke()
    }

    # Write back to file
    $content | Set-Content $filePath -Encoding UTF8
}

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

foreach ($dir in $directories) {
    $fullPath = Join-Path $PSScriptRoot $dir
    Get-ChildItem -Path $fullPath -Recurse -Include *.ts,*.tsx | ForEach-Object {
        try {
            Fix-FileExports $_.FullName
            Write-Host "Fixed: $($_.FullName)"
        }
        catch {
            Write-Host "Error processing $($_.FullName): $_"
        }
    }
}

Write-Host "Complex export fixes completed."
