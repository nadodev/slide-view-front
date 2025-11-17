# 🚀 Deploy Rápido - Guia por Plataforma

## 📦 Preparar Build

```bash
# Build simples (só frontend)
npm run build

# Build completo (frontend + servidor)
npm run build:full
```

## 🌐 Deploy por Plataforma

### 1. Vercel (Recomendado para teste)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Configuração automática**: `vercel.json` já configurado

### 2. Netlify (Apenas Frontend)
1. Build Command: `npm run build`
2. Publish Directory: `dist`
3. **Nota**: Netlify não suporta Socket.IO (sem controle remoto)

### 3. Railway (Full Stack)
```bash
# Conectar repositório no Railway.app
# Build Command: npm run build
# Start Command: npm start
```

**Variáveis de Ambiente**:
```
NODE_ENV=production
VITE_API_URL=https://sua-app.railway.app
VITE_SOCKET_URL=https://sua-app.railway.app
PORT=3001
```

### 4. Heroku (Full Stack)
```bash
# Instalar Heroku CLI
npm i -g heroku

# Login e criar app
heroku login
heroku create sua-app-apresentacao

# Deploy
git push heroku main
```

**Procfile** (criar na raiz):
```
web: npm start
```

### 5. VPS/Servidor Próprio
```bash
# No servidor
git clone seu-repositorio
cd apresentacao
npm install
npm run build:full
cd dist
npm install
npm start
```

## 🔧 Configuração de Ambiente

### Desenvolvimento (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

### Produção (.env.production)
```env
VITE_API_URL=https://seudominio.com
VITE_SOCKET_URL=https://seudominio.com
PORT=3001
NODE_ENV=production
```

## ⚡ Deploy Rápido - 1 Comando

### Vercel (Mais rápido)
```bash
npm run build && vercel --prod
```

### Railway
1. Conecte repositório em railway.app
2. Configure variáveis de ambiente
3. Deploy automático

### Heroku
```bash
git add . && git commit -m "Deploy" && git push heroku main
```

## 🎯 URLs de Acesso

Após deploy bem-sucedido:
- **App**: `https://sua-app.vercel.app`
- **Controle Remoto**: `https://sua-app.vercel.app/remote/{sessionId}`

## 🔍 Verificar Deploy

1. Acesse a URL da aplicação
2. Clique em "QR Code" na barra inferior
3. Teste se QR Code aparece
4. Acesse URL do controle remoto no celular

## 🛟 Troubleshooting

### Build falha
```bash
# Limpar cache
rm -rf node_modules
npm install
npm run build
```

### Socket.IO não funciona
- Verifique se plataforma suporta WebSockets
- Configure variáveis `VITE_SOCKET_URL` corretamente

### Vercel timeout
- Vercel tem limite de 10s para funções
- Para apps mais complexos, use Railway ou Heroku