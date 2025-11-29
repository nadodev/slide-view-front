/**
 * @fileoverview Serviço para gerenciar apresentações
 * Comunica com a API do backend para CRUD de apresentações e slides
 */

import { useAuthStore } from '../../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Types
export interface SlideData {
  id?: number;
  order?: number;
  title?: string;
  content: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface PresentationSettings {
  theme?: string;
  transition?: string;
  autoPlay?: boolean;
  loopSlides?: boolean;
  [key: string]: unknown;
}

export interface Presentation {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  status: 'draft' | 'published' | 'archived';
  settings?: PresentationSettings;
  slide_count: number;
  slides?: SlideData[];
  slides_count?: number;
  last_edited_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePresentationData {
  title: string;
  description?: string;
  settings?: PresentationSettings;
  slides?: SlideData[];
}

export interface UpdatePresentationData {
  title?: string;
  description?: string;
  thumbnail?: string;
  status?: 'draft' | 'published' | 'archived';
  settings?: PresentationSettings;
}

class PresentationService {
  private getHeaders(): HeadersInit {
    const token = useAuthStore.getState().token;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ocorreu um erro inesperado');
    }

    return data as T;
  }

  /**
   * Listar todas as apresentações do usuário
   */
  async list(): Promise<{ presentations: Presentation[] }> {
    const response = await fetch(`${API_BASE_URL}/presentations`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ presentations: Presentation[] }>(response);
  }

  /**
   * Buscar uma apresentação específica
   */
  async get(id: number): Promise<{ presentation: Presentation }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ presentation: Presentation }>(response);
  }

  /**
   * Criar nova apresentação
   */
  async create(data: CreatePresentationData): Promise<{ message: string; presentation: Presentation }> {
    const response = await fetch(`${API_BASE_URL}/presentations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<{ message: string; presentation: Presentation }>(response);
  }

  /**
   * Atualizar apresentação
   */
  async update(id: number, data: UpdatePresentationData): Promise<{ message: string; presentation: Presentation }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<{ message: string; presentation: Presentation }>(response);
  }

  /**
   * Deletar apresentação
   */
  async delete(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Atualizar todos os slides de uma apresentação
   */
  async updateSlides(presentationId: number, slides: SlideData[]): Promise<{ message: string; presentation: Presentation }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${presentationId}/slides`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ slides }),
    });

    return this.handleResponse<{ message: string; presentation: Presentation }>(response);
  }

  /**
   * Adicionar um slide à apresentação
   */
  async addSlide(presentationId: number, slide: SlideData): Promise<{ message: string; slide: SlideData }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${presentationId}/slides`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(slide),
    });

    return this.handleResponse<{ message: string; slide: SlideData }>(response);
  }

  /**
   * Atualizar um slide específico
   */
  async updateSlide(presentationId: number, slideId: number, slide: Partial<SlideData>): Promise<{ message: string; slide: SlideData }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${presentationId}/slides/${slideId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(slide),
    });

    return this.handleResponse<{ message: string; slide: SlideData }>(response);
  }

  /**
   * Deletar um slide específico
   */
  async deleteSlide(presentationId: number, slideId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${presentationId}/slides/${slideId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Duplicar uma apresentação
   */
  async duplicate(id: number): Promise<{ message: string; presentation: Presentation }> {
    const response = await fetch(`${API_BASE_URL}/presentations/${id}/duplicate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ message: string; presentation: Presentation }>(response);
  }
}

export const presentationService = new PresentationService();
