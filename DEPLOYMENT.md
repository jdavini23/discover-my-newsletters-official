# Deployment Guide for Discover My Newsletters

## Firebase Deployment Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Firebase CLI
- GitHub Account

### Local Setup

1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

2. Login to Firebase

```bash
firebase login
```

3. Initialize Firebase in project

```bash
firebase init hosting
```

### Deployment Branches

- `main`: Production environment
- `develop`: Staging environment
- `staging`: Testing environment

### Deployment Commands

- Deploy to staging:

```bash
npm run deploy:staging
```

- Deploy to production:

```bash
npm run deploy:production
```

### GitHub Actions

Automated deployments are configured in `.github/workflows/`:

- `firebase-hosting-merge.yml`: Deploys on merge to main
- `firebase-hosting-pull-request.yml`: Creates preview channels for PRs

### Service Account Setup

1. Generate service account key
2. Add to GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT_DISCOVER_MY_NEWSLETTERS`

### Troubleshooting

- Ensure Firebase project is correctly configured
- Check GitHub Actions logs for deployment issues
- Verify environment variables in `.env` files
