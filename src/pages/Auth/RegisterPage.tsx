/**
 * @fileoverview Página de Registro
 * Design moderno com suporte a temas e integração com API
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useTheme } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/auth';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { login, isAuthenticated } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Se já está autenticado, redireciona
  if (isAuthenticated) {
    navigate('/app', { replace: true });
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
    inputFocus: isDark ? 'focus:border-purple-500 focus:ring-purple-500/20' : 'focus:border-purple-500 focus:ring-purple-500/20',
    buttonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white',
    buttonSecondary: isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
    checkboxBg: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300',
    checkboxChecked: 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent',
  };

  // Validação de senha
  const passwordRequirements = [
    { label: 'Mínimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Uma letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Um número', valid: /[0-9]/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every(r => r.valid);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

    if (!doPasswordsMatch) {
      setError('As senhas não coincidem');
      return;
    }

    if (!acceptTerms) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      
      // Salva o usuário e token no store
      login(response.user, response.token);
      
      // Redireciona para /app
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} flex flex-col transition-colors duration-300`}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-80 h-80 ${isDark ? 'bg-purple-500/10' : 'bg-purple-400/20'} rounded-full blur-3xl`} />
        <div className={`absolute -bottom-40 -right-40 w-80 h-80 ${isDark ? 'bg-pink-500/10' : 'bg-pink-400/20'} rounded-full blur-3xl`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${isDark ? 'bg-blue-500/5' : 'bg-blue-400/10'} rounded-full blur-3xl`} />
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
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-8 shadow-2xl`}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>
                Criar sua conta
              </h1>
              <p className={colors.textMuted}>
                Comece a criar apresentações incríveis
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                  Nome completo
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${colors.textSubtle}`}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${colors.inputBorder} ${colors.inputBg} ${colors.text} placeholder:${colors.textSubtle} ${colors.inputFocus} focus:ring-4 outline-none transition-all duration-200`}
                  />
                </div>
              </div>

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
                <label className={`text-sm font-medium ${colors.text} mb-2 block`}>
                  Senha
                </label>
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
                
                {/* Password requirements */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-xs ${req.valid ? 'text-green-500' : colors.textSubtle}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.valid ? 'bg-green-500/20' : `${colors.inputBg}`}`}>
                          {req.valid && <Check size={10} />}
                        </div>
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`text-sm font-medium ${colors.text} mb-2 block`}>
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${colors.textSubtle}`}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${colors.inputBorder} ${colors.inputBg} ${colors.text} placeholder:${colors.textSubtle} ${colors.inputFocus} focus:ring-4 outline-none transition-all duration-200 ${confirmPassword.length > 0 && !doPasswordsMatch ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-0 pr-4 flex items-center ${colors.textSubtle} hover:${colors.text} transition-colors`}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !doPasswordsMatch && (
                  <p className="mt-1 text-xs text-red-500">As senhas não coincidem</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className={`flex-shrink-0 w-5 h-5 rounded border ${acceptTerms ? colors.checkboxChecked : colors.checkboxBg} flex items-center justify-center transition-all duration-200`}
                >
                  {acceptTerms && <Check size={12} className="text-white" />}
                </button>
                <p className={`text-sm ${colors.textMuted}`}>
                  Li e aceito os{' '}
                  <Link to="/termos" className={`underline ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Termos de Uso
                  </Link>
                  {' '}e{' '}
                  <Link to="/privacidade" className={`underline ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Política de Privacidade
                  </Link>
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || !doPasswordsMatch || !acceptTerms}
                className={`w-full py-3 px-4 rounded-xl ${colors.buttonPrimary} font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-6`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Criar conta
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className={`mt-6 text-center text-sm ${colors.textMuted}`}>
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className={`font-semibold ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} transition-colors`}
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
