/**
 * @fileoverview Serviço para gerenciar rascunhos (auto-save)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface Draft {
    id: number;
    user_id: number;
    presentation_id: number | null;
    type: 'presentation' | 'slide';
    title: string | null;
    content: string;
    metadata: Record<string, any> | null;
    last_saved_at: string;
    created_at: string;
    updated_at: string;
}

export interface SaveDraftPayload {
    presentation_id?: number | null;
    type: 'presentation' | 'slide';
    title?: string;
    content: string;
    metadata?: Record<string, any>;
}

class DraftService {
    private getHeaders(token: string): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    /**
     * Listar rascunhos do usuário
     */
    async getDrafts(token: string): Promise<Draft[]> {
        const response = await fetch(`${API_BASE_URL}/drafts`, {
            method: 'GET',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar rascunhos');
        }

        const data = await response.json();
        return data.drafts;
    }

    /**
     * Salvar rascunho (auto-save)
     */
    async saveDraft(token: string, payload: SaveDraftPayload): Promise<{ draft: Draft; saved_at: string }> {
        const response = await fetch(`${API_BASE_URL}/drafts`, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar rascunho');
        }

        return await response.json();
    }

    /**
     * Obter um rascunho específico
     */
    async getDraft(token: string, draftId: number): Promise<Draft> {
        const response = await fetch(`${API_BASE_URL}/drafts/${draftId}`, {
            method: 'GET',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            throw new Error('Rascunho não encontrado');
        }

        const data = await response.json();
        return data.draft;
    }

    /**
     * Deletar um rascunho
     */
    async deleteDraft(token: string, draftId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/drafts/${draftId}`, {
            method: 'DELETE',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar rascunho');
        }
    }

    /**
     * Limpar rascunhos antigos
     */
    async cleanup(token: string): Promise<{ deleted_count: number }> {
        const response = await fetch(`${API_BASE_URL}/drafts/cleanup`, {
            method: 'POST',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            throw new Error('Erro ao limpar rascunhos');
        }

        return await response.json();
    }
}

export const draftService = new DraftService();

