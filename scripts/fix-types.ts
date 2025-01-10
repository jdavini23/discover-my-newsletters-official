#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for type fixes
const CONFIG = {
  // Directories to scan for type issues
  SCAN_DIRS: [
    'src/components',
    'src/pages',
    'src/services',
    'src/stores',
    'src/types',
    'src/utils',
    'src/ml',
  ],

  // Common type resolution strategies
  TYPE_FIXES: {
    // Resolve missing imports
    missingImports: {
      'react-hot-toast': [
        "import toast, { ToastOptions } from 'react-hot-toast';",
        "import { Toaster } from 'react-hot-toast';",
      ],
      uuid: ["import { v4 as uuidv4 } from 'uuid';"],
      recharts: [
        "import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';",
      ],
      'lucide-react': [
        "import { LightningZap, UserGroupIcon, SunIcon, MoonIcon, Star, Bookmark, Share, GroupIcon } from 'lucide-react';",
      ],
    },

    // Type declaration additions
    typeDeclarations: {
      // Add missing type declarations
      Newsletter: {
        requiredFields: [
          'id: string',
          'title: string',
          'description: string',
          'author: string',
          'category: string',
          'tags: string[]',
          'subscribers: number',
          'rating: number',
          'imageUrl: string',
          'frequency: string',
          'url: string',
          'contentType: string',
          'lastPublishedDate?: Date',
          'content?: string',
        ],
      },
      UserProfile: {
        requiredFields: [
          'onboarding: boolean',
          'role: string',
          'emailVerified: boolean',
          'isAnonymous: boolean',
          'metadata: any',
          'providerData: any[]',
        ],
      },
    },

    // Enum and constant additions
    enumFixes: {
      RecommendationAlgorithmVariant: [
        'CONTENT_BASED = "content_based"',
        'COLLABORATIVE_FILTERING = "collaborative_filtering"',
        'HYBRID_APPROACH = "hybrid_approach"',
        'POPULARITY_BASED = "popularity_based"',
      ],
      InteractionType: [
        'VIEW = "view"',
        'SUBSCRIBE = "subscribe"',
        'UNSUBSCRIBE = "unsubscribe"',
        'READ = "read"',
        'DISMISS = "dismiss"',
      ],
    },
  },

  // Utility functions for type resolution
  resolveTypeIssues: function (filePath: string) {
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Add missing imports
    Object.entries(this.TYPE_FIXES.missingImports).forEach(([module, imports]) => {
      if (
        fileContent.includes(module) &&
        Array.isArray(imports) &&
        !imports.some((imp: string) => fileContent.includes(imp))
      ) {
        fileContent = imports[0] + '\n' + fileContent;
      }
    });

    // Add type declarations
    Object.entries(this.TYPE_FIXES.typeDeclarations).forEach(([typeName, typeConfig]) => {
      if (
        fileContent.includes(typeName) &&
        typeConfig &&
        Array.isArray((typeConfig as any).requiredFields)
      ) {
        const requiredFields = (typeConfig as any).requiredFields;
        const interfaceDeclaration = `
interface ${typeName} {
  ${requiredFields.join(';\n  ')};
}`;

        if (!fileContent.includes(`interface ${typeName}`)) {
          fileContent += '\n' + interfaceDeclaration;
        }
      }
    });

    // Add enums
    Object.entries(this.TYPE_FIXES.enumFixes).forEach(([enumName, enumValues]) => {
      if (fileContent.includes(enumName) && Array.isArray(enumValues)) {
        const enumDeclaration = `
enum ${enumName} {
  ${enumValues.join(',\n  ')}
}`;

        if (!fileContent.includes(`enum ${enumName}`)) {
          fileContent += '\n' + enumDeclaration;
        }
      }
    });

    fs.writeFileSync(filePath, fileContent);
  },

  // Main type fixing process
  fixTypes: function () {
    this.SCAN_DIRS.forEach((dir) => {
      const fullPath = path.join(__dirname, dir);

      // Recursively find TypeScript files
      const findTsFiles = (dirPath: string): string[] => {
        const files = fs.readdirSync(dirPath);

        return files.reduce((acc: string[], file) => {
          const fullFilePath = path.join(dirPath, file);
          const stat = fs.statSync(fullFilePath);

          if (stat.isDirectory()) {
            return [...acc, ...findTsFiles(fullFilePath)];
          } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            return [...acc, fullFilePath];
          }

          return acc;
        }, []);
      };

      const tsFiles = findTsFiles(fullPath);

      tsFiles.forEach((filePath) => {
        try {
          this.resolveTypeIssues(filePath);
          console.log(`Fixed types in: ${filePath}`);
        } catch (error) {
          console.error(`Error fixing types in ${filePath}:`, error);
        }
      });
    });
  },
};

// Run type fixing process
CONFIG.fixTypes();
