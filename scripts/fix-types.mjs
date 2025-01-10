#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Comprehensive type fixes
const typeFixes = {
  missingImports: {
    // Resolve duplicate toast imports
    'react-hot-toast': `
import toast, { 
  Toast as HotToast, 
  ToastOptions as HotToastOptions, 
  DefaultToastOptions, 
  Message 
} from "react-hot-toast";
const ToastOptions = HotToastOptions;
    `,

    // Resolve multiple UUID imports
    uuid: 'import { v4 as uuidv4 } from "uuid";',

    // Resolve Lucide React icon imports
    'lucide-react': `
import { 
  LightningZap, 
  UserGroupIcon as LucideUserGroupIcon, 
  GroupIcon, 
  SunIcon, 
  MoonIcon, 
  Star as LucideStar, 
  Bookmark as LucideBookmark, 
  Share as LucideShare 
} from "lucide-react";
    `,

    // Resolve React imports
    react: `
import React, { ReactNode } from 'react';
    `,

    // Resolve motion imports
    'framer-motion': `
import { motion as FramerMotion } from 'framer-motion';
const motion = FramerMotion;
    `,
  },

  typeDeclarations: {
    Newsletter: `
export interface Newsletter {
  id: string;
  title: string;
  description: string;
  author?: string;
  category: string;
  tags: string[];
  subscribers: number;
  rating?: number;
  imageUrl: string;
  frequency: string;
  url: string;
  contentType: string;
  lastPublishedDate?: Date;
  content?: string;
}`,

    UserProfile: `
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  interests: string[];
  onboarding: boolean;
  role: 'user' | 'admin' | 'moderator';
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: any;
  providerData: any[];
  newsletterPreferences?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
  };
  activityLog?: Array<{
    type: string;
    timestamp: Date;
    details?: any;
  }>;
}`,

    ResponsiveState: `
export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}`,

    EventOptions: `
export interface EventOptions {
  userId: string;
  userSegment: string;
  platform: 'web' | 'mobile';
  source: string;
}`,
  },

  enumDeclarations: {
    RecommendationAlgorithmVariant: `
export enum RecommendationAlgorithmVariant {
  CONTENT_BASED = 'content_based',
  COLLABORATIVE_FILTERING = 'collaborative_filtering',
  HYBRID_APPROACH = 'hybrid_approach',
  POPULARITY_BASED = 'popularity_based'
}`,

    InteractionType: `
export enum InteractionType {
  VIEW = 'view',
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  READ = 'read',
  DISMISS = 'dismiss',
  LIKE = 'like',
  SHARE = 'share'
}`,

    UserStatus: `
export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}`,

    AuthProvider: `
export enum AuthProvider {
  GOOGLE = 'google.com',
  FACEBOOK = 'facebook.com',
  TWITTER = 'twitter.com',
  GITHUB = 'github.com',
  EMAIL = 'password'
}`,
  },
};

// Recursively find TypeScript files
function findTsFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    const tsFiles = [];

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        tsFiles.push(...findTsFiles(fullPath));
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        tsFiles.push(fullPath);
      }
    }

    return tsFiles;
  } catch (error) {
    console.error(`Error finding TS files in ${dir}:`, error);
    return [];
  }
}

// Fix types in a single file
function fixTypesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Add missing imports
    for (const [module, importStatement] of Object.entries(typeFixes.missingImports)) {
      if (content.includes(module) && !content.includes(importStatement.trim())) {
        content = importStatement + '\n' + content;
        modified = true;
      }
    }

    // Add type declarations
    for (const [typeName, typeDeclaration] of Object.entries(typeFixes.typeDeclarations)) {
      const typeRegex = new RegExp(`(interface|type)\\s+${typeName}\\b`);
      if (content.includes(typeName) && !typeRegex.test(content)) {
        content += '\n' + typeDeclaration;
        modified = true;
      }
    }

    // Add enum declarations
    for (const [enumName, enumDeclaration] of Object.entries(typeFixes.enumDeclarations)) {
      const enumRegex = new RegExp(`enum\\s+${enumName}\\b`);
      if (content.includes(enumName) && !enumRegex.test(content)) {
        content += '\n' + enumDeclaration;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed types in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing types in ${filePath}:`, error);
  }
}

// Main function to fix types across the project
function fixProjectTypes() {
  const projectRoot = process.cwd();
  const sourceDirs = [
    'src/components',
    'src/pages',
    'src/services',
    'src/stores',
    'src/types',
    'src/utils',
    'src/ml',
  ];

  for (const dir of sourceDirs) {
    const fullPath = path.join(projectRoot, dir);
    const tsFiles = findTsFiles(fullPath);

    for (const file of tsFiles) {
      fixTypesInFile(file);
    }
  }

  console.log('Type fixing process completed.');
}

// Run the type fixing process
fixProjectTypes();
