/**
 * @fileoverview Repository para Presentations
 * Abstração para acesso a dados de apresentações (localStorage agora, API Laravel depois)
 */

import { httpClient, withRetry } from '../http-client';
import { saveSlides, loadSlides, clearSlides } from '../../utils/storage.utils';
import { FEATURE_FLAGS } from '../../config';
import type { Slide, Presentation, ApiResponse, PaginatedResponse } from '../../types';

// ============================================
// REPOSITORY INTERFACE
// ============================================

interface IPresentationRepository {
  // Slides
  getSlides(): Promise<Slide[]>;
  saveSlides(slides: Slide[]): Promise<boolean>;
  clearSlides(): Promise<boolean>;
  
  // Presentations (futuro - API Laravel)
  getAll(): Promise<PaginatedResponse<Presentation>>;
  getById(id: string): Promise<Presentation | null>;
  create(data: Partial<Presentation>): Promise<Presentation>;
  update(id: string, data: Partial<Presentation>): Promise<Presentation>;
  delete(id: string): Promise<boolean>;
}

// ============================================
// LOCAL STORAGE IMPLEMENTATION
// ============================================

class LocalPresentationRepository implements IPresentationRepository {
  async getSlides(): Promise<Slide[]> {
    return loadSlides();
  }

  async saveSlides(slides: Slide[]): Promise<boolean> {
    return saveSlides(slides);
  }

  async clearSlides(): Promise<boolean> {
    return clearSlides();
  }

  // Métodos stub para compatibilidade futura
  async getAll(): Promise<PaginatedResponse<Presentation>> {
    const slides = await this.getSlides();
    
    // Simula uma presentation local
    const presentation: Presentation = {
      id: 'local',
      title: 'Local Presentation',
      slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      data: slides.length > 0 ? [presentation] : [],
      meta: {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: slides.length > 0 ? 1 : 0,
      },
    };
  }

  async getById(id: string): Promise<Presentation | null> {
    if (id !== 'local') return null;
    
    const slides = await this.getSlides();
    if (slides.length === 0) return null;

    return {
      id: 'local',
      title: 'Local Presentation',
      slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async create(data: Partial<Presentation>): Promise<Presentation> {
    const slides = data.slides || [];
    await this.saveSlides(slides);

    return {
      id: 'local',
      title: data.title || 'Local Presentation',
      slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async update(id: string, data: Partial<Presentation>): Promise<Presentation> {
    if (data.slides) {
      await this.saveSlides(data.slides);
    }

    const slides = await this.getSlides();

    return {
      id,
      title: data.title || 'Local Presentation',
      slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async delete(id: string): Promise<boolean> {
    return this.clearSlides();
  }
}

// ============================================
// API IMPLEMENTATION (FUTURO - LARAVEL)
// ============================================

class ApiPresentationRepository implements IPresentationRepository {
  private endpoint = '/presentations';

  async getSlides(): Promise<Slide[]> {
    // Para compatibilidade, ainda usa local storage
    // Será alterado quando integrar com API
    return loadSlides();
  }

  async saveSlides(slides: Slide[]): Promise<boolean> {
    // Salva local e sincroniza com API
    const localSave = saveSlides(slides);
    
    // TODO: Sincronizar com API
    // await this.syncToCloud(slides);
    
    return localSave;
  }

  async clearSlides(): Promise<boolean> {
    return clearSlides();
  }

  async getAll(): Promise<PaginatedResponse<Presentation>> {
    const response = await withRetry(() => 
      httpClient.get<PaginatedResponse<Presentation>>(this.endpoint)
    );
    return response.data;
  }

  async getById(id: string): Promise<Presentation | null> {
    try {
      const response = await httpClient.get<Presentation>(`${this.endpoint}/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async create(data: Partial<Presentation>): Promise<Presentation> {
    const response = await httpClient.post<Presentation>(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: Partial<Presentation>): Promise<Presentation> {
    const response = await httpClient.put<Presentation>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<boolean> {
    await httpClient.delete(`${this.endpoint}/${id}`);
    return true;
  }
}

// ============================================
// FACTORY
// ============================================

function createPresentationRepository(): IPresentationRepository {
  // Usa API quando CLOUD_SYNC estiver ativado
  if (FEATURE_FLAGS.CLOUD_SYNC) {
    return new ApiPresentationRepository();
  }
  
  return new LocalPresentationRepository();
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const presentationRepository = createPresentationRepository();

export type { IPresentationRepository };

