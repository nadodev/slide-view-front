import { useEffect, useRef, useState } from 'react';
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
}

export const useSocket = (): UseSocketReturn => {
  const [session, setSession] = useState<PresentationSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const commandCallbackRef = useRef<((command: RemoteCommand) => void) | null>(null);

  const [platform, setPlatform] = useState<string>('unknown');
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    const hostname = window.location.hostname;

    if (hostname.includes('vercel.app')) {
      setPlatform('vercel');
      setIsSupported(false);
    } else if (hostname.includes('netlify.app')) {
      setPlatform('netlify');
      setIsSupported(false);
    } else if (hostname.includes('railway.app')) {
      setPlatform('railway');
      setIsSupported(true);
    } else if (hostname.includes('render.com')) {
      setPlatform('render');
      setIsSupported(true);
    } else if (hostname.includes('herokuapp.com')) {
      setPlatform('heroku');
      setIsSupported(true);
    } else if (hostname.includes('localhost')) {
      setPlatform('development');
      setIsSupported(true);
    } else {
      setPlatform('custom');
      setIsSupported(true);
    }
  }, []);

  const connect = () => {
    if (socketRef.current?.connected) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      socketRef.current = io(apiUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });

      socketRef.current.on('connect', () => {
        setError(null);
      });

      socketRef.current.on('disconnect', () => {
        setSession(prev => prev ? { ...prev, isConnected: false } : null);
      });

      socketRef.current.on('connect_error', (err) => {
        if (platform === 'development') {
          setError('Servidor não está rodando. Execute: npm run dev:full');
        } else {
          setError('Erro ao conectar com o servidor');
        }
        setIsConnecting(false);
      });

      socketRef.current.on('remote-connected', ({ totalRemotes }) => {
        setSession(prev => prev ? { ...prev, remoteClients: totalRemotes } : null);
      });

      socketRef.current.on('remote-disconnected', ({ totalRemotes }) => {
        setSession(prev => prev ? { ...prev, remoteClients: totalRemotes } : null);
      });

      socketRef.current.on('remote-command', (command: RemoteCommand) => {
        if (commandCallbackRef.current) {
          commandCallbackRef.current(command);
        }
      });

    } catch (err) {
      setError('Erro ao inicializar conexão');
      setIsConnecting(false);
    }
  };

  const createPresentation = () => {

    if (!isSupported) {
      setError(`Controle remoto não disponível em ${platform}. Use Railway, Render ou Heroku.`);
      return;
    }

    if (platform === 'development') {
      const checkServer = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/health');
          if (!response.ok) {
            throw new Error('Servidor não respondeu');
          }
        } catch (error) {
          setError('Servidor Socket.IO não está rodando. Execute: npm run dev:full');
          setIsConnecting(false);
          return;
        }
      };
      checkServer();
    }

    if (!socketRef.current) {
      connect();
    }

    setIsConnecting(true);
    setError(null);

    if (socketRef.current) {
      socketRef.current.emit('create-presentation', (response: any) => {
        setIsConnecting(false);

        if (response.success) {
          let qrUrl = response.qrUrl;

          if (!qrUrl || (!qrUrl.startsWith('http://') && !qrUrl.startsWith('https://'))) {
            const baseUrl = window.location.origin;
            qrUrl = `${baseUrl}/remote/${response.sessionId}`;
          }

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
    } else {
      setError('Conexão não disponível');
      setIsConnecting(false);
    }
  };

  const updateSlide = (currentSlide: number, totalSlides: number) => {
    if (socketRef.current && session) {
      socketRef.current.emit('update-presentation', {
        sessionId: session.sessionId,
        currentSlide,
        totalSlides,
      });
    } else {
      console.warn('useSocket - updateSlide ignorado:', { hasSocket: !!socketRef.current, hasSession: !!session });
    }
  };

  const shareContent = (content: string) => {
    if (socketRef.current && session) {
      socketRef.current.emit('share-presentation-content', session.sessionId, content);
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSession(null);
    setError(null);
    setIsConnecting(false);
  };

  const onRemoteCommand = (callback: (command: RemoteCommand) => void) => {
    commandCallbackRef.current = callback;
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

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
  };
};