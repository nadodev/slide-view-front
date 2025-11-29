/**
 * @fileoverview Serviço de autenticação social (Google/GitHub)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface SocialAuthResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    plan: string;
    provider: string;
  };
  token: string;
  token_type: string;
}

export interface ProvidersStatus {
  providers: {
    google: { enabled: boolean };
    github: { enabled: boolean };
  };
}

class SocialAuthService {
  /**
   * Verificar quais providers estão habilitados
   */
  async getProviders(): Promise<ProvidersStatus> {
    const response = await fetch(`${API_BASE_URL}/auth/providers`);
    if (!response.ok) {
      throw new Error('Erro ao verificar providers');
    }
    return response.json();
  }

  /**
   * Iniciar fluxo de login com Google
   */
  async loginWithGoogle(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/redirect`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao iniciar login com Google');
      }

      // Redireciona para o Google
      window.location.href = data.url;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Processar callback do Google
   */
  async handleGoogleCallback(code: string): Promise<SocialAuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao autenticar com Google');
    }

    return data;
  }

  /**
   * Iniciar fluxo de login com GitHub
   */
  async loginWithGitHub(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/github/redirect`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao iniciar login com GitHub');
      }

      // Redireciona para o GitHub
      window.location.href = data.url;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Processar callback do GitHub
   */
  async handleGitHubCallback(code: string): Promise<SocialAuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/github/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao autenticar com GitHub');
    }

    return data;
  }
}

export const socialAuthService = new SocialAuthService();

