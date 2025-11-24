import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Smartphone, Users, Wifi, QrCode } from 'lucide-react';
import { Button } from '../shared/components/ui/button';

interface QRCodeDisplayProps {
  qrUrl: string;
  sessionId: string;
  remoteClients: number;
  isConnected: boolean;
  onClose?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrUrl,
  sessionId,
  remoteClients,
  isConnected,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string>(() => {
    if (sessionId) {
      return `${window.location.origin}/remote/${sessionId}`;
    }
    return qrUrl || '';
  });

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(true);
      return;
    }

    const generateQR = async () => {
      if (!canvasRef.current) {
        setTimeout(() => {
          if (canvasRef.current && sessionId) {
            generateQR();
          }
        }, 200);
        return;
      }

      const baseUrl = window.location.origin;
      const urlToUse = `${baseUrl}/remote/${sessionId}`;

      setFinalUrl(urlToUse);

      if (qrUrl && qrUrl !== urlToUse && qrUrl.startsWith('http')) {
        setUrlError('URL ajustada para o domínio atual');
      } else {
        setUrlError(null);
      }

      try {
        setIsLoading(true);

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        await QRCode.toCanvas(canvasRef.current, urlToUse, {
          width: 200,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setUrlError(`Erro ao gerar QR Code: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };

    const timer = setTimeout(() => {
      generateQR();
    }, 300);

    return () => clearTimeout(timer);
  }, [qrUrl, sessionId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const testUrl = () => {
    window.open(finalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-700/50">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <QrCode className="text-violet-400" size={24} />
            <h2 className="text-xl font-bold text-white">Controle Remoto</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Escaneie o código ou acesse a URL para controlar a apresentação
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`} />
          <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
          {isConnected && (
            <>
              <Wifi size={14} className="text-green-400 ml-2" />
              <span className="text-slate-400 text-xs">ID: {sessionId}</span>
            </>
          )}
        </div>

        {urlError && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-xs text-center">{urlError}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 mb-6 flex flex-col items-center">
          <div className="relative w-[200px] h-[200px]">
            {isLoading && (
              <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center z-10">
                <QrCode className="text-slate-400" size={48} />
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="rounded-lg shadow-sm"
              style={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s'
              }}
            />
          </div>
          {!isLoading && (
            <Button
              size="sm"
              variant="outline"
              onClick={testUrl}
              className="mt-3 border-violet-500 hover:border-violet-400 text-violet-400 hover:text-violet-300 text-xs"
            >
              🔗 Testar URL
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-slate-800/50 rounded-xl">
          <Users className="text-cyan-400" size={20} />
          <span className="text-white font-semibold">{remoteClients}</span>
          <span className="text-slate-400 text-sm">
            {remoteClients === 1 ? 'dispositivo conectado' : 'dispositivos conectados'}
          </span>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="text-violet-400" size={16} />
            <span className="text-slate-300 text-sm font-medium">URL do Controle:</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg break-all">
              {finalUrl}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
              className={`transition-all duration-200 ${copied
                ? 'bg-green-600 border-green-500 text-white'
                : 'border-slate-600 hover:border-violet-400'
                }`}
            >
              {copied ? '✓' : '📋'}
            </Button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-slate-300 font-semibold mb-2 text-sm">Como usar:</h3>
          <div className="space-y-1 text-xs text-slate-400">
            <p>Escaneie o QR Code com seu celular</p>
            <p>Ou acesse a URL diretamente</p>
            <p>Use os botões para navegar nos slides</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-600 hover:border-violet-400 text-white"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};