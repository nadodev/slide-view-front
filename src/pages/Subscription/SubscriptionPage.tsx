/**
 * @fileoverview Página de Assinatura
 * Área para o usuário gerenciar sua assinatura e ver pagamentos
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  FileText, 
  QrCode, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  Crown,
  Zap,
  Download,
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useTheme } from '../../stores/useThemeStore';
import { subscriptionService, SubscriptionStatus, Payment, Plan } from '../../services/subscription/subscriptionService';
import { ThemeToggle } from '../../components/ThemeToggle';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingType, setBillingType] = useState<'CREDIT_CARD' | 'PIX' | 'BOLETO'>('PIX');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const colors = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    cardBg: isDark ? 'bg-slate-900/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl',
    cardBorder: isDark ? 'border-white/10' : 'border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    textSubtle: isDark ? 'text-slate-500' : 'text-slate-400',
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statusRes, plansRes, paymentsRes] = await Promise.all([
        subscriptionService.getStatus(),
        subscriptionService.getPlans(),
        subscriptionService.getPayments(),
      ]);

      setStatus(statusRes);
      setPlans(plansRes.plans.filter(p => !p.is_free));
      setPayments(paymentsRes.payments);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;

    setCheckoutLoading(true);
    try {
      const result = await subscriptionService.checkout(selectedPlan.id, billingType);
      setCheckoutResult(result);
      toast.success('Assinatura criada! Complete o pagamento.');
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await subscriptionService.cancel();
      toast.success('Assinatura cancelada');
      setShowCancelModal(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const getStatusBadge = (paymentStatus: string) => {
    const badges: Record<string, { color: string; icon: any }> = {
      PENDING: { color: 'bg-yellow-500/20 text-yellow-500', icon: Clock },
      RECEIVED: { color: 'bg-green-500/20 text-green-500', icon: Check },
      CONFIRMED: { color: 'bg-green-500/20 text-green-500', icon: Check },
      OVERDUE: { color: 'bg-red-500/20 text-red-500', icon: AlertTriangle },
      REFUNDED: { color: 'bg-slate-500/20 text-slate-500', icon: X },
    };
    return badges[paymentStatus] || badges.PENDING;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${colors.bg} flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className={`p-2 rounded-lg hover:bg-white/10 ${colors.textMuted}`}>
              <ArrowLeft size={20} />
            </Link>
            <h1 className={`text-xl font-semibold ${colors.text}`}>Minha Assinatura</h1>
          </div>
          <ThemeToggle size="sm" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Atual */}
        <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${colors.text}`}>Status Atual</h2>
            {status?.has_subscription && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                Cancelar assinatura
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${status?.has_subscription ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20' : 'bg-slate-500/20'}`}>
              {status?.has_subscription ? <Crown className="text-amber-500" size={32} /> : <Zap className="text-slate-500" size={32} />}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${colors.text}`}>
                {status?.plan?.name || 'Plano Free'}
              </h3>
              <p className={colors.textMuted}>
                {status?.has_subscription
                  ? `Próximo pagamento: ${status.subscription_details?.next_due_date || 'N/A'}`
                  : 'Faça upgrade para recursos ilimitados'}
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Result - PIX */}
        {checkoutResult?.payment?.pix && (
          <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 mb-8`}>
            <h2 className={`text-lg font-semibold ${colors.text} mb-4`}>Pague com PIX</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {checkoutResult.payment.pix.qr_code && (
                <div className="flex-shrink-0">
                  <img 
                    src={`data:image/png;base64,${checkoutResult.payment.pix.qr_code}`} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className={`${colors.textMuted} mb-4`}>
                  Escaneie o QR Code ou copie o código abaixo:
                </p>
                {checkoutResult.payment.pix.copy_paste && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={checkoutResult.payment.pix.copy_paste}
                      readOnly
                      className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'} ${colors.text} text-sm`}
                    />
                    <button
                      onClick={() => copyToClipboard(checkoutResult.payment.pix.copy_paste)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                )}
                <p className={`mt-4 text-sm ${colors.textSubtle}`}>
                  Valor: R$ {checkoutResult.payment.value.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Planos */}
        {!status?.has_subscription && (
          <div className="mb-8">
            <h2 className={`text-lg font-semibold ${colors.text} mb-4`}>Escolha um Plano</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`${colors.cardBg} rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    selectedPlan?.id === plan.id 
                      ? 'border-blue-500 ring-2 ring-blue-500/20' 
                      : colors.cardBorder + ' hover:border-blue-500/50'
                  }`}
                >
                  <h3 className={`text-lg font-bold ${colors.text} mb-2`}>{plan.name}</h3>
                  <p className={`text-3xl font-bold ${colors.text} mb-4`}>
                    R$ {Number(plan.price).toFixed(2)}
                    <span className={`text-sm font-normal ${colors.textMuted}`}>/{plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}</span>
                  </p>
                  <ul className="space-y-2">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className={`flex items-center gap-2 text-sm ${colors.textMuted}`}>
                        <Check size={16} className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Forma de Pagamento */}
            {selectedPlan && (
              <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 mt-6`}>
                <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>Forma de Pagamento</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { type: 'PIX' as const, icon: QrCode, label: 'PIX' },
                    { type: 'CREDIT_CARD' as const, icon: CreditCard, label: 'Cartão' },
                    { type: 'BOLETO' as const, icon: FileText, label: 'Boleto' },
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setBillingType(type)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        billingType === type
                          ? 'border-blue-500 bg-blue-500/10'
                          : `${colors.cardBorder} hover:border-blue-500/50`
                      }`}
                    >
                      <Icon size={24} className={billingType === type ? 'text-blue-500' : colors.textMuted} />
                      <span className={`text-sm ${billingType === type ? 'text-blue-500' : colors.textMuted}`}>{label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Assinar {selectedPlan.name}</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Histórico de Pagamentos */}
        <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6`}>
          <h2 className={`text-lg font-semibold ${colors.text} mb-4`}>Histórico de Pagamentos</h2>
          
          {payments.length === 0 ? (
            <p className={colors.textMuted}>Nenhum pagamento registrado.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => {
                const badge = getStatusBadge(payment.status);
                const BadgeIcon = badge.icon;
                return (
                  <div 
                    key={payment.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${badge.color}`}>
                        <BadgeIcon size={20} />
                      </div>
                      <div>
                        <p className={`font-medium ${colors.text}`}>
                          R$ {Number(payment.value).toFixed(2)}
                        </p>
                        <p className={`text-sm ${colors.textMuted}`}>
                          {payment.billing_type_label} • {new Date(payment.due_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${badge.color}`}>
                        {payment.status_label}
                      </span>
                      {payment.invoice_url && (
                        <a
                          href={payment.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-white/10"
                        >
                          <ExternalLink size={16} className={colors.textMuted} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 max-w-md w-full mx-4`}>
            <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>Cancelar Assinatura?</h3>
            <p className={`${colors.textMuted} mb-6`}>
              Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className={`flex-1 py-2 rounded-xl border ${colors.cardBorder} ${colors.text}`}
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading ? <Loader2 className="animate-spin" size={18} /> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

