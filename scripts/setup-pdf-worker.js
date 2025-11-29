/**
 * Script para copiar o worker do PDF.js para a pasta public
 * Executado após npm install
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const workerSource = path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const workerDest = path.join(publicDir, 'pdf.worker.min.mjs');

try {
  // Criar pasta public se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('📁 Pasta public criada');
  }

  // Copiar worker se existir
  if (fs.existsSync(workerSource)) {
    fs.copyFileSync(workerSource, workerDest);
    console.log('✅ PDF.js worker copiado para public/pdf.worker.min.mjs');
  } else {
    console.warn('⚠️  Worker do PDF.js não encontrado em:', workerSource);
    console.warn('   Certifique-se de que pdfjs-dist está instalado');
  }
} catch (error) {
  console.error('❌ Erro ao copiar worker do PDF.js:', error.message);
  process.exit(1);
}

