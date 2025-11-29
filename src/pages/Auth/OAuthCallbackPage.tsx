/**
 * @fileoverview Página de callback OAuth
 * Processa o retorno do Google/GitHub após autenticação
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { socialAuthService } from '../../services/auth/socialAuth';
import { useTheme } from '../../stores/useThemeStore';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const { isDark } = useTheme();

  // Determinar o provider baseado na URL
  const getProvider = () => {
    if (location.pathname.includes('/google/')) return 'google';
    if (location.pathname.includes('/github/')) return 'github';
    return null;
  };
  const provider = getProvider();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autenticação...');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const success = searchParams.get('success');
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Erro na autenticação: ${error}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Se o token já veio na URL (redirecionamento do backend)
      if (token && success === 'true') {
        try {
          // Buscar dados do usuário usando o token
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Erro ao obter dados do usuário');
          }

          const userData = await response.json();

          // Salva no store
          login(userData, token);

          setStatus('success');
          setMessage('Login realizado com sucesso!');

          // Redireciona para o dashboard
          setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
          setStatus('error');
          setMessage(err instanceof Error ? err.message : 'Erro ao processar autenticação');
          setTimeout(() => navigate('/login'), 3000);
        }
        return;
      }

      // Fluxo antigo: se veio o código, trocar pelo token
      if (!code) {
        setStatus('error');
        setMessage('Código de autorização não encontrado');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        let response;

        if (provider === 'google') {
          response = await socialAuthService.handleGoogleCallback(code);
        } else if (provider === 'github') {
          response = await socialAuthService.handleGitHubCallback(code);
        } else {
          throw new Error('Provider não suportado');
        }

        // Salva no store
        login(response.user, response.token);

        setStatus('success');
        setMessage('Login realizado com sucesso!');

        // Redireciona para o dashboard
        setTimeout(() => navigate('/dashboard'), 1500);

      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Erro ao processar autenticação');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, provider, login, navigate]);

  const colors = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    cardBg: isDark ? 'bg-slate-900/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl',
    cardBorder: isDark ? 'border-white/10' : 'border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
  };

  return (
    <div className={`min-h-screen ${colors.bg} flex items-center justify-center p-6`}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${isDark ? 'bg-blue-500/10' : 'bg-blue-400/20'} rounded-full blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${isDark ? 'bg-purple-500/10' : 'bg-purple-400/20'} rounded-full blur-3xl`} />
      </div>

      <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-8 shadow-2xl text-center max-w-md w-full relative z-10`}>
        {status === 'loading' && (
          <>
            <Loader2 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-spin`} />
            <h2 className={`text-xl font-semibold ${colors.text} mb-2`}>
              Autenticando...
            </h2>
            <p className={colors.textMuted}>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className={`text-xl font-semibold ${colors.text} mb-2`}>
              Sucesso!
            </h2>
            <p className={colors.textMuted}>{message}</p>
            <p className={`mt-2 text-sm ${colors.textMuted}`}>Redirecionando...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className={`text-xl font-semibold ${colors.text} mb-2`}>
              Erro na autenticação
            </h2>
            <p className={colors.textMuted}>{message}</p>
            <p className={`mt-2 text-sm ${colors.textMuted}`}>Redirecionando para login...</p>
          </>
        )}
      </div>
    </div>
  );
}

