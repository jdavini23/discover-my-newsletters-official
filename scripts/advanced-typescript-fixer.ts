import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as ts from 'typescript';

async function fixTypeScriptFile(filePath: string): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8');
    let fixedContent = content;

    // Fix import statements
    fixedContent = fixedContent.replace(
      /import\s+{([^}]+)}\s+from\s+(['"])([^'"]+)\2(?!\s*;)/g,
      'import { $1 } from $2$3$2;'
    );

    // Fix export statements
    fixedContent = fixedContent.replace(
      /export\s+(?:interface|type|class|const|function)\s+(\w+)(?!\s*[{=])/g,
      'export $1 = '
    );

    // Fix interface declarations
    fixedContent = fixedContent.replace(/interface\s+(\w+)(?!\s*[{<])/g, 'interface $1 {');

    // Fix type declarations
    fixedContent = fixedContent.replace(/type\s+(\w+)(?!\s*[=<])/g, 'type $1 = ');

    // Fix React component declarations
    fixedContent = fixedContent.replace(
      /const\s+(\w+)\s*:\s*React\.FC(?!\s*[<])/g,
      'const $1: React.FC<Props>'
    );

    // Fix missing semicolons
    fixedContent = fixedContent.replace(/}\s*(?![\n\r]*[;}])/g, '};\n');

    // Fix property assignments
    fixedContent = fixedContent.replace(
      /(\w+)\s*:\s*(?!{|"|'|\d|\[|\(|true|false|null|undefined|void|any|number|string|boolean)([^,;\n}]+)/g,
      '$1: { $2 }'
    );

    // Fix expression statements
    fixedContent = fixedContent.replace(/(\w+)\s+(\w+)\s*(?!:|=|{|\()/g, '$1: $2');

    // Fix missing commas in object literals
    fixedContent = fixedContent.replace(/}\s*(?![\n\r]*[,}])/g, '},\n');

    // Fix JSX closing tags
    fixedContent = fixedContent.replace(
      /<(\w+)[^>]*>(?:(?!<\/\1>).)*$/gm,
      (match, tag) => `${match}</${tag}>`
    );

    // Fix missing parentheses
    fixedContent = fixedContent.replace(/(\w+)\s*=>\s*(?!{|\()/g, '$1 => (');

    // Fix React component props interface
    fixedContent = fixedContent.replace(
      /interface\s+(\w+)Props\s*{([^}]*)}/g,
      (match, name, props) => {
        const cleanedProps = props
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line)
          .map((line) => {
            if (!line.includes(':')) {
              return `${line}: any;`;
            }
            if (!line.endsWith(';')) {
              return `${line};`;
            }
            return line;
          })
          .join('\n  ');
        return `interface ${name}Props {\n  ${cleanedProps}\n}`;
      }
    );

    // Add missing imports for React components
    if (filePath.endsWith('.tsx') && !fixedContent.includes('import React')) {
      fixedContent = `import React from 'react';\n${fixedContent}`;
    }

    await writeFile(filePath, fixedContent, 'utf-8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

async function findTypeScriptFiles(dir: string): Promise<string[]> {
  const { readdir, stat } = await import('fs/promises');
  const { join } = await import('path');

  const files: string[] = [];

  async function traverse(directory: string) {
    const entries = await readdir(directory);

    for (const entry of entries) {
      const fullPath = join(directory, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        await traverse(fullPath);
      } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }

  await traverse(dir);
  return files;
}

async function main() {
  const srcDir = join(process.cwd(), 'src');
  const files = await findTypeScriptFiles(srcDir);

  for (const file of files) {
    await fixTypeScriptFile(file);
  }
}

main().catch(console.error);
