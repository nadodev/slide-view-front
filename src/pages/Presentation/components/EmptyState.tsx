/**
 * @fileoverview Estado vazio da apresentação
 * Tela bonita quando não há slides carregados
 */

import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Folder,
  Github,
  Wand2,
  Play,
  Clock,
  Layers
} from 'lucide-react';
import { useTheme } from '../../../stores/useThemeStore';
import { ThemeToggle } from '../../../components/ThemeToggle';

// ============================================
// TYPES
// ============================================

interface EmptyStateProps {
  onCreateNew?: () => void;
  onUpload?: () => void;
  onUseAI?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function EmptyState({ onCreateNew, onUpload, onUseAI }: EmptyStateProps) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-slate-50 to-white',
    cardBg: isDark ? 'bg-slate-900/50' : 'bg-white',
    cardBorder: isDark ? 'border-white/10' : 'border-slate-200',
    cardHover: isDark ? 'hover:bg-slate-800/50 hover:border-white/20' : 'hover:bg-slate-50 hover:border-slate-300',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    textSubtle: isDark ? 'text-slate-500' : 'text-slate-400',
    accent: isDark ? 'text-blue-400' : 'text-blue-600',
    iconBg: isDark ? 'bg-slate-800' : 'bg-slate-100',
  };

  const quickActions = [
    {
      icon: FileText,
      title: 'Criar do Zero',
      description: 'Editor markdown completo',
      action: () => navigate('/editor'),
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Upload,
      title: 'Importar Arquivos',
      description: 'Arraste .md ou selecione',
      action: () => navigate('/create'),
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Wand2,
      title: 'Gerar com IA',
      description: 'Gemini cria para você',
      action: () => navigate('/create'),
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const recentTemplates = [
    { name: 'Pitch Deck', slides: 12, icon: '🚀' },
    { name: 'Tech Talk', slides: 8, icon: '💻' },
    { name: 'Workshop', slides: 15, icon: '🎯' },
  ];

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${colors.cardBorder} ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} font-bold shadow-lg`}>
              ▲
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${colors.text}`}>SlideMD</h1>
              <p className={`text-xs ${colors.textSubtle}`}>Apresentações em Markdown</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-4 py-2 text-sm rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} ${colors.text} transition`}
            >
              Dashboard
            </button>
            <ThemeToggle size="sm" />
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 text-sm ${colors.textMuted} hover:${colors.text} transition`}
            >
              Início
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Decorative elements */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 ${isDark ? 'bg-blue-500/5' : 'bg-blue-400/10'} rounded-full blur-3xl -z-10`} />
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'} mb-6`}>
            <Sparkles size={16} className={colors.accent} />
            <span className={`text-sm ${colors.accent}`}>Pronto para criar</span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold ${colors.text} mb-4`}>
            Nenhuma apresentação
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              carregada ainda
            </span>
          </h2>
          
          <p className={`text-lg ${colors.textMuted} max-w-xl mx-auto`}>
            Comece criando uma nova apresentação, importando seus arquivos Markdown
            ou deixe a IA criar para você.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.action}
              className={`group relative p-8 rounded-2xl border ${colors.cardBorder} ${colors.cardBg} ${colors.cardHover} transition-all duration-300 text-left overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={24} />
              </div>
              
              {/* Content */}
              <h3 className={`relative text-xl font-semibold ${colors.text} mb-2 group-hover:text-${action.color}-500 transition-colors`}>
                {action.title}
              </h3>
              <p className={`relative ${colors.textMuted} mb-4`}>
                {action.description}
              </p>
              
              {/* Arrow */}
              <div className={`relative flex items-center gap-2 text-sm ${colors.accent} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2`}>
                <span>Começar</span>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Recent / Templates */}
          <div className={`p-6 rounded-2xl border ${colors.cardBorder} ${colors.cardBg}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                <Clock size={20} className={colors.accent} />
              </div>
              <div>
                <h3 className={`font-semibold ${colors.text}`}>Templates Populares</h3>
                <p className={`text-sm ${colors.textMuted}`}>Comece com um modelo</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {recentTemplates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => navigate('/create')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border ${colors.cardBorder} ${colors.cardHover} transition-all duration-200`}
                >
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${colors.text}`}>{template.name}</p>
                    <p className={`text-sm ${colors.textSubtle}`}>{template.slides} slides</p>
                  </div>
                  <ArrowRight size={16} className={colors.textSubtle} />
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className={`p-6 rounded-2xl border ${colors.cardBorder} ${colors.cardBg}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                <Layers size={20} className={colors.accent} />
              </div>
              <div>
                <h3 className={`font-semibold ${colors.text}`}>Recursos Incluídos</h3>
                <p className={`text-sm ${colors.textMuted}`}>Tudo que você precisa</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📝', label: 'Editor Markdown' },
                { icon: '🎨', label: 'Syntax Highlight' },
                { icon: '📊', label: 'Diagramas Mermaid' },
                { icon: '🎯', label: 'Modo Apresentador' },
                { icon: '📱', label: 'Controle Remoto' },
                { icon: '💾', label: 'Exportar PDF/MD' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className={`flex items-center gap-3 p-3 rounded-lg ${colors.iconBg}`}
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className={`text-sm ${colors.textMuted}`}>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} p-8 md:p-12`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Pronto para começar?
              </h3>
              <p className="text-white/80 max-w-md">
                Crie sua primeira apresentação em segundos com nosso editor intuitivo.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/editor')}
              className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
            >
              <Play size={20} />
              Criar Apresentação
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className={`mt-12 text-center ${colors.textSubtle}`}>
          <p className="text-sm">
            Dica: Use <kbd className={`px-2 py-1 rounded ${colors.iconBg} ${colors.textMuted} text-xs mx-1`}>?</kbd> para ver atalhos de teclado durante a apresentação
          </p>
        </div>
      </main>
    </div>
  );
}

export default EmptyState;

