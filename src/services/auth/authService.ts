/**
 * @fileoverview Serviço de autenticação
 * Comunica com a API do backend para login, registro e gerenciamento de sessão
 */

import { User } from '../../stores/useAuthStore';

// URL base da API - ajuste conforme necessário
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class AuthService {
  private getHeaders(token?: string | null): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      
      // Formata erros de validação
      if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        throw new Error(Array.isArray(firstError) ? firstError[0] : error.message);
      }
      
      throw new Error(error.message || 'Ocorreu um erro inesperado');
    }

    return data as T;
  }

  /**
   * Login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  /**
   * Registro de novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  /**
   * Logout do usuário
   */
  async logout(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Logout de todos os dispositivos
   */
  async logoutAll(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/logout-all`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Buscar dados do usuário autenticado
   */
  async getMe(token: string): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    return this.handleResponse<{ user: User }>(response);
  }

  /**
   * Verificar se o token é válido
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.getMe(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verificar saúde da API
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ status: string; message: string }>(response);
  }
}

export const authService = new AuthService();
export type { LoginCredentials, RegisterData, AuthResponse, ApiError };

