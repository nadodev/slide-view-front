/**
 * @fileoverview Componente de proteção de rotas
 * Verifica se o usuário está autenticado antes de renderizar a rota
 */

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  requiredPlans?: string[];
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredPlans 
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, token, user, setUser, logout, isLoading, setLoading } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      // Se não tem token, não está autenticado
      if (!token) {
        setLoading(false);
        setIsValidating(false);
        return;
      }

      // Se já tem usuário e token, valida o token
      try {
        const response = await authService.getMe(token);
        setUser(response.user);
      } catch {
        // Token inválido ou expirado
        logout();
      } finally {
        setLoading(false);
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [token, setUser, logout, setLoading]);

  // Loading state
  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Não autenticado - redireciona para login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica role se necessário
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-slate-400 mb-4">Você não tem permissão para acessar esta página.</p>
          <a 
            href="/app" 
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  // Verifica plano se necessário
  if (requiredPlans && requiredPlans.length > 0) {
    const userPlan = user.plan?.slug || 'free';
    if (!requiredPlans.includes(userPlan) && user.role !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Recurso Premium</h2>
            <p className="text-slate-400 mb-4">
              Este recurso requer um plano {requiredPlans.join(' ou ')}.
            </p>
            <div className="flex gap-3 justify-center">
              <a 
                href="/app" 
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Voltar
              </a>
              <a 
                href="/planos" 
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-colors"
              >
                Ver planos
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // Usuário autenticado e autorizado
  return <>{children}</>;
}

