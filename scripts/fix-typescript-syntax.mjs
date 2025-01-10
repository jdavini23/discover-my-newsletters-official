import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join } from 'path';

async function fixTypeScriptFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    let fixedContent = content;

    // Fix import statements
    fixedContent = fixedContent.replace(
      /import\s+(\w+)\s+from\s+(['"].*?['"])/g,
      'import * as $1 from $2;'
    );

    // Fix named imports
    fixedContent = fixedContent.replace(
      /import\s*{([^}]+)}\s*from\s*(['"].*?['"])\s*(?!;)/g,
      'import { $1 } from $2;'
    );

    // Fix export statements
    fixedContent = fixedContent.replace(
      /export\s+(?:interface|type|class|const|function|default)\s+(\w+)(?!\s*[{;=])/g,
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

    // Fix JSX syntax
    fixedContent = fixedContent.replace(
      /<(\w+)([^>]*?)\s*>(?!\s*<\/\1>)/g,
      (match, tag, attrs) => `<${tag}${attrs}></${tag}>`
    );

    // Fix missing type annotations
    fixedContent = fixedContent.replace(/const\s+(\w+)\s*=\s*(?!:)/g, 'const $1: any = ');

    // Fix function return types
    fixedContent = fixedContent.replace(
      /function\s+(\w+)\s*\(([^)]*)\)(?!\s*:)/g,
      'function $1($2): any'
    );

    // Fix async function return types
    fixedContent = fixedContent.replace(
      /async\s+function\s+(\w+)\s*\(([^)]*)\)(?!\s*:)/g,
      'async function $1($2): Promise<any>'
    );

    // Fix arrow function return types
    fixedContent = fixedContent.replace(
      /const\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g,
      'const $1 = async ($2): Promise<any> =>'
    );

    // Add missing React imports
    if (filePath.endsWith('.tsx') && !fixedContent.includes('import React')) {
      fixedContent = `import React from 'react';\n${fixedContent}`;
    }

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

    // Fix missing brackets in JSX
    fixedContent = fixedContent.replace(/=\s*{([^{}]+?)(?!\s*})/g, '={ $1 }');

    await writeFile(filePath, fixedContent, 'utf-8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

async function findTypeScriptFiles(dir) {
  const files = [];

  async function traverse(directory) {
    const entries = await readdir(directory);

    for (const entry of entries) {
      const fullPath = join(directory, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        if (!entry.includes('node_modules')) {
          await traverse(fullPath);
        }
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
  console.log('Finding TypeScript files...');
  const files = await findTypeScriptFiles(srcDir);
  console.log(`Found ${files.length} TypeScript files`);

  for (const file of files) {
    await fixTypeScriptFile(file);
  }
  console.log('Finished fixing TypeScript files');
}

main().catch(console.error);
