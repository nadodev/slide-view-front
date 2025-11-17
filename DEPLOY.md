# 🎯 Deploy em Produção - Apresentação com Controle Remoto

Este guia mostra como fazer deploy da sua aplicação de apresentação com controle remoto em produção.

## 📦 Build de Produção

### 1. Preparar para Deploy
```bash
npm run build:production
```

Este comando:
- ✅ Faz build otimizado da aplicação React
- ✅ Copia o servidor Node.js para a pasta dist
- ✅ Cria package.json otimizado só com dependências essenciais
- ✅ Copia configurações de ambiente
- ✅ Cria scripts de deploy automático

### 2. Estrutura Gerada
```
dist/
├── index.html              # App React buildado
├── assets/                 # CSS, JS, images otimizados
├── server.js              # Servidor Socket.IO + Express
├── package.json           # Dependências de produção
├── .env                   # Variáveis de ambiente
├── deploy.sh              # Script deploy Linux/Mac
└── deploy.bat             # Script deploy Windows
```

## 🚀 Opções de Deploy

### Opção 1: Deploy Local/VPS
```bash
# Vá para a pasta dist
cd dist

# Instale dependências
npm install

# Inicie o servidor
npm start
```

### Opção 2: Deploy Automático (Windows)
```bash
cd dist
./deploy.bat
```

### Opção 3: Deploy Automático (Linux/Mac)
```bash
cd dist
chmod +x deploy.sh
./deploy.sh
```

## 🌐 Variáveis de Ambiente

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

## 🔧 Configurações por Plataforma

### Heroku
1. **Buildpacks**: Node.js
2. **Variáveis**:
   ```
   NODE_ENV=production
   VITE_API_URL=https://sua-app.herokuapp.com
   VITE_SOCKET_URL=https://sua-app.herokuapp.com
   ```
3. **Procfile**:
   ```
   web: npm start
   ```

### Vercel (Funciona mas com limitações Socket.IO)
1. **vercel.json**:
   ```json
   {
     "builds": [{"src": "server.js", "use": "@vercel/node"}],
     "routes": [{"src": "/(.*)", "dest": "/server.js"}]
   }
   ```

### Railway/Render
1. **Build Command**: `npm run build:production`
2. **Start Command**: `cd dist && npm install && npm start`
3. **Variáveis**: Configure no painel da plataforma

### VPS/Servidor Próprio
1. **Nginx Config** (opcional):
   ```nginx
   server {
       listen 80;
       server_name seudominio.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **PM2** (opcional para produção):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "apresentacao"
   pm2 save
   pm2 startup
   ```

## 🔗 URLs de Acesso

### Desenvolvimento
- **App Principal**: http://localhost:5173
- **Servidor**: http://localhost:3001
- **Controle Remoto**: http://localhost:3001/remote/{sessionId}

### Produção
- **App Principal**: https://seudominio.com
- **Controle Remoto**: https://seudominio.com/remote/{sessionId}

## 🎮 Como Funciona o Controle Remoto

1. **Na apresentação**: Clique no botão "QR Code" na barra inferior
2. **Gerar QR**: Sistema cria sessão única e mostra QR Code
3. **No celular**: Escaneie o QR Code ou acesse URL diretamente
4. **Controlar**: Use botões para navegar pelos slides

## 🛟 Troubleshooting

### Erro de CORS
- Configure CORS no servidor para seu domínio
- Verifique variáveis de ambiente

### Socket.IO não conecta
- Confirme que VITE_SOCKET_URL está correto
- Verifique firewall/proxy

### Build falha
- Execute `npm install` antes do build
- Verifique se todas dependências estão instaladas

## 📊 Monitoramento

O servidor mostra logs detalhados:
```
🚀 Servidor rodando na porta 3001
📱 URL base para controles remotos: https://seudominio.com/remote/
🔌 Cliente conectado: abc123
📺 Nova apresentação criada: def456
📱 Controle remoto conectado à sessão: def456
```

## 🔐 Segurança

- Sessions têm IDs únicos e temporários
- Sem persistência de dados sensíveis
- WebSocket com validação de sessão
- Timeouts automáticos para sessions inativas