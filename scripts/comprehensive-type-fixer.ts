import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as ts from 'typescript';

// Type definitions
type ErrorContext = string | undefined;

// Detailed global error handler
function handleError(error: unknown, context?: ErrorContext): never {
  console.error('=== COMPREHENSIVE TYPE FIXER ERROR ===');
  console.error('Context:', context || 'Unknown');

  if (error instanceof Error) {
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  } else {
    console.error('Error:', error);
  }

  console.error('=== END ERROR DETAILS ===');
  process.exit(1);
}

// Global error handlers
process.on('uncaughtException', (error) => {
  handleError(error, 'Uncaught Exception');
});

process.on('unhandledRejection', (reason) => {
  handleError(reason, 'Unhandled Rejection');
});

// Get the current file path equivalent to __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Centralized type definitions
export type GlobalTypes = {
  // Basic utility types
  Nullable: <T>(t: T) => T | null | undefined;
  Optional: <T>(t: T) => T | undefined;
  Dictionary: <T>(t: T) => { [key: string]: T };
  Primitive: string | number | boolean | null | undefined;

  // Domain-specific types
  UserRole: 'user' | 'admin';
  NewsletterFrequency: 'daily' | 'weekly' | 'monthly';
  EventPlatform: 'web' | 'mobile' | 'desktop';
};

// Ensure this is the first log
console.log('Comprehensive Type Fixer: Starting...');

console.log('Script Details:');
console.log('__filename:', __filename);
console.log('__dirname:', __dirname);

// Global types file content
const GLOBAL_TYPES = `
// Centralized global type definitions
export type GlobalTypes = {
  // Basic utility types
  Nullable: <T>(t: T) => T | null | undefined;
  Optional: <T>(t: T) => T | undefined;
  Dictionary: <T>(t: T) => { [key: string]: T };
  Primitive: string | number | boolean | null | undefined;
  
  // Domain-specific types
  UserRole: 'user' | 'admin';
  NewsletterFrequency: 'daily' | 'weekly' | 'monthly';
  EventPlatform: 'web' | 'mobile' | 'desktop';
}
`;

async function safeReadFile(filePath: string): Promise<string> {
  try {
    const fileBuffer = await readFile(filePath, 'utf-8');
    return fileBuffer.toString();
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`File not found: ${filePath}`);
      return '';
    }
    handleError(error, `Reading file: ${filePath}`);
  }
}

async function safeWriteFile(filePath: string, content: string) {
  try {
    await writeFile(filePath, content, 'utf-8');
    console.log(`Successfully wrote: ${filePath}`);
  } catch (error) {
    handleError(error, `Writing file: ${filePath}`);
  }
}

function cleanupImports(content: string): string {
  try {
    // Remove duplicate imports
    const importLines = content.match(/^import\s+.*$/gm) || [];
    const uniqueImports = new Set<string>();
    const cleanedImports = importLines.filter((line) => {
      if (uniqueImports.has(line)) return false;
      uniqueImports.add(line);
      return true;
    });

    // Replace original import lines with unique imports
    return content.replace(/^import\s+.*$/gm, '').trimStart() + cleanedImports.join('\n') + '\n\n';
  } catch (error) {
    handleError(error, 'Cleaning up imports');
  }
}

function processUnknownTypeHandling(content: string): string {
  try {
    // Replace 'any' with 'unknown' where possible
    content = content.replace(/:\s*any\b/g, ': unknown');

    // Add type guards for unknown types
    content = content.replace(
      /function\s+(\w+)\s*\(([^)]+):\s*unknown\)/g,
      'function $1($2: unknown) {\n  if ($2) {\n    // Type guard\n  }\n}'
    );

    return content;
  } catch (error) {
    handleError(error, 'Processing unknown type handling');
  }
}

function fixSyntaxErrors(content: string): string {
  try {
    // Fix common syntax errors
    content = content.replace(/export\s+default\s+const/g, 'export const');

    // Remove invalid export modifiers
    content = content.replace(/export\s+const\s+export\s+/g, 'export ');

    // Fix element access expressions missing arguments
    content = content.replace(/\[\s*\]/g, '[0]');

    // Fix missing identifiers in JSX
    content = content.replace(/{\s*\.{3}\s*}/g, '{ ...props }');

    // Fix unclosed JSX tags
    content = content.replace(/<([A-Za-z][A-Za-z0-9]*)\s*>([^<]*$)/g, '<$1>$2</$1>');

    // Fix missing expressions in template literals
    content = content.replace(/\${(\s*)}/g, '${undefined}');

    // Fix missing expressions after keywords
    content = content.replace(/return\s*;/g, 'return undefined;');
    content = content.replace(/return\s+}/g, 'return undefined; }');
    content = content.replace(/const\s+}/g, 'const temp = undefined; }');
    content = content.replace(/let\s+}/g, 'let temp = undefined; }');

    // Fix missing type arguments
    content = content.replace(/<\s*>/g, '<unknown>');

    // Fix invalid type declarations
    content = content.replace(/type\s+(\w+)\s*=\s*{/g, 'type $1 = {');
    content = content.replace(/interface\s+(\w+)\s*{/g, 'interface $1 {');

    // Fix missing type annotations
    content = content.replace(/:\s*(?=,|;|\)|})/g, ': unknown');

    // Fix missing expressions in object literals
    content = content.replace(/,\s*}/g, '}');
    content = content.replace(/{\s*,/g, '{');

    // Fix missing expressions in array literals
    content = content.replace(/\[\s*,/g, '[');
    content = content.replace(/,\s*\]/g, ']');

    return content;
  } catch (error) {
    handleError(error, 'Fixing syntax errors');
  }
}

async function fixTypeScriptFile(filePath: string): Promise<void> {
  try {
    console.log(`Fixing TypeScript file: ${filePath}`);

    // Read the file
    const fileContent = await safeReadFile(filePath);

    // Create a source file
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

    // Create a transformer
    function transformer(context: ts.TransformationContext) {
      return (rootNode: ts.Node) => {
        function visit(node: ts.Node): ts.Node {
          // Remove 'const' from type aliases
          if (ts.isTypeAliasDeclaration(node)) {
            const modifiers = node.modifiers?.filter((m) => m.kind !== ts.SyntaxKind.ConstKeyword);

            return ts.factory.createTypeAliasDeclaration(
              modifiers,
              node.name,
              node.typeParameters,
              node.type
            );
          }

          // Remove 'default' from exports
          if (
            ts.isExportAssignment(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.getText() === 'default'
          ) {
            return ts.factory.createExportAssignment(undefined, undefined, node.expression);
          }

          // Fix unclosed JSX tags
          if (ts.isJsxElement(node)) {
            if (!node.closingElement) {
              return ts.factory.createJsxElement(
                node.openingElement,
                node.children,
                ts.factory.createJsxClosingElement(
                  ts.factory.createIdentifier(node.openingElement.tagName.getText())
                )
              );
            }
          }

          // Remove invalid export modifiers and handle export declarations
          if (ts.isExportDeclaration(node)) {
            const modifiers = node.modifiers?.filter((m) => m.kind !== ts.SyntaxKind.ConstKeyword);

            return ts.factory.createExportDeclaration(
              modifiers,
              node.isTypeOnly,
              node.exportClause,
              node.moduleSpecifier
            );
          }

          // Fix unterminated template literals
          if (ts.isNoSubstitutionTemplateLiteral(node)) {
            const text = node.getText();
            if (!text.endsWith('`')) {
              return ts.factory.createNoSubstitutionTemplateLiteral(
                text.replace(/`/g, ''),
                text.replace(/`/g, '')
              );
            }
          }

          // Fix element access expressions
          if (ts.isElementAccessExpression(node)) {
            if (!node.argumentExpression) {
              return ts.factory.createElementAccessExpression(
                node.expression,
                ts.factory.createNumericLiteral(0)
              );
            }
          }

          // Handle missing identifiers in template literals
          if (ts.isTemplateExpression(node)) {
            const fixedSpans = node.templateSpans.map((span) => {
              if (!span.expression) {
                return ts.factory.createTemplateSpan(
                  ts.factory.createIdentifier('undefined'),
                  span.literal
                );
              }
              return span;
            });

            return ts.factory.createTemplateExpression(node.head, fixedSpans);
          }

          // Fix missing expressions in function bodies
          if (
            ts.isFunctionDeclaration(node) ||
            ts.isArrowFunction(node) ||
            ts.isFunctionExpression(node)
          ) {
            if (!node.body) {
              return ts.factory.createFunctionDeclaration(
                node.modifiers,
                node.asteriskToken,
                node.name,
                node.typeParameters,
                node.parameters,
                node.type,
                ts.factory.createBlock([
                  ts.factory.createReturnStatement(ts.factory.createIdentifier('undefined')),
                ])
              );
            }
          }

          // Handle missing object literal properties
          if (ts.isObjectLiteralExpression(node)) {
            const fixedProperties = node.properties.map((prop) => {
              if (ts.isPropertyAssignment(prop) && !prop.initializer) {
                return ts.factory.createPropertyAssignment(
                  prop.name,
                  ts.factory.createIdentifier('undefined')
                );
              }
              return prop;
            });

            return ts.factory.createObjectLiteralExpression(
              fixedProperties,
              node.properties.length > 0
            );
          }

          return ts.visitEachChild(node, visit, context);
        }

        return ts.visitNode(rootNode, visit);
      };
    }

    // Transform the source file
    const result = ts.transform(sourceFile, [transformer]);
    const transformedSourceFile = result.transformed[0];

    // Create a printer
    const printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
    });

    // Print the transformed source file
    const transformedCode = printer.printNode(
      ts.EmitHint.SourceFile,
      transformedSourceFile as ts.SourceFile,
      sourceFile
    );

    // Write the corrected file
    await safeWriteFile(filePath, transformedCode);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    handleError(error, `Fixing TypeScript file: ${filePath}`);
  }
}

async function findTypescriptFiles(dir: string): Promise<string[]> {
  const tsFiles: string[] = [];

  async function traverseDirectory(currentPath: string) {
    try {
      console.log(`Traversing directory: ${currentPath}`);
      const files = await readdir(currentPath);

      for (const file of files) {
        const fullPath = join(currentPath, file);
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          // Skip specific directories
          if (!['node_modules', 'dist', 'build'].includes(file)) {
            await traverseDirectory(fullPath);
          }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          tsFiles.push(fullPath);
        }
      }
    } catch (error) {
      handleError(error, `Traversing directory: ${currentPath}`);
    }
  }

  await traverseDirectory(dir);
  return tsFiles;
}

async function main() {
  try {
    console.log('Starting main type fixing function...');

    // Write global types file
    const globalTypesPath = resolve(__dirname, '../src/types/global.ts');
    console.log(`Global types path: ${globalTypesPath}`);
    await safeWriteFile(globalTypesPath, GLOBAL_TYPES);

    // Find and process all TypeScript files
    const baseDir = resolve(__dirname, '../src');
    console.log(`Base directory: ${baseDir}`);

    const tsFiles = await findTypescriptFiles(baseDir);

    console.log(`Found ${tsFiles.length} TypeScript files to process.`);
    console.log('Files:', tsFiles);

    // Process files to add global types
    for (const file of tsFiles) {
      await processFile(file);
      await fixTypeScriptFile(file);
    }

    console.log('Type fixing complete.');
    process.exit(0);
  } catch (error) {
    handleError(error, 'Main type fixing function');
  }
}

async function processFile(filePath: string) {
  try {
    console.log(`Processing file: ${filePath}`);
    let content = await safeReadFile(filePath);

    // Remove existing global type declarations
    content = content.replace(
      /export\s+type\s+(UserRole|NewsletterFrequency|EventPlatform|FirebaseUser)\s*=\s*[^;]+;/g,
      ''
    );

    // Add import for global types
    const importStatement = `import type { GlobalTypes } from '@/types/global';\n\n`;

    // Remove existing global type imports
    content = content.replace(
      /import\s+(?:type\s+)?{[^}]*(?:UserRole|NewsletterFrequency|EventPlatform|FirebaseUser)[^}]*}\s+from\s+['"][^'"]+['"];?/gm,
      ''
    );

    content = importStatement + content;

    // Cleanup imports
    content = cleanupImports(content);

    // Handle unknown type issues
    content = processUnknownTypeHandling(content);

    // Fix syntax errors
    content = fixSyntaxErrors(content);

    // Ensure type-only exports use `export type`
    content = content.replace(/^export\s+(?!type\s)(\w+)/gm, 'export type $1');

    // Fix missing type parameters
    content = content.replace(/:\s*Array(?!<)/g, ': Array<unknown>');
    content = content.replace(/:\s*Promise(?!<)/g, ': Promise<unknown>');
    content = content.replace(/:\s*Record(?!<)/g, ': Record<string, unknown>');

    // Fix invalid JSX expressions
    content = content.replace(/{\s*\.\.\.\s*}/g, '{ ...props }');
    content = content.replace(/{\s*\.\.\.\s*,/g, '{ ...props,');

    await safeWriteFile(filePath, content);
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    handleError(error, `Processing file: ${filePath}`);
  }
}

// Ensure the script runs
main().catch((error) => handleError(error, 'Main function'));
