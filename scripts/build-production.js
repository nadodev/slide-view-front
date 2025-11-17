import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando build de produção...');

try {
  // 1. Fazer build do Vite
  console.log('📦 Construindo aplicação...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Copiar arquivos do servidor
  console.log('📂 Copiando arquivos do servidor...');
  
  const distDir = './dist';
  
  // Copiar server.js
  fs.copyFileSync('./server.js', path.join(distDir, 'server.js'));
  
  // Criar package.json simplificado para produção
  const originalPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  const productionPackage = {
    name: originalPackage.name,
    version: originalPackage.version,
    type: "module",
    scripts: {
      start: "node server.js"
    },
    dependencies: {
      "express": originalPackage.dependencies.express,
      "socket.io": originalPackage.dependencies["socket.io"],
      "uuid": originalPackage.dependencies.uuid
    }
  };
  
  fs.writeFileSync(
    path.join(distDir, 'package.json'), 
    JSON.stringify(productionPackage, null, 2)
  );

  // 3. Copiar arquivos de ambiente
  if (fs.existsSync('./.env.production')) {
    fs.copyFileSync('./.env.production', path.join(distDir, '.env'));
  }

  // 4. Criar script de deploy
  const deployScript = `#!/bin/bash
# Deploy script - Execute este arquivo para rodar em produção

echo "🚀 Iniciando aplicação em produção..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Iniciar servidor
echo "🌐 Iniciando servidor..."
npm start
`;

  fs.writeFileSync(path.join(distDir, 'deploy.sh'), deployScript);

  // 5. Criar script de deploy para Windows
  const deployBat = `@echo off
echo 🚀 Iniciando aplicação em produção...

echo 📦 Instalando dependências...
npm install

echo 🌐 Iniciando servidor...
npm start
`;

  fs.writeFileSync(path.join(distDir, 'deploy.bat'), deployBat);

  console.log('✅ Build de produção concluído!');
  console.log('📁 Arquivos prontos em ./dist/');
  console.log('');
  console.log('🚀 Para rodar em produção:');
  console.log('   1. Vá para a pasta dist/');
  console.log('   2. Execute: npm install');
  console.log('   3. Execute: npm start');
  console.log('   Ou execute: ./deploy.bat (Windows) ou ./deploy.sh (Linux/Mac)');
  
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}