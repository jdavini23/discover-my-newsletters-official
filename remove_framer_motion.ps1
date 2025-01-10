param(
    [string]$ProjectRoot = "c:/Users/joeda/CascadeProjects/discover-my-newsletterss-1/discover-my-newsletters-official/src"
)

# Function to remove Framer Motion imports and replace motion components
function Remove-FramerMotion {
    param([string]$FilePath)

    $content = Get-Content $FilePath -Raw

    # Remove imports
    $content = $content -replace 'import\s*{[^}]*motion[^}]*}\s*from\s*[''"]framer-motion[''"];?', ''
    $content = $content -replace 'import\s*{[^}]*AnimatePresence[^}]*}\s*from\s*[''"]framer-motion[''"];?', ''

    # Specific replacements for motion components
    $content = $content -replace '\<motion\.div', '<div'
    $content = $content -replace '\<motion\.span', '<span'
    $content = $content -replace '\<motion\.section', '<section'
    $content = $content -replace '\<motion\.article', '<article'
    $content = $content -replace '\<motion\.header', '<header'
    $content = $content -replace '\<motion\.footer', '<footer'
    $content = $content -replace '\<motion\.nav', '<nav'
    $content = $content -replace '\<motion', '<div'

    # Close tags
    $content = $content -replace '\</motion\.div', '</div'
    $content = $content -replace '\</motion\.span', '</span'
    $content = $content -replace '\</motion\.section', '</section'
    $content = $content -replace '\</motion\.article', '</article'
    $content = $content -replace '\</motion\.header', '</header'
    $content = $content -replace '\</motion\.footer', '</footer'
    $content = $content -replace '\</motion\.nav', '</nav'
    $content = $content -replace '\</motion', '</div'

    # Remove motion-specific props
    $content = $content -replace '\s*initial=\{[^}]+\}', ''
    $content = $content -replace '\s*animate=\{[^}]+\}', ''
    $content = $content -replace '\s*exit=\{[^}]+\}', ''
    $content = $content -replace '\s*transition=\{[^}]+\}', ''
    $content = $content -replace '\s*variants=\{[^}]+\}', ''
    $content = $content -replace '\s*whileHover=\{[^}]+\}', ''
    $content = $content -replace '\s*whileTap=\{[^}]+\}', ''

    # Remove AnimatePresence
    $content = $content -replace '\<AnimatePresence[^>]*\>', ''
    $content = $content -replace '\</AnimatePresence\>', ''

    Set-Content $FilePath $content
}

# Find and process files
Get-ChildItem -Path $ProjectRoot -Recurse -File | 
    Where-Object { 
        $_.Extension -in '.tsx', '.ts', '.js' -and 
        (Select-String -Path $_.FullName -Pattern 'framer-motion' -Quiet)
    } | 
    ForEach-Object { 
        Remove-FramerMotion -FilePath $_.FullName
        Write-Host "Processed: $($_.FullName)"
    }

# Note: Skipping npm uninstall to avoid dependency conflicts
