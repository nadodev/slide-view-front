/**
 * @fileoverview Página de Login
 * Design moderno com suporte a temas e integração com API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { useTheme } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/auth';
import { socialAuthService } from '../../services/auth/socialAuth';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { login, isAuthenticated } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [providers, setProviders] = useState({ google: false, github: false });

  // Verificar providers disponíveis
  useEffect(() => {
    const checkProviders = async () => {
      try {
        const status = await socialAuthService.getProviders();
        setProviders({
          google: status.providers.google.enabled,
          github: status.providers.github.enabled,
        });
      } catch {
        // Silently fail - providers não configurados
      }
    };
    checkProviders();
  }, []);

  // Se já está autenticado, redireciona
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';
    navigate(from, { replace: true });
  }

  const colors = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    cardBg: isDark ? 'bg-slate-900/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl',
    cardBorder: isDark ? 'border-white/10' : 'border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    textSubtle: isDark ? 'text-slate-500' : 'text-slate-400',
    inputBg: isDark ? 'bg-slate-800/50' : 'bg-slate-50',
    inputBorder: isDark ? 'border-slate-700' : 'border-slate-200',
    inputFocus: isDark ? 'focus:border-blue-500 focus:ring-blue-500/20' : 'focus:border-blue-500 focus:ring-blue-500/20',
    buttonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white',
    buttonSecondary: isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      // Salva o usuário e token no store
      login(response.user, response.token);
      
      // Redireciona para a página anterior ou /app
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('');
    setSocialLoading(provider);

    try {
      if (provider === 'google') {
        await socialAuthService.loginWithGoogle();
      } else {
        await socialAuthService.loginWithGitHub();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Erro ao iniciar login com ${provider}`);
      setSocialLoading(null);
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} flex flex-col transition-colors duration-300`}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${isDark ? 'bg-blue-500/10' : 'bg-blue-400/20'} rounded-full blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${isDark ? 'bg-purple-500/10' : 'bg-purple-400/20'} rounded-full blur-3xl`} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} font-bold shadow-lg`}>
            ▲
          </div>
          <span className={`text-xl font-semibold ${colors.text}`}>SlideMD</span>
        </Link>
        <ThemeToggle size="sm" />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-8 shadow-2xl`}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>
                Bem-vindo de volta
              </h1>
              <p className={colors.textMuted}>
                Entre na sua conta para continuar
              </p>
            </div>

            {/* Social Login */}
            {(providers.google || providers.github) && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {providers.google && (
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      disabled={socialLoading !== null}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${colors.buttonSecondary} transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {socialLoading === 'google' ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Chrome size={18} />
                      )}
                      <span className="text-sm font-medium">Google</span>
                    </button>
                  )}
                  {providers.github && (
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('github')}
                      disabled={socialLoading !== null}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${colors.buttonSecondary} transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {socialLoading === 'github' ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Github size={18} />
                      )}
                      <span className="text-sm font-medium">GitHub</span>
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 flex items-center`}>
                    <div className={`w-full border-t ${colors.inputBorder}`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-4 ${isDark ? 'bg-slate-900/50' : 'bg-white/80'} ${colors.textSubtle}`}>
                      ou continue com email
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                  Email
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${colors.textSubtle}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${colors.inputBorder} ${colors.inputBg} ${colors.text} placeholder:${colors.textSubtle} ${colors.inputFocus} focus:ring-4 outline-none transition-all duration-200`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium ${colors.text}`}>
                    Senha
                  </label>
                  <Link 
                    to="/recuperar-senha" 
                    className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
                  >
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${colors.textSubtle}`}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${colors.inputBorder} ${colors.inputBg} ${colors.text} placeholder:${colors.textSubtle} ${colors.inputFocus} focus:ring-4 outline-none transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-4 flex items-center ${colors.textSubtle} hover:${colors.text} transition-colors`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl ${colors.buttonPrimary} font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className={`mt-6 text-center text-sm ${colors.textMuted}`}>
              Não tem uma conta?{' '}
              <Link 
                to="/registrar" 
                className={`font-semibold ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
              >
                Criar conta
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className={`mt-6 text-center text-xs ${colors.textSubtle}`}>
            Ao continuar, você concorda com nossos{' '}
            <Link to="/termos" className={`underline hover:${colors.text}`}>Termos de Uso</Link>
            {' '}e{' '}
            <Link to="/privacidade" className={`underline hover:${colors.text}`}>Política de Privacidade</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
