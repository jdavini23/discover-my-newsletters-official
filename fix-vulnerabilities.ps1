# Vulnerability Fixing Script

# Ensure we're in the right directory
Set-Location "c:/Users/joeda/Desktop/discover-my-newsletters/backend"

# Function to log actions
function Write-ActionLog {
    param(
        [string]$Message, 
        [string]$Color = 'Green'
    )
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Color
}

# Function to run npm commands safely
function Invoke-NpmCommand {
    param(
        [string[]]$Arguments,
        [string]$SuccessMessage = "Command completed successfully.",
        [string]$FailureMessage = "Command failed."
    )
    try {
        Write-Host "Running: npm $Arguments"
        $result = & npm $Arguments 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ActionLog $SuccessMessage Green
            return $result
        } else {
            Write-ActionLog $FailureMessage Red
            Write-Host ($result | Out-String)
            return $null
        }
    } catch {
        Write-ActionLog "Error executing npm command: $($_.Exception.Message)" Red
        return $null
    }
}

# 1. Automatic Vulnerability Fixes
Write-ActionLog "Attempting to automatically fix vulnerabilities..." Yellow

# Try automatic npm audit fix
Invoke-NpmCommand -Arguments "audit", "fix", "--force" -SuccessMessage "Automatic vulnerability fixes completed successfully." -FailureMessage "Automatic fix encountered issues."

# 2. Upgrade Packages
Write-ActionLog "Checking for package upgrades..." Yellow

# Capture outdated packages
$outdatedPackagesJson = Invoke-NpmCommand -Arguments "outdated", "--json"
if ($outdatedPackagesJson) {
    try {
        $outdatedPackages = $outdatedPackagesJson | ConvertFrom-Json
    } catch {
        Write-ActionLog "No outdated packages or invalid JSON output." Yellow
        $outdatedPackages = $null
    }

    if ($outdatedPackages) {
        Write-ActionLog "Outdated Packages Detected:" Yellow
        $outdatedPackages.PSObject.Properties | ForEach-Object {
            $packageName = $_.Name
            $currentVersion = $_.Value.Current
            $latestVersion = $_.Value.Latest
            
            Write-Host "- $packageName : $currentVersion -> $latestVersion" -ForegroundColor Cyan
            
            # Attempt to upgrade package
            Invoke-NpmCommand -Arguments "install", "$packageName@$latestVersion" -SuccessMessage "Successfully upgraded $packageName" -FailureMessage "Failed to upgrade $packageName"
        }
    } else {
        Write-ActionLog "No outdated packages found." Green
    }
} else {
    Write-ActionLog "Could not retrieve outdated packages." Yellow
}

# 3. Detailed Vulnerability Analysis
Write-ActionLog "Performing detailed vulnerability scan..." Yellow

# Capture audit results
$auditResultJson = Invoke-NpmCommand -Arguments "audit", "--json"
if ($auditResultJson) {
    try {
        $auditResult = $auditResultJson | ConvertFrom-Json
    } catch {
        Write-ActionLog "Unable to parse audit results. Raw output:" Yellow
        Write-Host ($auditResultJson | Out-String)
        $auditResult = $null
    }

    # Categorize vulnerabilities
    if ($auditResult) {
        $criticalVulns = $auditResult.vulnerabilities | Where-Object { $_.severity -eq 'critical' }
        $highVulns = $auditResult.vulnerabilities | Where-Object { $_.severity -eq 'high' }

        # Handle Critical and High Vulnerabilities
        if ($criticalVulns -or $highVulns) {
            Write-ActionLog "Critical/High Vulnerabilities Detected. Manual intervention required." Red
            
            # Detailed Vulnerability Information
            $vulnerabilities = $criticalVulns + $highVulns
            $vulnerabilities | ForEach-Object {
                $vuln = $_
                Write-Host "`nPackage: $($vuln.name)" -ForegroundColor Cyan
                Write-Host "Severity: $($vuln.severity)" -ForegroundColor Yellow
                Write-Host "Overview: $($vuln.overview)" -ForegroundColor White
                Write-Host "Recommendation: $($vuln.recommendation)" -ForegroundColor Green
                
                # Attempt specific fixes
                switch ($vuln.name) {
                    # Add specific package fixing logic here
                    default {
                        Write-ActionLog "No specific fix found for $($vuln.name). Manual review recommended." Yellow
                    }
                }
            }
            
            # Generate Remediation Report
            $reportPath = "c:/Users/joeda/Desktop/discover-my-newsletters/vulnerability-remediation-$(Get-Date -Format 'yyyyMMddHHmmss').txt"
            $vulnerabilities | Format-List | Out-File $reportPath
            Write-ActionLog "Vulnerability remediation report generated at: $reportPath" Cyan
        } else {
            Write-ActionLog "No critical or high-severity vulnerabilities found." Green
        }
    } else {
        Write-ActionLog "Could not process vulnerability audit results." Yellow
    }
} else {
    Write-ActionLog "Failed to retrieve vulnerability audit results." Yellow
}

# 4. Security Best Practices Recommendations
Write-ActionLog "`nSecurity Recommendations:" Yellow
@(
    "Regularly update dependencies",
    "Use 'npm audit' to check for vulnerabilities",
    "Consider using Snyk for advanced vulnerability tracking",
    "Review and update packages with known security issues",
    "Implement dependency scanning in CI/CD pipeline"
) | ForEach-Object {
    Write-Host "- $_" -ForegroundColor White
}

# Final Audit
Write-ActionLog "`nFinal Vulnerability Scan:" Yellow
& npm audit
