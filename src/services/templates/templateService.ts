/**
 * @fileoverview Serviço para templates de apresentações
 */

import { useAuthStore } from '../../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface Template {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    thumbnail: string | null;
    icon: string;
    is_premium: boolean;
    slide_count: number;
    usage_count: number;
    locked: boolean;
    slides?: Array<{
        title: string;
        content: string;
        notes?: string;
    }>;
}

export interface TemplateCategory {
    slug: string;
    name: string;
    description: string;
    icon: string;
}

class TemplateService {
    private getHeaders(): HeadersInit {
        const token = useAuthStore.getState().token;
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    }

    /**
     * Listar todos os templates
     */
    async list(category?: string): Promise<{
        templates: Template[];
        categories: Record<string, Template[]>;
        total: number;
    }> {
        const url = new URL(`${API_BASE_URL}/templates`);
        if (category) {
            url.searchParams.append('category', category);
        }

        const response = await fetch(url.toString(), {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar templates');
        }

        return response.json();
    }

    /**
     * Obter detalhes de um template
     */
    async get(templateId: number): Promise<{ template: Template }> {
        const response = await fetch(
            `${API_BASE_URL}/templates/${templateId}`,
            { headers: this.getHeaders() }
        );

        if (!response.ok) {
            throw new Error('Template não encontrado');
        }

        return response.json();
    }

    /**
     * Usar template para criar apresentação
     */
    async useTemplate(templateId: number, title?: string): Promise<{
        message: string;
        presentation: {
            id: number;
            title: string;
            slides: Array<{ id: number; content: string }>;
        };
    }> {
        const response = await fetch(
            `${API_BASE_URL}/templates/${templateId}/use`,
            {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ title }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao usar template');
        }

        return response.json();
    }

    /**
     * Listar categorias
     */
    async getCategories(): Promise<{ categories: TemplateCategory[] }> {
        const response = await fetch(`${API_BASE_URL}/templates/categories`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar categorias');
        }

        return response.json();
    }
}

export const templateService = new TemplateService();

