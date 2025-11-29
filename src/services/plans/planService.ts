/**
 * @fileoverview Serviço para gerenciar planos e assinaturas
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly';
    features: string[];
    max_slides: number | null;
    max_presentations: number | null;
    is_free: boolean;
}

export interface PlanUsage {
    plan: {
        name: string;
        slug: string;
        features: string[];
    };
    usage: {
        presentations: {
            used: number;
            max: number;
            unlimited: boolean;
        };
        slides_per_presentation: {
            max: number;
            unlimited: boolean;
        };
        total_slides: number;
    };
    is_active: boolean;
    expires_at: string | null;
}

class PlanService {
    private getHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Listar todos os planos disponíveis (público)
     */
    async getPlans(): Promise<Plan[]> {
        const response = await fetch(`${API_BASE_URL}/plans`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar planos');
        }

        const data = await response.json();
        return data.plans;
    }

    /**
     * Obter uso do plano do usuário atual
     */
    async getUsage(token: string): Promise<PlanUsage> {
        const response = await fetch(`${API_BASE_URL}/plans/usage`, {
            method: 'GET',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar uso do plano');
        }

        return await response.json();
    }

    /**
     * Alterar plano do usuário
     */
    async changePlan(token: string, planSlug: string): Promise<{ message: string; plan: any; is_upgrade: boolean }> {
        const response = await fetch(`${API_BASE_URL}/plans/change`, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify({ plan_slug: planSlug }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao alterar plano');
        }

        return await response.json();
    }
}

export const planService = new PlanService();

