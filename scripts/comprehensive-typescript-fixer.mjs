#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

const projectRoot = process.cwd();

function fixTypescriptFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');

    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    traverse.default(ast, {
      // Remove duplicate imports
      ImportDeclaration(path) {
        const importSource = path.node.source.value;
        const sameImports = path.parentPath.node.body.filter(
          (node) => t.isImportDeclaration(node) && node.source.value === importSource
        );

        if (sameImports.length > 1) {
          path.remove();
        }
      },

      // Fix type declarations and exports
      VariableDeclaration(path) {
        // Remove invalid type declarations
        if (
          path.node.declarations.some((decl) => t.isIdentifier(decl.id) && decl.id.name === 'type')
        ) {
          path.remove();
        }
      },

      // Clean up malformed syntax
      ExpressionStatement(path) {
        // Remove random semicolons and empty statements
        if (t.isLiteral(path.node.expression) && path.node.expression.value === null) {
          path.remove();
        }
      },
    });

    const { code: transformedCode } = generate.default(ast, {}, code);

    // Write back the transformed code
    fs.writeFileSync(filePath, transformedCode);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function findTypescriptFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findTypescriptFiles(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });

  return results;
}

function main() {
  const typescriptFiles = findTypescriptFiles(path.join(projectRoot, 'src'));

  console.log(`Found ${typescriptFiles.length} TypeScript files`);

  typescriptFiles.forEach(fixTypescriptFile);
}

main();
