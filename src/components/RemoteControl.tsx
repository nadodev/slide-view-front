import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { 
  ChevronLeft, 
  ChevronRight, 
  SkipBack, 
  SkipForward,
  Play,
  Pause,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const RemoteControl: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('ID da sessão não encontrado');
      setIsConnecting(false);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // Conectar ao servidor
    const socketConnection = io(apiUrl, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    socketConnection.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      
      // Juntar-se à sessão
      socketConnection.emit('join-remote', sessionId, (response: any) => {
        if (response.success) {
          setCurrentSlide(response.currentSlide);
          setTotalSlides(response.totalSlides);
          toast.success('Conectado!', {
            description: 'Controle remoto ativo'
          });
        } else {
          setError(response.error || 'Erro ao conectar');
          toast.error('Erro', {
            description: response.error || 'Falha na conexão'
          });
        }
      });
    });

    socketConnection.on('disconnect', () => {
      setIsConnected(false);
      toast.warning('Desconectado', {
        description: 'Reconectando...'
      });
    });

    socketConnection.on('connect_error', () => {
      setIsConnected(false);
      setIsConnecting(false);
      setError('Não foi possível conectar ao servidor');
      toast.error('Erro de conexão', {
        description: 'Verifique sua internet'
      });
    });

    socketConnection.on('sync-slide', ({ currentSlide: newSlide, totalSlides: newTotal }) => {
      setCurrentSlide(newSlide);
      setTotalSlides(newTotal);
    });

    socketConnection.on('presentation-ended', () => {
      toast.info('Apresentação encerrada', {
        description: 'A apresentação foi finalizada'
      });
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [sessionId]);

  const sendCommand = (command: 'next' | 'previous' | 'goto', slideIndex?: number) => {
    if (!socket || !isConnected) {
      toast.error('Não conectado', {
        description: 'Verifique a conexão'
      });
      return;
    }

    socket.emit('remote-command', {
      sessionId,
      command,
      slideIndex,
    });

    // Feedback visual
    const commandMessages = {
      next: 'Próximo slide',
      previous: 'Slide anterior',
      goto: `Indo para slide ${(slideIndex || 0) + 1}`
    };

    toast.success(commandMessages[command]);
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Conectando...</h2>
          <p className="text-slate-400">Estabelecendo conexão com a apresentação</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="text-red-400" size={32} />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Erro de Conexão</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Smartphone className="text-violet-400" size={24} />
            <h1 className="text-white text-2xl font-bold">Controle Remoto</h1>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`} />
            {isConnected ? (
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <Wifi size={14} />
                <span>Conectado</span>
              </div>
            ) : (
              <span className="text-red-400 text-sm">Desconectado</span>
            )}
          </div>

          {/* Slide Counter */}
          {totalSlides > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-3 mb-6">
              <p className="text-slate-400 text-sm mb-1">Slide atual</p>
              <p className="text-white text-2xl font-bold">
                {currentSlide + 1} <span className="text-slate-500">de {totalSlides}</span>
              </p>
              {/* Progress Bar */}
              <div className="mt-2 bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Navigation */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => sendCommand('previous')}
              disabled={!isConnected || currentSlide <= 0}
              size="lg"
              className="h-16 bg-slate-800 hover:bg-slate-700 border border-slate-600 flex flex-col items-center gap-1"
            >
              <ChevronLeft size={24} />
              <span className="text-xs">Anterior</span>
            </Button>

            <Button
              onClick={() => sendCommand('next')}
              disabled={!isConnected || currentSlide >= totalSlides - 1}
              size="lg"
              className="h-16 bg-slate-800 hover:bg-slate-700 border border-slate-600 flex flex-col items-center gap-1"
            >
              <ChevronRight size={24} />
              <span className="text-xs">Próximo</span>
            </Button>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => sendCommand('goto', 0)}
              disabled={!isConnected || currentSlide === 0}
              variant="outline"
              size="lg"
              className="h-12 border-slate-600 hover:border-violet-400 flex items-center gap-2"
            >
              <SkipBack size={20} />
              <span className="text-sm">Primeiro</span>
            </Button>

            <Button
              onClick={() => sendCommand('goto', totalSlides - 1)}
              disabled={!isConnected || currentSlide >= totalSlides - 1}
              variant="outline"
              size="lg"
              className="h-12 border-slate-600 hover:border-violet-400 flex items-center gap-2"
            >
              <SkipForward size={20} />
              <span className="text-sm">Último</span>
            </Button>
          </div>

          {/* Slide Grid - Quick Jump */}
          {totalSlides > 0 && totalSlides <= 20 && (
            <div className="mt-8">
              <h3 className="text-slate-300 text-sm font-medium mb-3">Ir para slide:</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalSlides }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => sendCommand('goto', i)}
                    disabled={!isConnected}
                    size="sm"
                    variant={currentSlide === i ? "default" : "outline"}
                    className={`h-10 text-xs ${
                      currentSlide === i
                        ? 'bg-violet-600 hover:bg-violet-700 border-violet-500'
                        : 'border-slate-600 hover:border-violet-400'
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-xs">
            Sessão: {sessionId}
          </p>
        </div>
      </div>
    </div>
  );
};