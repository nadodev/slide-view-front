/**
 * @fileoverview Página de Pricing/Planos
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Check, 
    X, 
    Sparkles, 
    Zap, 
    Crown, 
    ArrowRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useTheme } from '../../stores/useThemeStore';
import { useAuth } from '../../stores/useAuthStore';
import { ThemeToggle } from '../../components/ThemeToggle';
import { planService, type Plan, type PlanUsage } from '../../services/plans/planService';
import { toast } from 'sonner';

export default function PricingPage() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { user, token } = useAuth();
    
    const [plans, setPlans] = useState<Plan[]>([]);
    const [usage, setUsage] = useState<PlanUsage | null>(null);
    const [loading, setLoading] = useState(true);
    const [changingPlan, setChangingPlan] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        loadData();
    }, [token]);

    const loadData = async () => {
        try {
            setLoading(true);
            const plansData = await planService.getPlans();
            setPlans(plansData);

            if (token) {
                const usageData = await planService.getUsage(token);
                setUsage(usageData);
            }
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePlan = async (planSlug: string) => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setChangingPlan(planSlug);
            const result = await planService.changePlan(token, planSlug);
            toast.success(result.message);
            await loadData();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao alterar plano');
        } finally {
            setChangingPlan(null);
        }
    };

    const colors = {
        bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-slate-50 to-white',
        cardBg: isDark ? 'bg-slate-900/50' : 'bg-white',
        cardBorder: isDark ? 'border-slate-800' : 'border-slate-200',
        text: isDark ? 'text-white' : 'text-slate-900',
        textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
        textSubtle: isDark ? 'text-slate-500' : 'text-slate-400',
    };

    const getPlanIcon = (slug: string) => {
        switch (slug) {
            case 'free': return <Zap className="text-blue-400" size={24} />;
            case 'premium': return <Sparkles className="text-purple-400" size={24} />;
            case 'enterprise': return <Crown className="text-amber-400" size={24} />;
            default: return <Zap className="text-blue-400" size={24} />;
        }
    };

    const getPlanGradient = (slug: string) => {
        switch (slug) {
            case 'free': return 'from-blue-500 to-cyan-500';
            case 'premium': return 'from-purple-500 to-pink-500';
            case 'enterprise': return 'from-amber-500 to-orange-500';
            default: return 'from-blue-500 to-cyan-500';
        }
    };

    const isCurrentPlan = (planSlug: string) => {
        return usage?.plan?.slug === planSlug;
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
            <header className={`sticky top-0 z-50 border-b ${colors.cardBorder} ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90'} backdrop-blur-xl`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} font-bold shadow-lg`}>
                            ▲
                        </div>
                        <span className={`text-lg font-semibold ${colors.text}`}>SlideMD</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user && (
                            <Link 
                                to="/dashboard" 
                                className={`px-4 py-2 text-sm rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} ${colors.text} transition`}
                            >
                                Dashboard
                            </Link>
                        )}
                        <ThemeToggle size="sm" />
                        {!user && (
                            <Link 
                                to="/login" 
                                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className={`text-4xl md:text-5xl font-bold ${colors.text} mb-4`}>
                        Escolha o plano ideal para você
                    </h1>
                    <p className={`text-lg ${colors.textMuted} max-w-2xl mx-auto`}>
                        Comece gratuitamente e faça upgrade quando precisar de mais recursos.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                billingCycle === 'monthly' 
                                    ? 'bg-blue-600 text-white' 
                                    : `${colors.textMuted} hover:${colors.text}`
                            }`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                billingCycle === 'yearly' 
                                    ? 'bg-blue-600 text-white' 
                                    : `${colors.textMuted} hover:${colors.text}`
                            }`}
                        >
                            Anual
                            <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Usage Alert */}
                {usage && (
                    <div className={`mb-8 p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg}`}>
                        <div className="flex items-center gap-3">
                            <AlertCircle size={20} className="text-blue-400" />
                            <div>
                                <p className={`font-medium ${colors.text}`}>
                                    Seu plano atual: <span className="text-blue-400">{usage.plan.name}</span>
                                </p>
                                <p className={`text-sm ${colors.textMuted}`}>
                                    Usando {usage.usage.presentations.used} de {usage.usage.presentations.unlimited ? '∞' : usage.usage.presentations.max} apresentações
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => {
                        const isCurrent = isCurrentPlan(plan.slug);
                        const priceNum = Number(plan.price) || 0;
                        const price = billingCycle === 'yearly' 
                            ? (priceNum * 12 * 0.8).toFixed(2) 
                            : priceNum.toFixed(2);
                        
                        return (
                            <div 
                                key={plan.id}
                                className={`relative rounded-2xl border-2 ${
                                    isCurrent 
                                        ? 'border-blue-500' 
                                        : plan.slug === 'premium' 
                                            ? 'border-purple-500/50' 
                                            : colors.cardBorder
                                } ${colors.cardBg} p-8 transition-all hover:scale-[1.02]`}
                            >
                                {/* Popular Badge */}
                                {plan.slug === 'premium' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                            MAIS POPULAR
                                        </span>
                                    </div>
                                )}

                                {/* Current Badge */}
                                {isCurrent && (
                                    <div className="absolute -top-3 right-4">
                                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                            ATUAL
                                        </span>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getPlanGradient(plan.slug)} bg-opacity-10`}>
                                        {getPlanIcon(plan.slug)}
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${colors.text}`}>{plan.name}</h3>
                                        <p className={`text-sm ${colors.textMuted}`}>{plan.description}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-4xl font-bold ${colors.text}`}>
                                            R$ {price}
                                        </span>
                                        <span className={colors.textMuted}>
                                            /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && !plan.is_free && (
                                        <p className="text-sm text-green-400 mt-1">
                                            Economia de R$ {(plan.price * 12 * 0.2).toFixed(2)}/ano
                                        </p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3">
                                        <Check size={18} className="text-green-400" />
                                        <span className={colors.textMuted}>
                                            {plan.max_presentations === null 
                                                ? 'Apresentações ilimitadas' 
                                                : `Até ${plan.max_presentations} apresentações`}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check size={18} className="text-green-400" />
                                        <span className={colors.textMuted}>
                                            {plan.max_slides === null 
                                                ? 'Slides ilimitados' 
                                                : `Até ${plan.max_slides} slides por apresentação`}
                                        </span>
                                    </li>
                                    {(Array.isArray(plan.features) 
                                        ? plan.features 
                                        : typeof plan.features === 'string' 
                                            ? JSON.parse(plan.features) 
                                            : []
                                    ).map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <Check size={18} className="text-green-400" />
                                            <span className={colors.textMuted}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <button
                                    onClick={() => handleChangePlan(plan.slug)}
                                    disabled={isCurrent || changingPlan === plan.slug}
                                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                                        isCurrent
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : plan.slug === 'premium'
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                                                : `${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} ${colors.text}`
                                    }`}
                                >
                                    {changingPlan === plan.slug ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : isCurrent ? (
                                        'Plano Atual'
                                    ) : (
                                        <>
                                            {plan.is_free ? 'Começar Grátis' : 'Fazer Upgrade'}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ */}
                <div className="mt-20">
                    <h2 className={`text-2xl font-bold ${colors.text} text-center mb-8`}>
                        Perguntas Frequentes
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                q: 'Posso cancelar a qualquer momento?',
                                a: 'Sim! Você pode cancelar ou mudar de plano a qualquer momento, sem multas.'
                            },
                            {
                                q: 'O que acontece com minhas apresentações se eu cancelar?',
                                a: 'Suas apresentações ficam salvas. Se exceder o limite do plano free, você só não poderá criar novas.'
                            },
                            {
                                q: 'Aceita quais formas de pagamento?',
                                a: 'Aceitamos cartões de crédito (Visa, Mastercard, Amex) e PIX.'
                            },
                            {
                                q: 'Tem desconto para estudantes?',
                                a: 'Sim! Estudantes têm 50% de desconto. Entre em contato conosco com seu email .edu.'
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className={`p-6 rounded-xl border ${colors.cardBorder} ${colors.cardBg}`}>
                                <h4 className={`font-semibold ${colors.text} mb-2`}>{faq.q}</h4>
                                <p className={colors.textMuted}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

