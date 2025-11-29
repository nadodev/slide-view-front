/**
 * @fileoverview Cliente HTTP abstrato para comunicação com API
 * Preparado para integração futura com Laravel
 */

import { API_CONFIG } from '../config';
import { loadAuthToken } from '../utils/storage.utils';
import type { ApiResponse, ApiError } from '../types';

// ============================================
// TYPES
// ============================================

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  signal?: AbortSignal;
}

interface HttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  onUnauthorized?: () => void;
}

// ============================================
// HTTP CLIENT CLASS
// ============================================

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private onUnauthorized?: () => void;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = config.defaultHeaders || {};
    this.timeout = config.timeout || API_CONFIG.TIMEOUT;
    this.onUnauthorized = config.onUnauthorized;
  }

  /**
   * Constrói a URL com query params
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    return url.toString();
  }

  /**
   * Constrói os headers da requisição
   */
  private buildHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.defaultHeaders,
      ...customHeaders,
    });

    // Adiciona token de autenticação se existir
    const token = loadAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Executa a requisição HTTP
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.timeout);

    try {
      const url = this.buildUrl(endpoint, config.params);
      const headers = this.buildHeaders(config.headers);

      const fetchConfig: RequestInit = {
        method,
        headers,
        signal: config.signal || controller.signal,
      };

      if (data && method !== 'GET') {
        fetchConfig.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchConfig);
      clearTimeout(timeoutId);

      // Handle unauthorized
      if (response.status === 401) {
        this.onUnauthorized?.();
        throw new Error('Unauthorized');
      }

      // Parse response
      const responseData = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: responseData.message || 'Erro na requisição',
          code: String(response.status),
          details: responseData.errors,
        };
        throw error;
      }

      return {
        data: responseData.data || responseData,
        message: responseData.message,
        success: true,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw { message: 'Requisição cancelada por timeout', code: 'TIMEOUT' };
      }
      
      throw error;
    }
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const httpClient = new HttpClient({
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  onUnauthorized: () => {
    // Será implementado: redirecionar para login
    console.warn('Session expired, redirecting to login...');
  },
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Wrapper para requisições com retry automático
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> {
  let lastError: unknown;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Não retry em erros de autenticação
      if ((error as ApiError).code === '401') {
        throw error;
      }
      
      // Espera exponencial
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
}

export default HttpClient;

