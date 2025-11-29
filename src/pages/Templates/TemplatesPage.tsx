/**
 * @fileoverview Página de galeria de templates
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Rocket,
    GraduationCap,
    BarChart3,
    Briefcase,
    FileText,
    Sparkles,
    Lock,
    ArrowRight,
    Layers,
    Crown,
    LayoutDashboard,
    ArrowLeft,
} from 'lucide-react';
import { templateService, type Template, type TemplateCategory } from '../../services/templates/templateService';
import { useTheme } from '../../stores/useThemeStore';
import { Button } from '../../shared/components/ui/button';
import { toast } from 'sonner';

const categoryIcons: Record<string, React.ReactNode> = {
    pitch: <Rocket className="w-5 h-5" />,
    education: <GraduationCap className="w-5 h-5" />,
    report: <BarChart3 className="w-5 h-5" />,
    portfolio: <Briefcase className="w-5 h-5" />,
    proposal: <FileText className="w-5 h-5" />,
};

export default function TemplatesPage() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [categories, setCategories] = useState<TemplateCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [using, setUsing] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [templatesData, categoriesData] = await Promise.all([
                templateService.list(),
                templateService.getCategories(),
            ]);
            setTemplates(templatesData.templates);
            setCategories(categoriesData.categories);
        } catch (error) {
            toast.error('Erro ao carregar templates');
        } finally {
            setLoading(false);
        }
    };

    const handleUseTemplate = async (template: Template) => {
        if (template.locked) {
            toast.error('Este template é exclusivo para usuários Premium');
            return;
        }

        try {
            setUsing(template.id);
            const result = await templateService.useTemplate(template.id);
            toast.success('Apresentação criada!');
            navigate(`/editor?id=${result.presentation.id}`);
        } catch (error: any) {
            toast.error(error.message || 'Erro ao usar template');
        } finally {
            setUsing(null);
        }
    };

    const filteredTemplates = selectedCategory
        ? templates.filter(t => t.category === selectedCategory)
        : templates;

    const colors = {
        bg: isDark ? 'bg-slate-900' : 'bg-slate-50',
        cardBg: isDark ? 'bg-slate-800' : 'bg-white',
        border: isDark ? 'border-slate-700' : 'border-slate-200',
        text: isDark ? 'text-white' : 'text-slate-900',
        textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    };

    return (
        <div className={`min-h-screen ${colors.bg}`}>
            {/* Header */}
            <header className={`border-b ${colors.border} ${colors.cardBg} sticky top-0 z-10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className={`flex items-center gap-2 ${colors.textMuted} hover:${colors.text} transition-colors`}
                            >
                                <ArrowLeft size={20} />
                                <span className="hidden sm:inline">Voltar</span>
                            </Link>
                            <div className={`h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-purple-500" size={24} />
                                <h1 className={`text-xl font-bold ${colors.text}`}>Templates</h1>
                            </div>
                        </div>
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}
                        >
                            <LayoutDashboard size={18} />
                            <span className={`${colors.text} text-sm font-medium`}>Dashboard</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Hero */}
                <div className="text-center mb-12">
                    <h2 className={`text-3xl sm:text-4xl font-bold ${colors.text} mb-4`}>
                        Comece com um Template Profissional
                    </h2>
                    <p className={`text-lg ${colors.textMuted} max-w-2xl mx-auto`}>
                        Escolha entre nossos templates prontos para criar apresentações incríveis em segundos
                    </p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedCategory === null
                                ? 'bg-blue-600 text-white'
                                : `${colors.cardBg} ${colors.text} border ${colors.border} hover:border-blue-500`
                        }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.slug}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedCategory === cat.slug
                                    ? 'bg-blue-600 text-white'
                                    : `${colors.cardBg} ${colors.text} border ${colors.border} hover:border-blue-500`
                            }`}
                        >
                            {categoryIcons[cat.slug]}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map(template => (
                            <div
                                key={template.id}
                                className={`group relative rounded-2xl border ${colors.border} ${colors.cardBg} overflow-hidden transition-all hover:shadow-xl hover:border-blue-500/50`}
                            >
                                {/* Premium Badge */}
                                {template.is_premium && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                            <Crown size={12} />
                                            Premium
                                        </div>
                                    </div>
                                )}

                                {/* Locked Overlay */}
                                {template.locked && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-center">
                                            <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                                            <p className="text-white font-medium">Exclusivo Premium</p>
                                            <Link
                                                to="/pricing"
                                                className="text-blue-400 text-sm hover:underline"
                                            >
                                                Fazer upgrade
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Thumbnail */}
                                <div className={`aspect-video ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center`}>
                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                                        {categoryIcons[template.category] || <Layers className="w-8 h-8" />}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className={`font-semibold ${colors.text}`}>
                                            {template.name}
                                        </h3>
                                        <span className={`text-xs ${colors.textMuted}`}>
                                            {template.slide_count} slides
                                        </span>
                                    </div>
                                    <p className={`text-sm ${colors.textMuted} mb-4 line-clamp-2`}>
                                        {template.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs ${colors.textMuted}`}>
                                            {template.usage_count} usos
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => handleUseTemplate(template)}
                                            disabled={using === template.id || template.locked}
                                            className="gap-1"
                                        >
                                            {using === template.id ? (
                                                'Criando...'
                                            ) : (
                                                <>
                                                    Usar
                                                    <ArrowRight size={14} />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <Layers className={`w-16 h-16 mx-auto mb-4 ${colors.textMuted}`} />
                        <h3 className={`text-lg font-medium ${colors.text} mb-2`}>
                            Nenhum template encontrado
                        </h3>
                        <p className={colors.textMuted}>
                            Tente selecionar outra categoria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

