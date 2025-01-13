#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

function fixTypescriptFile(filePath) {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse the file with TypeScript compiler
    const sourceFile = ts.createSourceFile(
      path.basename(filePath),
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Create a printer to generate corrected code
    const printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
      removeComments: false,
    });

    // Function to transform problematic nodes
    function transform(context) {
      return (rootNode) => {
        function visit(node) {
          // Fix duplicate React imports
          if (ts.isImportDeclaration(node)) {
            const moduleSpecifier = node.moduleSpecifier;
            if (
              ts.isStringLiteral(moduleSpecifier) &&
              moduleSpecifier.text === 'react' &&
              node.importClause?.namedBindings
            ) {
              // Ensure only unique imports
              return null;
            }
          }

          // Remove invalid type declarations
          if (ts.isTypeAliasDeclaration(node) && node.name.getText() === 'type') {
            return null;
          }

          // Standardize React imports
          if (ts.isImportDeclaration(node)) {
            const moduleSpecifier = node.moduleSpecifier;
            if (ts.isStringLiteral(moduleSpecifier) && moduleSpecifier.text === 'react') {
              return ts.factory.createImportDeclaration(
                undefined,
                ts.factory.createImportClause(
                  false,
                  ts.factory.createIdentifier('React'),
                  undefined
                ),
                moduleSpecifier
              );
            }
          }

          return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(rootNode, visit);
      };
    }

    // Apply transformations
    const result = ts.transform(sourceFile, [transform]);
    const transformedSourceFile = result.transformed[0];

    // Print the corrected file
    const correctedCode = printer.printFile(transformedSourceFile);

    // Write back the corrected code
    fs.writeFileSync(filePath, correctedCode);
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
  const projectRoot = process.cwd();
  const typescriptFiles = findTypescriptFiles(path.join(projectRoot, 'src'));

  console.log(`Found ${typescriptFiles.length} TypeScript files`);

  typescriptFiles.forEach(fixTypescriptFile);
}

main();
