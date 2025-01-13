$ErrorActionPreference = 'Stop'

function Fix-ExportInFile($filePath) {
    $content = Get-Content $filePath -Raw
    
    # Remove problematic export lines
    $content = $content -replace 'export type\s*=\s*default;\r?\n[a-zA-Z]+;', ''
    
    # Identify the main component/function name
    $componentName = [System.IO.Path]::GetFileNameWithoutExtension($filePath)
    
    # If no default export exists, add one
    if ($content -notmatch 'export\s+default\s+') {
        $defaultExportLine = "export default $componentName;"
        $content += "`n`n$defaultExportLine"
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
    "src/services"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $PSScriptRoot $dir
    Get-ChildItem -Path $fullPath -Recurse -Include *.ts,*.tsx | ForEach-Object {
        try {
            Fix-ExportInFile $_.FullName
            Write-Host "Fixed: $($_.FullName)"
        }
        catch {
            Write-Host "Error processing $($_.FullName): $_"
        }
    }
}

Write-Host "Export fixes completed."
