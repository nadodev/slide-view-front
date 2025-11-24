# 🎨 SlideView - Apresentações Interativas

**SlideView** é uma ferramenta moderna para criar e exibir apresentações baseadas em Markdown, com suporte a controle remoto em tempo real via WebSocket. Desenvolvido para oferecer uma experiência fluida e interativa, permitindo que o apresentador controle os slides diretamente de seu dispositivo móvel.

## ✨ Principais Funcionalidades

- **📝 Slides em Markdown**: Escreva suas apresentações em arquivos Markdown simples e organizados.
- **📱 Controle Remoto em Tempo Real**: Controle a apresentação pelo celular escaneando um QR Code.
- **🔄 Sincronização Instantânea**: Mudanças de slide e scroll são sincronizados entre todos os dispositivos conectados.
- **🎨 Design System Integrado**: Baseado no "Aurea Design System" para consistência visual.
- **💻 Modo Apresentador**: Visualize notas e próximos slides (futuro).
- **🔐 Integração GitHub**: Autenticação para acesso a recursos restritos (se configurado).
- **🛠️ Tecnologias Modernas**: React, Vite, TailwindCSS, Node.js e Socket.IO.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Socket.IO](https://socket.io/)
- **Estilização**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) (ícones)
- **Markdown**: [Marked](https://marked.js.org/), [Highlight.js](https://highlightjs.org/) (syntax highlighting)

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/slide-view.git
   cd slide-view
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base):
   ```env
   PORT=3001
   VITE_API_URL=http://localhost:3001
   # Opcional: Configurações do GitHub OAuth
   GITHUB_CLIENT_ID=seu_client_id
   GITHUB_CLIENT_SECRET=seu_client_secret
   ```

---

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento (Frontend + Backend)

Para rodar o ambiente completo de desenvolvimento (React + Servidor Socket.IO):

```bash
npm run dev:full
```
Isso iniciará o Vite e o servidor Node.js simultaneamente.

### Apenas Frontend

```bash
npm run dev
```

### Apenas Backend

```bash
npm run server
```

### Produção

Para gerar o build e iniciar o servidor de produção:

```bash
npm run build
npm start
```

---

## 📖 Estrutura e Páginas

O projeto é composto pelas seguintes rotas e interfaces:

### 1. **Landing Page** (`/landing`)
A página de entrada do projeto. Apresenta uma visão geral da ferramenta, seus benefícios e um botão para iniciar a apresentação. É o cartão de visitas do SlideView.

### 2. **Apresentação** (`/` ou `/app`)
A interface principal onde os slides são renderizados.
- Carrega arquivos Markdown da pasta `slides/`.
- Exibe o conteúdo com formatação rica.
- Mostra um **QR Code** flutuante para conexão rápida do controle remoto.
- Sincroniza o estado (slide atual, scroll) com o servidor.

#### **Tela Inicial (Upload & AI)**
Quando nenhuma apresentação está carregada, você verá a **SlideCraft AI**:
- **📁 Upload**: Arraste e solte arquivos Markdown (`.md`). Suporta múltiplos arquivos ou divisão de arquivo único.
- **✨ IA Generativa**: Crie apresentações completas apenas descrevendo o tema. Powered by Google Gemini.
- **➕ Criar Slide**: Editor visual para criar slides do zero.


### 3. **Controle Remoto** (`/remote/:sessionId`)
Interface otimizada para dispositivos móveis.
- Acessada ao escanear o QR Code da apresentação.
- Botões grandes para **Anterior** e **Próximo**.
- Controle de **Scroll** para navegar em slides longos.
- Modo **Touchpad** (em desenvolvimento) para controle gestual.

### 4. **Callback de Autenticação** (`/auth/github/callback`)
Rota técnica responsável por processar o retorno da autenticação via GitHub OAuth, trocando o código temporário por um token de acesso.

---

## 📂 Estrutura de Arquivos

- `src/`: Código fonte do Frontend (React).
  - `components/`: Componentes reutilizáveis (SlideViewer, RemoteControl, etc.).
  - `hooks/`: Hooks customizados (useSocket, etc.).
- `server.js`: Servidor Backend (Express + Socket.IO).
- `slides/`: Diretório onde ficam os arquivos `.md` da apresentação.
- `public/`: Arquivos estáticos.

---

## 🛠️ Como Adicionar Slides

1. Navegue até a pasta `slides/`.
2. Crie ou edite arquivos Markdown (ex: `01-intro.md`).
3. O sistema carrega e ordena os slides automaticamente (baseado na lógica implementada em `src/utils/slideUtils.ts` ou similar).

---

## ☁️ Deploy

O projeto está configurado para deploy fácil em plataformas como **Railway** e **Vercel**.

- **Railway**: Detecta automaticamente o `server.js` e o script de build.
- **Vercel**: Configurado via `vercel.json` para servir o frontend e funções serverless (se aplicável).

---

Feito com 💜 usando React e Node.js.
