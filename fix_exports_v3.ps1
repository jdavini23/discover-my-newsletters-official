$ErrorActionPreference = 'Stop'

function Fix-ComplexExportInFile($filePath) {
    $content = Get-Content $filePath -Raw
    
    # Remove problematic export lines and trailing semicolons
    $content = $content -replace 'export type\s*=\s*default;\r?\n[a-zA-Z]+;', ''
    $content = $content -replace ';\s*$', ''
    
    # Identify the main component/function/type name
    $componentName = [System.IO.Path]::GetFileNameWithoutExtension($filePath)
    
    # Special handling for type files
    if ($filePath -like '*types*') {
        # Add type exports if missing
        $typeExports = ($content | Select-String -Pattern 'type\s+(\w+)\s*=' -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value }
        
        if ($typeExports.Count -gt 0) {
            $typeExportLines = $typeExports | ForEach-Object { "export type $_ = $($_);" }
            $content += "`n`n" + ($typeExportLines -join "`n")
        }
    }
    
    # Ensure a default export exists
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
    "src/services",
    "src/hooks",
    "src/ml"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $PSScriptRoot $dir
    Get-ChildItem -Path $fullPath -Recurse -Include *.ts,*.tsx | ForEach-Object {
        try {
            Fix-ComplexExportInFile $_.FullName
            Write-Host "Fixed: $($_.FullName)"
        }
        catch {
            Write-Host "Error processing $($_.FullName): $_"
        }
    }
}

Write-Host "Complex export fixes completed."
