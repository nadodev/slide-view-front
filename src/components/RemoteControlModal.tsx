import React from 'react';
import { Smartphone, Server, Loader2, AlertCircle, Terminal } from 'lucide-react';
import { Button } from '../shared/components/ui/button';

interface RemoteControlModalProps {
  qrUrl?: string;
  sessionId?: string;
  remoteClients?: number;
  isConnected?: boolean;
  isSupported: boolean;
  platform: string;
  serverStatus?: 'checking' | 'online' | 'offline';
  error?: string | null;
  onClose?: () => void;
  onRetry?: () => void;
}

export const RemoteControlModal: React.FC<RemoteControlModalProps> = ({
  isSupported,
  platform,
  serverStatus = 'checking',
  error,
  onClose,
  onRetry,
}) => {
  const isDevelopment = platform === 'development';

  // Plataforma não suportada (Vercel, Netlify)
  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-700/50">
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-400" size={28} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Não Disponível</h2>
            <p className="text-slate-400 text-sm">
              O controle remoto não está disponível em <span className="text-red-400 font-medium">{platform}</span>
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 mb-5">
            <p className="text-slate-300 text-sm mb-3">
              Plataformas serverless como Vercel e Netlify não suportam WebSockets.
            </p>
            <p className="text-slate-400 text-xs">
              Use uma das seguintes plataformas:
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              <li className="text-green-400">✓ Railway</li>
              <li className="text-green-400">✓ Render</li>
              <li className="text-green-400">✓ Heroku</li>
              <li className="text-green-400">✓ DigitalOcean</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 hover:border-slate-500 text-white"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Servidor offline
  if (serverStatus === 'offline' || error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-700/50">
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <Server className="text-orange-400" size={28} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              {isDevelopment ? 'Servidor não encontrado' : 'Servidor Offline'}
            </h2>
            <p className="text-slate-400 text-sm">
              {error || 'Não foi possível conectar ao servidor Socket.IO'}
            </p>
          </div>

          {isDevelopment && (
            <div className="bg-slate-800/50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Terminal size={16} className="text-cyan-400" />
                <p className="text-slate-300 text-sm font-medium">Para iniciar o servidor:</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <code className="text-green-400 text-sm font-mono">npm run dev:full</code>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Este comando inicia o Vite e o servidor Socket.IO simultaneamente.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Tentar Novamente
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 hover:border-slate-500 text-white"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Verificando servidor
  if (serverStatus === 'checking') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-700/50">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="text-blue-400 animate-spin" size={28} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Conectando...</h2>
            <p className="text-slate-400 text-sm">
              Verificando servidor Socket.IO
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se chegou aqui sem sessão, não renderiza nada (QRCodeDisplay será usado)
  return null;
};
