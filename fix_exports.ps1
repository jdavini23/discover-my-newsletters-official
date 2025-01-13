$files = @(
    "src/utils/toastUtils.ts",
    "src/types/recommendation.ts",
    "src/types/interactions.ts",
    "src/stores/userProfileStore.ts",
    "src/pages/DashboardPage.tsx",
    "src/pages/NewsletterDetailPage.tsx",
    "src/pages/PerformanceDashboardPage.tsx",
    "src/pages/RecommendationsPage.tsx",
    "src/pages/SettingsPage.tsx",
    "src/pages/RecommendationInsightsDashboard.tsx",
    "src/pages/ProfilePage.tsx",
    "src/pages/DiscoverPage.tsx",
    "src/pages/InsightsPage.tsx",
    "src/components/admin/AdminPromotionPanel.tsx",
    "src/components/settings/SecuritySection.tsx",
    "src/components/settings/NotificationPreferencesSection.tsx",
    "src/components/settings/AppearanceSection.tsx",
    "src/components/settings/AccountSettingsSection.tsx",
    "src/components/profile/PreferencesSection.tsx",
    "src/components/profile/ProfileInfoSection.tsx",
    "src/components/profile/InteractionInsightsSection.tsx",
    "src/components/profile/AccountSettingsSection.tsx",
    "src/components/layout/Navigation.tsx",
    "src/components/layout/Layout.tsx",
    "src/components/newsletter/NewsletterInteractionPanel.tsx",
    "src/components/admin/AdminInviteManager.tsx",
    "src/components/icons/PersonalizedIcon.tsx",
    "src/components/icons/SearchIcon.tsx",
    "src/components/icons/ManageIcon.tsx",
    "src/components/icons/FilterIcon.tsx",
    "src/components/icons/CommunityIcon.tsx",
    "src/components/admin/AdminDashboard.tsx",
    "src/components/ErrorFallback.tsx",
    "src/components/ErrorBoundary.tsx",
    "src/components/ClientWrapper.tsx",
    "src/components/common/Loader.tsx",
    "src/components/common/ErrorFallback.tsx"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    $content = Get-Content $fullPath -Raw
    
    # Remove 'export type  = default;' line
    $content = $content -replace 'export type\s*=\s*default;\r?\n[a-zA-Z]+;', 'export default $&'
    
    # Ensure there's a default export
    if ($content -notmatch 'export default\s+[a-zA-Z]+') {
        $componentName = [System.IO.Path]::GetFileNameWithoutExtension($file)
        $content += "`n`nexport default $componentName;"
    }
    
    $content | Set-Content $fullPath -Encoding UTF8
}

Write-Host "Export fixes completed."
