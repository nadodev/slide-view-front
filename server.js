import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import os from 'os';

// Carregar variáveis de ambiente
dotenv.config();
import dotenv from 'dotenv';
import os from 'os';

// Carregar variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Configuração do Socket.IO com CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'dist')));

// Store das sessões de apresentação
const presentations = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  // Criar nova sessão de apresentação
  socket.on('create-presentation', (callback) => {
    const sessionId = uuidv4().slice(0, 8); // ID curto para facilitar
    const presentation = {
      id: sessionId,
      hostSocket: socket.id,
      currentSlide: 0,
      totalSlides: 0,
      remoteClients: [],
      createdAt: new Date()
    };
    
    presentations.set(sessionId, presentation);
    socket.join(`presentation-${sessionId}`);
    
    console.log(`📺 Nova apresentação criada: ${sessionId}`);
    
    // Determinar URL base dinamicamente
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.VITE_BASE_URL || process.env.BASE_URL || 'https://localhost:3001')
      : (process.env.VITE_BASE_URL || 'http://localhost:5173');
    
    callback({
      success: true,
      sessionId,
      qrUrl: `${baseUrl}/remote/${sessionId}`
    });
  });

  // Conectar como controle remoto
  socket.on('join-remote', (sessionId, callback) => {
    const presentation = presentations.get(sessionId);
    
    if (!presentation) {
      callback({ success: false, error: 'Apresentação não encontrada' });
      return;
    }

    presentation.remoteClients.push(socket.id);
    socket.join(`presentation-${sessionId}`);
    
    // Notificar o host sobre nova conexão
    socket.to(presentation.hostSocket).emit('remote-connected', {
      clientId: socket.id,
      totalRemotes: presentation.remoteClients.length
    });

    // Enviar estado atual para o remote
    callback({
      success: true,
      currentSlide: presentation.currentSlide,
      totalSlides: presentation.totalSlides
    });

    console.log(`📱 Controle remoto conectado à sessão: ${sessionId}`);
  });

  // Comandos de navegação do controle remoto
  socket.on('remote-command', ({ sessionId, command, slideIndex }) => {
    const presentation = presentations.get(sessionId);
    
    if (!presentation || !presentation.remoteClients.includes(socket.id)) {
      return;
    }

    // Atualizar slide atual se necessário
    if (command === 'goto' && slideIndex !== undefined) {
      presentation.currentSlide = slideIndex;
    } else if (command === 'next') {
      presentation.currentSlide = Math.min(presentation.currentSlide + 1, presentation.totalSlides - 1);
    } else if (command === 'previous') {
      presentation.currentSlide = Math.max(presentation.currentSlide - 1, 0);
    }

    // Enviar comando para o host
    socket.to(presentation.hostSocket).emit('remote-command', {
      command,
      slideIndex: presentation.currentSlide,
      fromClient: socket.id
    });

    // Sincronizar com outros remotes
    socket.to(`presentation-${sessionId}`).emit('sync-slide', {
      currentSlide: presentation.currentSlide,
      totalSlides: presentation.totalSlides
    });

    console.log(`🎮 Comando remoto: ${command} | Slide: ${presentation.currentSlide}`);
  });

  // Atualizar informações da apresentação (enviado pelo host)
  socket.on('update-presentation', ({ sessionId, currentSlide, totalSlides }) => {
    const presentation = presentations.get(sessionId);
    
    if (!presentation || presentation.hostSocket !== socket.id) {
      return;
    }

    presentation.currentSlide = currentSlide;
    presentation.totalSlides = totalSlides;

    // Sincronizar com todos os controles remotos
    socket.to(`presentation-${sessionId}`).emit('sync-slide', {
      currentSlide,
      totalSlides
    });
  });

  // Lidar com desconexões
  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);

    // Encontrar e limpar apresentações órfãs
    for (const [sessionId, presentation] of presentations.entries()) {
      if (presentation.hostSocket === socket.id) {
        // Host desconectou - encerrar apresentação
        io.to(`presentation-${sessionId}`).emit('presentation-ended');
        presentations.delete(sessionId);
        console.log(`📺 Apresentação ${sessionId} encerrada (host desconectou)`);
      } else {
        // Remover cliente remoto da lista
        const index = presentation.remoteClients.indexOf(socket.id);
        if (index > -1) {
          presentation.remoteClients.splice(index, 1);
          
          // Notificar host sobre desconexão
          socket.to(presentation.hostSocket).emit('remote-disconnected', {
            clientId: socket.id,
            totalRemotes: presentation.remoteClients.length
          });
        }
      }
    }
  });
});

// Rota para controle remoto
app.get('/remote/:sessionId', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Fallback para SPA - usar middleware em vez de rota
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Função para obter IP local
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

server.listen(PORT, HOST, () => {
  const localIP = getLocalIP();
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 URLs disponíveis:`);
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://${localIP}:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`   Produção: ${process.env.BASE_URL || 'Configure BASE_URL'}`);
  }
  console.log(`📲 Controles remotos: /remote/{sessionId}`);
});