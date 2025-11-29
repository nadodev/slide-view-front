/**
 * @fileoverview Serviço de assinatura e pagamentos
 */

import { useAuthStore } from '../../stores/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: string[];
  max_slides: number | null;
  max_presentations: number | null;
  is_free: boolean;
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  subscription_status: string | null;
  plan: Plan | null;
  next_due_date: string | null;
  expires_at: string | null;
  subscription_details?: {
    status: string;
    value: number;
    next_due_date: string;
    billing_type: string;
  };
}

export interface Payment {
  id: number;
  asaas_payment_id: string;
  value: number;
  billing_type: string;
  status: string;
  due_date: string;
  payment_date: string | null;
  invoice_url: string | null;
  bank_slip_url: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  description: string | null;
  plan?: Plan;
  billing_type_label: string;
  status_label: string;
  created_at: string;
}

export interface CheckoutResponse {
  message: string;
  subscription_id: string;
  payment?: {
    id: string;
    invoice_url: string | null;
    bank_slip_url: string | null;
    due_date: string;
    value: number;
    pix?: {
      qr_code: string | null;
      copy_paste: string | null;
      expiration_date: string | null;
    };
  };
}

export interface PaymentsResponse {
  payments: Payment[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

class SubscriptionService {
  private getHeaders(): HeadersInit {
    const token = useAuthStore.getState().token;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * Obter status da assinatura
   */
  async getStatus(): Promise<SubscriptionStatus> {
    const response = await fetch(`${API_BASE_URL}/subscription/status`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar status da assinatura');
    }

    return response.json();
  }

  /**
   * Criar checkout para assinatura
   */
  async checkout(planId: number, billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'): Promise<CheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        plan_id: planId,
        billing_type: billingType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar checkout');
    }

    return data;
  }

  /**
   * Cancelar assinatura
   */
  async cancel(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/subscription/cancel`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao cancelar assinatura');
    }

    return data;
  }

  /**
   * Listar histórico de pagamentos
   */
  async getPayments(page = 1): Promise<PaymentsResponse> {
    const response = await fetch(`${API_BASE_URL}/subscription/payments?page=${page}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar pagamentos');
    }

    return response.json();
  }

  /**
   * Obter detalhes de um pagamento
   */
  async getPaymentDetails(paymentId: number): Promise<Payment> {
    const response = await fetch(`${API_BASE_URL}/subscription/payments/${paymentId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar pagamento');
    }

    return response.json();
  }

  /**
   * Listar planos disponíveis
   */
  async getPlans(): Promise<{ plans: Plan[] }> {
    const response = await fetch(`${API_BASE_URL}/plans`);

    if (!response.ok) {
      throw new Error('Erro ao carregar planos');
    }

    return response.json();
  }
}

export const subscriptionService = new SubscriptionService();

