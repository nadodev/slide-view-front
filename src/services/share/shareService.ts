/**
 * @fileoverview Serviço para compartilhamento de apresentações
 */

import { useAuthStore } from '../../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface ShareSettings {
    is_public: boolean;
    allow_embed: boolean;
    share_token: string | null;
    shared_at: string | null;
    view_count: number;
    share_url: string | null;
    embed_code: string | null;
}

class ShareService {
    private getHeaders(): HeadersInit {
        const token = useAuthStore.getState().token;
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    }

    /**
     * Obter configurações de compartilhamento
     */
    async getShareSettings(presentationId: number): Promise<ShareSettings> {
        const response = await fetch(
            `${API_BASE_URL}/presentations/${presentationId}/share`,
            { headers: this.getHeaders() }
        );

        if (!response.ok) {
            throw new Error('Erro ao carregar configurações');
        }

        return response.json();
    }

    /**
     * Habilitar compartilhamento
     */
    async enableSharing(presentationId: number, allowEmbed: boolean = false): Promise<{
        share_url: string;
        embed_code: string | null;
        share_token: string;
    }> {
        const response = await fetch(
            `${API_BASE_URL}/presentations/${presentationId}/share/enable`,
            {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ allow_embed: allowEmbed }),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao habilitar compartilhamento');
        }

        return response.json();
    }

    /**
     * Desabilitar compartilhamento
     */
    async disableSharing(presentationId: number): Promise<void> {
        const response = await fetch(
            `${API_BASE_URL}/presentations/${presentationId}/share/disable`,
            {
                method: 'POST',
                headers: this.getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao desabilitar compartilhamento');
        }
    }

    /**
     * Atualizar configurações
     */
    async updateSettings(presentationId: number, allowEmbed: boolean): Promise<{
        embed_code: string | null;
    }> {
        const response = await fetch(
            `${API_BASE_URL}/presentations/${presentationId}/share`,
            {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ allow_embed: allowEmbed }),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar configurações');
        }

        return response.json();
    }

    /**
     * Regenerar token
     */
    async regenerateToken(presentationId: number): Promise<{
        share_url: string;
        embed_code: string | null;
        share_token: string;
    }> {
        const response = await fetch(
            `${API_BASE_URL}/presentations/${presentationId}/share/regenerate`,
            {
                method: 'POST',
                headers: this.getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao regenerar token');
        }

        return response.json();
    }

    /**
     * Visualizar apresentação pública (sem auth)
     */
    async viewPublic(token: string): Promise<{
        presentation: {
            id: number;
            title: string;
            description: string;
            author: string;
            slide_count: number;
            slides: Array<{
                id: number;
                content: string;
                title: string;
            }>;
            settings: Record<string, unknown>;
            view_count: number;
        };
    }> {
        const response = await fetch(`${API_BASE_URL}/public/presentations/${token}`);

        if (!response.ok) {
            throw new Error('Apresentação não encontrada');
        }

        return response.json();
    }

    /**
     * Obter dados para embed
     */
    async getEmbed(token: string): Promise<{
        title: string;
        slides: Array<{
            id: number;
            content: string;
        }>;
        settings: Record<string, unknown>;
        slide_count: number;
    }> {
        const response = await fetch(`${API_BASE_URL}/public/embed/${token}`);

        if (!response.ok) {
            throw new Error('Embed não disponível');
        }

        return response.json();
    }
}

export const shareService = new ShareService();

