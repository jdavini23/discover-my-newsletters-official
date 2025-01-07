#!/bin/bash

# Frontend .env
read -p "Enter Firebase Web API Key: " API_KEY
read -p "Enter Firebase Auth Domain: " AUTH_DOMAIN
read -p "Enter Firebase Project ID: " PROJECT_ID
read -p "Enter Firebase Storage Bucket: " STORAGE_BUCKET
read -p "Enter Firebase Messaging Sender ID: " MESSAGING_SENDER_ID
read -p "Enter Firebase App ID: " APP_ID

# Backend .env
read -p "Enter Firebase Project ID for Backend: " BACKEND_PROJECT_ID
read -p "Enter Firebase Client Email: " CLIENT_EMAIL
read -p "Enter Firebase Private Key (paste entire key, including newlines): " PRIVATE_KEY

# Frontend Environment
echo "NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID" > /Users/joedavini/CascadeProjects/discover-my-newsletterss/newsletter-frontend/.env.local

# Backend Environment
echo "FIREBASE_PROJECT_ID=$BACKEND_PROJECT_ID
FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL
FIREBASE_PRIVATE_KEY='$PRIVATE_KEY'" > /Users/joedavini/CascadeProjects/discover-my-newsletterss/newsletter-backend/.env.local

echo "Environment files created successfully!"
