import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface PresentationSession {
  sessionId: string;
  qrUrl: string;
  isConnected: boolean;
  remoteClients: number;
}

interface RemoteCommand {
  command: 'next' | 'previous' | 'goto' | 'scroll' | 'scroll-sync' | 'presenter' | 'focus';
  slideIndex?: number;
  scrollDirection?: 'up' | 'down';
  scrollPosition?: number;
  fromClient: string;
}

interface UseSocketReturn {
  session: PresentationSession | null;
  isConnecting: boolean;
  error: string | null;
  createPresentation: () => void;
  updateSlide: (currentSlide: number, totalSlides: number) => void;
  shareContent: (content: string) => void;
  disconnect: () => void;
  onRemoteCommand: (callback: (command: RemoteCommand) => void) => void;
  isSupported: boolean;
  platform: string;
  serverStatus: 'checking' | 'online' | 'offline';
}

export const useSocket = (): UseSocketReturn => {
  const [session, setSession] = useState<PresentationSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const socketRef = useRef<Socket | null>(null);
  const commandCallbackRef = useRef<((command: RemoteCommand) => void) | null>(null);

  const [platform, setPlatform] = useState<string>('unknown');
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Obter URL da API
  const getApiUrl = useCallback(() => {
    const hostname = window.location.hostname;
    
    if (hostname.includes('railway.app')) {
      return window.location.origin;
    } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return import.meta.env.VITE_API_URL || 'http://localhost:3001';
    } else {
      return import.meta.env.VITE_API_URL || window.location.origin;
    }
  }, []);

  // Verificar status do servidor
  const checkServerStatus = useCallback(async () => {
    const apiUrl = getApiUrl();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${apiUrl}/api/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerStatus('online');
        return true;
      }
      setServerStatus('offline');
      return false;
    } catch {
      setServerStatus('offline');
      return false;
    }
  }, [getApiUrl]);

  useEffect(() => {
    const hostname = window.location.hostname;

    if (hostname.includes('vercel.app')) {
      setPlatform('vercel');
      setIsSupported(false);
      setServerStatus('offline');
    } else if (hostname.includes('netlify.app')) {
      setPlatform('netlify');
      setIsSupported(false);
      setServerStatus('offline');
    } else if (hostname.includes('railway.app')) {
      setPlatform('railway');
      setIsSupported(true);
      checkServerStatus();
    } else if (hostname.includes('render.com')) {
      setPlatform('render');
      setIsSupported(true);
      checkServerStatus();
    } else if (hostname.includes('herokuapp.com')) {
      setPlatform('heroku');
      setIsSupported(true);
      checkServerStatus();
    } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      setPlatform('development');
      setIsSupported(true);
      checkServerStatus();
    } else {
      setPlatform('custom');
      setIsSupported(true);
      checkServerStatus();
    }
  }, [checkServerStatus]);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const apiUrl = getApiUrl();
    console.log('🔌 Conectando ao servidor Socket.IO:', apiUrl);

    try {
      socketRef.current = io(apiUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Conectado ao servidor Socket.IO');
        setError(null);
        setServerStatus('online');
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Desconectado do servidor Socket.IO');
        setSession(prev => prev ? { ...prev, isConnected: false } : null);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Erro de conexão Socket.IO:', err.message);
        setServerStatus('offline');
        if (platform === 'development') {
          setError('Servidor não encontrado. Execute: npm run dev:full');
        } else {
          setError('Erro ao conectar com o servidor');
        }
        setIsConnecting(false);
      });

      socketRef.current.on('remote-connected', ({ totalRemotes }) => {
        console.log('📱 Remote conectado, total:', totalRemotes);
        setSession(prev => prev ? { ...prev, remoteClients: totalRemotes } : null);
      });

      socketRef.current.on('remote-disconnected', ({ totalRemotes }) => {
        console.log('📱 Remote desconectado, total:', totalRemotes);
        setSession(prev => prev ? { ...prev, remoteClients: totalRemotes } : null);
      });

      socketRef.current.on('remote-command', (command: RemoteCommand) => {
        console.log('🎮 Comando remoto recebido:', command);
        if (commandCallbackRef.current) {
          commandCallbackRef.current(command);
        }
      });

    } catch (err) {
      console.error('❌ Erro ao inicializar conexão:', err);
      setError('Erro ao inicializar conexão');
      setIsConnecting(false);
    }
  }, [getApiUrl, platform]);

  const createPresentation = useCallback(async () => {
    console.log('📺 Criando apresentação...', { platform, isSupported, serverStatus });

    if (!isSupported) {
      setError(`Controle remoto não disponível em ${platform}. Use Railway, Render ou Heroku.`);
      return;
    }

    // Verificar servidor primeiro
    const isServerOnline = await checkServerStatus();
    
    if (!isServerOnline) {
      if (platform === 'development') {
        setError('Servidor Socket.IO não está rodando.\n\nExecute: npm run dev:full');
      } else {
        setError('Servidor não está disponível');
      }
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      connect();
      // Aguardar conexão
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!socketRef.current?.connected) {
      setError('Não foi possível conectar ao servidor');
      return;
    }

    setIsConnecting(true);
    setError(null);

    socketRef.current.emit('create-presentation', (response: any) => {
      console.log('📺 Resposta create-presentation:', response);
      setIsConnecting(false);

      if (response.success) {
        let qrUrl = response.qrUrl;

        // Garantir que a URL é válida
        if (!qrUrl || (!qrUrl.startsWith('http://') && !qrUrl.startsWith('https://'))) {
          const baseUrl = window.location.origin;
          qrUrl = `${baseUrl}/remote/${response.sessionId}`;
        }

        console.log('✅ Sessão criada:', response.sessionId, 'URL:', qrUrl);

        setSession({
          sessionId: response.sessionId,
          qrUrl: qrUrl,
          isConnected: true,
          remoteClients: 0,
        });
      } else {
        setError('Erro ao criar apresentação');
      }
    });
  }, [isSupported, platform, serverStatus, checkServerStatus, connect]);

  const updateSlide = useCallback((currentSlide: number, totalSlides: number) => {
    if (socketRef.current && session) {
      socketRef.current.emit('update-presentation', {
        sessionId: session.sessionId,
        currentSlide,
        totalSlides,
      });
    }
  }, [session]);

  const shareContent = useCallback((content: string) => {
    if (socketRef.current && session) {
      socketRef.current.emit('share-presentation-content', session.sessionId, content);
    }
  }, [session]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSession(null);
    setError(null);
    setIsConnecting(false);
  }, []);

  const onRemoteCommand = useCallback((callback: (command: RemoteCommand) => void) => {
    commandCallbackRef.current = callback;
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    session,
    isConnecting,
    error,
    createPresentation,
    updateSlide,
    shareContent,
    disconnect,
    onRemoteCommand,
    isSupported,
    platform,
    serverStatus,
  };
};
