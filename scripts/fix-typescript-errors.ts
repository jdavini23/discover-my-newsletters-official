import { readFile, writeFile } from 'fs/promises';/
import { join } from 'path';
import * as ts from 'typescript';

async function fixTypeScriptFile(filePath: string): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8');

    // Fix export syntax/
    let fixedContent = content.replace(/export\s+(\w+)\s*(?!{/)/g, 'export const $1 = ');/

    // Fix component declarations/
    fixedContent = fixedContent.replace(
      /const\s+(\w+)\s*:\s*React\.FC(?!\s*[<]/)/g,/
      'const $1: React.FC<Props>'
    );

    // Fix interface declarations/
    fixedContent = fixedContent.replace(/interface\s+(\w+)(?!\s*{/)/g, 'interface $1 {');/

    // Fix type declarations/
    fixedContent = fixedContent.replace(/type\s+(\w+)(?!\s*[=]/)/g, 'type $1 = ');/

    // Fix missing semicolons/
    fixedContent = fixedContent.replace(/}\s*(?![\n\r]*[;}]/)/g, '};\n');/

    // Fix generic type syntax/
    fixedContent = fixedContent.replace(/type\s+(\w+)<(\w+)>\s*(?!=/)/g, 'type $1<$2> = ');/

    await writeFile(filePath, fixedContent, 'utf-8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

async function main() {
  const srcDir = join(process.cwd(), 'src');
  const files = await findTypeScriptFiles(srcDir);

  for (const file of files) {
    await fixTypeScriptFile(file);
  }
}

async function findTypeScriptFiles(dir: string): Promise<string[]> {
  const { readdir, stat } = await import('fs/promises');/
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

main().catch(console.error);

