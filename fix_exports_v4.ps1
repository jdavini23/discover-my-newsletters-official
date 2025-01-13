$ErrorActionPreference = 'Stop'

function Fix-FileExports($filePath) {
    $content = Get-Content $filePath -Raw
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($filePath)
    $fileExtension = [System.IO.Path]::GetExtension($filePath)

    # Remove problematic export lines
    $content = $content -replace 'export\s+type\s*=\s*default;', ''
    $content = $content -replace ';\s*$', ''

    # Determine if it's a type, interface, or component file
    $isTypeFile = $filePath -match '\\types\\' -or $fileExtension -eq '.ts'
    $isComponentFile = $fileExtension -eq '.tsx'

    # Handle type files
    if ($isTypeFile) {
        # Find all type/interface definitions
        $typeMatches = [regex]::Matches($content, '(type|interface)\s+(\w+)')
        $typeExports = $typeMatches | ForEach-Object { $_.Groups[2].Value }
        
        if ($typeExports.Count -gt 0) {
            $typeExportLines = $typeExports | ForEach-Object { "export type $_ = $_;" }
            $content += "`n`n" + ($typeExportLines -join "`n")
        }
    }

    # Ensure default export for components and pages
    if ($isComponentFile -or $filePath -match '\\(components|pages|services)\\') {
        if ($content -notmatch 'export\s+default\s+') {
            $defaultExportLine = "export default $fileName;"
            $content += "`n`n$defaultExportLine"
        }
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
