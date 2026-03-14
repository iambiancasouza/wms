import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const targetDir = path.join(__dirname, 'src');

walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let updatedContent = content
      .replace(/toast\.success\(/g, 'showToast.success(')
      .replace(/toast\.error\(/g, 'showToast.error(')
      .replace(/toast\.info\(/g, 'showToast.default(')
      .replace(/toast\(/g, 'showToast.default(');

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Atualizado: ${filePath}`);
    }
  }
});

console.log('🚀 Migração de sintaxe concluída!');