const fs = require('fs').promises;
const path = require('path');

async function fixTypeScriptFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
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

    await fs.writeFile(filePath, fixedContent, 'utf-8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

async function findTypeScriptFiles(dir) {
  const files = [];

  async function traverse(directory) {
    const entries = await fs.readdir(directory);

    for (const entry of entries) {
      const fullPath = path.join(directory, entry);
      const stats = await fs.stat(fullPath);

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
  const srcDir = path.join(process.cwd(), 'src');
  console.log('Finding TypeScript files...');
  const files = await findTypeScriptFiles(srcDir);
  console.log(`Found ${files.length} TypeScript files`);

  for (const file of files) {
    await fixTypeScriptFile(file);
  }
  console.log('Finished fixing TypeScript files');
}

main().catch(console.error);
