# Dependency Scanning Script

# Ensure we're in the right directory
Set-Location "c:/Users/joeda/Desktop/discover-my-newsletters/backend"

# 1. NPM Audit (Basic Vulnerability Scanning)
Write-Host "Running NPM Audit..." -ForegroundColor Green
$auditResult = npm audit --json | ConvertFrom-Json

# Check and categorize vulnerabilities
$criticalVulns = $auditResult.vulnerabilities | Where-Object { $_.severity -eq 'critical' }
$highVulns = $auditResult.vulnerabilities | Where-Object { $_.severity -eq 'high' }
$moderateVulns = $auditResult.vulnerabilities | Where-Object { $_.severity -eq 'moderate' }
$lowVulns = $auditResult.vulnerabilities | Where-Object { $_.severity -eq 'low' }

Write-Host "`nVulnerability Summary:" -ForegroundColor Yellow
Write-Host "Critical Vulnerabilities: $($criticalVulns.Count)" -ForegroundColor Red
Write-Host "High Vulnerabilities: $($highVulns.Count)" -ForegroundColor DarkRed
Write-Host "Moderate Vulnerabilities: $($moderateVulns.Count)" -ForegroundColor Yellow
Write-Host "Low Vulnerabilities: $($lowVulns.Count)" -ForegroundColor Green

# 2. Detailed Vulnerability Information
if ($criticalVulns -or $highVulns) {
    Write-Host "`nDetailed Vulnerability Information:" -ForegroundColor Red
    $auditResult.vulnerabilities.PSObject.Properties | ForEach-Object {
        $vuln = $_.Value
        if ($vuln.severity -in @('critical', 'high')) {
            Write-Host "`nPackage: $($vuln.name)" -ForegroundColor Cyan
            Write-Host "Severity: $($vuln.severity)" -ForegroundColor Yellow
            Write-Host "Overview: $($vuln.overview)" -ForegroundColor White
            Write-Host "Recommendation: $($vuln.recommendation)" -ForegroundColor Green
        }
    }
}

# 3. Snyk Dependency Scanning (if installed)
Write-Host "`nRunning Snyk Dependency Scan..." -ForegroundColor Green
if (Get-Command snyk -ErrorAction SilentlyContinue) {
    snyk test
} else {
    Write-Host "Snyk not installed. Install with 'npm install -g snyk'" -ForegroundColor Yellow
}

# 4. Dependency Checking
Write-Host "`nChecking for Outdated Dependencies..." -ForegroundColor Green
npm outdated

# 5. License Compliance Check
Write-Host "`nChecking Dependency Licenses..." -ForegroundColor Green
if (Get-Command license-checker -ErrorAction SilentlyContinue) {
    license-checker
} else {
    Write-Host "license-checker not installed. Install with 'npm install -g license-checker'" -ForegroundColor Yellow
}

# 6. Dependency Size Analysis
Write-Host "`nAnalyzing Dependency Sizes..." -ForegroundColor Green
npm-stats

# Optional: Generate a comprehensive report
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportPath = "c:/Users/joeda/Desktop/discover-my-newsletters/dependency-report-$timestamp.txt"

# Redirect output to report file
Start-Transcript -Path $reportPath

Write-Host "Dependency Vulnerability Report" -ForegroundColor Cyan
Write-Host "Generated on: $(Get-Date)" -ForegroundColor Gray

Write-Host "`nNPM Audit Results:" -ForegroundColor Green
npm audit

Write-Host "`nOutdated Dependencies:" -ForegroundColor Green
npm outdated

if (Get-Command license-checker -ErrorAction SilentlyContinue) {
    Write-Host "`nLicense Compliance:" -ForegroundColor Green
    license-checker
}

Stop-Transcript

Write-Host "`nFull Dependency Report generated at: $reportPath" -ForegroundColor Cyan

# Optional: Suggest fixes for critical vulnerabilities
if ($criticalVulns -or $highVulns) {
    Write-Host "`nRecommended Actions:" -ForegroundColor Yellow
    Write-Host "1. Run 'npm audit fix' to automatically fix some vulnerabilities" -ForegroundColor White
    Write-Host "2. Manually review and update packages with critical/high severity" -ForegroundColor White
}
