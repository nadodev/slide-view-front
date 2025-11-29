import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Download,
  MonitorIcon,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../stores/useThemeStore";

const features = [
  {
    title: "Markdown puro",
    description:
      "Arraste seus .md, mantenha o versionamento do repo e veja o slide nascer em tempo real.",
    icon: Upload,
  },
  {
    title: "Modo apresentador",
    description:
      "Notas privadas, timer e preview do próximo slide em um painel que lembra o backstage da Vercel.",
    icon: MonitorIcon,
  },
  {
    title: "Destaque de código",
    description:
      "Syntax highlight com contraste perfeito para demos técnicas.",
    icon: Sparkles,
  },
  {
    title: "Exportação segura",
    description: "Compartilhe decks em HTML estático ou Markdown consolidado.",
    icon: Download,
  },
  {
    title: "Playlists de slides",
    description: "Agrupe apresentações para squads e mantenha consistência.",
    icon: ShieldCheck,
  },
  {
    title: "Atalhos shadcn/ui",
    description:
      "Interações suaves e padrões familiares para quem ama o ecossistema shadcn.",
    icon: ArrowRight,
  },
];

const workflow = [
  {
    tag: "1. Importar",
    title: "Selecione seus arquivos Markdown",
    copy: "Upload direto do repositório ou do desktop. Detectamos metadados e transformamos headings em slides.",
  },
  {
    tag: "2. Orquestrar",
    title: "Reordene, duplique, combine",
    copy: "Drag and drop fluido, estados salvos automaticamente e histórico para experimentar sem medo.",
  },
  {
    tag: "3. Apresentar",
    title: "Modo palco + apresentador",
    copy: "Compartilhe a visão pública enquanto controla notas, timer e próximo slide em uma aba privada.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Theme-aware colors
  const colors = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-white',
    bgSecondary: isDark ? 'bg-[#0f0f0f]' : 'bg-slate-50',
    bgTertiary: isDark ? 'bg-[#050505]' : 'bg-slate-100',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-white/60' : 'text-slate-600',
    textSubtle: isDark ? 'text-white/40' : 'text-slate-400',
    border: isDark ? 'border-white/10' : 'border-slate-200',
    borderHover: isDark ? 'hover:border-white/30' : 'hover:border-slate-300',
    cardBg: isDark ? 'bg-[#0a0a0a]/95' : 'bg-white',
    headerBg: isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90',
    buttonPrimary: isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-slate-900 text-white hover:bg-slate-800',
    buttonSecondary: isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100',
    glowColor: isDark ? 'bg-blue-600/10' : 'bg-blue-400/20',
    gridLine: isDark ? 'bg-gradient-to-b from-white/[0.15] via-white/[0.08] to-white/0' : 'bg-gradient-to-b from-slate-300/50 via-slate-200/30 to-transparent',
    accentLine: isDark ? 'bg-gradient-to-r from-blue-500/40 to-transparent' : 'bg-gradient-to-r from-blue-500/60 to-transparent',
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${colors.bg} ${colors.text} transition-colors duration-300`}>
      {/* Background Grid - Theme aware */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-transparent via-[#0a0a0a]/40 to-[#0a0a0a]' : 'from-transparent via-white/40 to-white'} via-25% to-20% z-10`} />
        
        {/* Vertical grid lines */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className={`absolute inset-y-0 w-px ${colors.gridLine}`}
              style={{ left: `${i * 15}%` }}
            />
          ))}
        </div>
        
        {/* Horizontal grid lines */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className={`absolute inset-x-0 h-px ${isDark ? 'bg-gradient-to-r from-white/0 via-white/[0.05] to-white/0' : 'bg-gradient-to-r from-slate-200/0 via-slate-200/50 to-slate-200/0'}`}
              style={{ 
                top: `${i * 5.66}%`,
                opacity: Math.max(0, 1 - (i / 15) * 1.8)
              }}
            />
          ))}
        </div>
        
        {/* Center line */}
        <div className={`absolute inset-y-0 left-1/2 w-px ${isDark ? 'bg-gradient-to-b from-white/30 via-white/15 to-white/0' : 'bg-gradient-to-b from-slate-300/60 via-slate-200/30 to-transparent'} via-20% to-45%`} />
        
        {/* Glowing orbs */}
        <div className={`absolute -left-32 top-0 h-96 w-96 rounded-full ${colors.glowColor} blur-[120px] animate-pulse`} 
             style={{ animationDuration: '4s' }} />
        <div className={`absolute -right-32 top-20 h-80 w-80 rounded-full ${isDark ? 'bg-purple-600/8' : 'bg-purple-400/15'} blur-[100px] animate-pulse`} 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className={`absolute left-1/3 top-40 h-64 w-64 rounded-full ${isDark ? 'bg-cyan-600/6' : 'bg-cyan-400/10'} blur-[80px] animate-pulse`} 
             style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${colors.border} ${colors.headerBg} backdrop-blur-xl transition-colors duration-300`}>
        <div className={`absolute top-0 inset-x-0 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-blue-500/40 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent'}`} />
        <div className={`absolute bottom-0 inset-x-0 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`} />
        
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 relative">
          {/* Logo */}
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} border ${colors.border} shadow-lg`}>
              ▲
            </div>
            <span className={`${isDark ? 'bg-gradient-to-r from-white to-white/70' : 'bg-gradient-to-r from-slate-900 to-slate-600'} bg-clip-text text-transparent`}>
              SlideMD
            </span>
          </div>
          
          {/* Navigation */}
          <nav className={`hidden items-center gap-8 text-sm ${colors.textMuted} md:flex`}>
            <a className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'} relative group`} href="#features">
              Recursos
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all group-hover:w-full" />
            </a>
            <a className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'} relative group`} href="#workflow">
              Fluxo
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all group-hover:w-full" />
            </a>
            <a className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'} relative group`} href="#roadmap">
              Roadmap
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all group-hover:w-full" />
            </a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />
            <button
              className={`rounded-lg border ${colors.buttonSecondary} px-4 py-2 text-sm transition`}
              onClick={() => navigate("/app")}
            >
              Ver o app
            </button>
            <button
              className={`inline-flex items-center gap-2 rounded-lg ${colors.buttonPrimary} px-5 py-2 text-sm font-medium transition shadow-lg`}
              onClick={() => navigate("/app")}
            >
              Abrir agora
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-32 relative">
          <div className={`absolute top-0 left-0 right-0 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`} />
          
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-8 relative">
              <div className={`absolute -top-20 -left-20 w-64 h-64 ${isDark ? 'bg-blue-500/5' : 'bg-blue-400/10'} rounded-full blur-3xl`} />
              
              <div className={`inline-flex items-center gap-2 rounded-full border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-slate-100'} px-4 py-1.5 text-sm ${colors.textMuted} backdrop-blur-sm ${colors.borderHover} transition-all`}>
                <Sparkles size={16} className="text-blue-400 animate-pulse" style={{ animationDuration: '3s' }} />
                Markdown para quem apresenta como pro
              </div>
              
              <div className="space-y-6">
                <h1 className={`text-5xl font-bold leading-tight ${colors.text} lg:text-6xl`}>
                  Crie apresentações{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    incríveis
                  </span>{" "}
                  com Markdown
                </h1>
                <p className={`text-xl ${colors.textMuted} leading-relaxed`}>
                  Construa, ajuste e apresente slides a partir de arquivos Markdown.
                  Visual limpo, micro animações e foco em storytelling com código.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className={`inline-flex items-center gap-2 rounded-lg ${colors.buttonPrimary} px-6 py-3 text-base font-semibold transition hover:scale-105 shadow-lg`}
                  onClick={() => navigate("/create")}
                >
                  Começar agora
                  <ArrowRight size={18} />
                </button>
                <button
                  className={`inline-flex items-center gap-2 rounded-lg border ${colors.buttonSecondary} px-6 py-3 text-base font-medium transition`}
                  onClick={() => navigate("/app")}
                >
                  Ver demo
                </button>
              </div>
              
              {/* Stats */}
              <div className={`grid grid-cols-3 gap-px ${isDark ? 'bg-white/10' : 'bg-slate-200'} rounded-xl overflow-hidden mt-12`}>
                {[
                  { label: 'Slides gerados', value: '+3k', color: 'blue' },
                  { label: 'Tempo médio', value: '2 min', color: 'purple' },
                  { label: 'Setup', value: '0 stress', color: 'green' },
                ].map((stat) => (
                  <div key={stat.label} className={`${colors.bg} p-6 relative group ${isDark ? 'hover:bg-[#0f0f0f]' : 'hover:bg-slate-50'} transition`}>
                    <div className={`absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-${stat.color}-500/50 to-transparent`} />
                    <p className={`text-3xl font-bold ${colors.text}`}>{stat.value}</p>
                    <p className={`text-xs uppercase tracking-wider ${colors.textSubtle} mt-1`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative">
              <div className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-[#0a0a0a]/80' : 'bg-white/80'} p-6 backdrop-blur-sm relative overflow-hidden ${colors.borderHover} transition-all group`}>
                <div className={`absolute top-0 left-0 w-32 h-px ${isDark ? 'bg-gradient-to-r from-blue-500/50 to-transparent' : 'bg-gradient-to-r from-blue-400/60 to-transparent'}`} />
                <div className={`absolute bottom-0 right-0 w-32 h-px ${isDark ? 'bg-gradient-to-l from-purple-500/50 to-transparent' : 'bg-gradient-to-l from-purple-400/60 to-transparent'}`} />
                
                <div className={`rounded-xl border ${colors.border} ${colors.bgTertiary} p-4 relative`}>
                  <div className={`flex items-center gap-2 pb-4 border-b ${colors.border}`}>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" style={{ animationDuration: '2s' }} />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
                  </div>
                  
                  <div className={`space-y-3 mt-4 rounded-lg border ${colors.border} ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'} p-4 font-mono text-sm ${colors.textMuted}`}>
                    <p className="text-blue-400"># Roadmap SlideMD</p>
                    <p>- ✅ Conversor Markdown → Deck</p>
                    <p>- ✅ Presenter view</p>
                    <p>- ✅ Tema Light/Dark</p>
                    <p>- ✨ Transições suaves</p>
                  </div>
                </div>
                
                <div className={`mt-6 grid gap-px ${isDark ? 'bg-white/10' : 'bg-slate-200'} rounded-lg overflow-hidden`}>
                  <div className={`${colors.bgTertiary} p-4 ${isDark ? 'hover:bg-[#0a0a0a]' : 'hover:bg-white'} transition`}>
                    <p className={`text-xs uppercase tracking-wider ${colors.textSubtle}`}>Slide atual</p>
                    <p className={`mt-2 text-sm ${isDark ? 'text-white/90' : 'text-slate-800'}`}>Design tokens: aplicando na prática.</p>
                  </div>
                  <div className={`${colors.bgTertiary} p-4 ${isDark ? 'hover:bg-[#0a0a0a]' : 'hover:bg-white'} transition`}>
                    <p className={`text-xs uppercase tracking-wider ${colors.textSubtle}`}>Próximo</p>
                    <p className={`mt-2 text-sm ${colors.textMuted}`}>Fluxo de revisão em squad.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24 relative">
          <div className={`absolute top-0 inset-x-0 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`} />
          
          <div className="space-y-6 mb-16">
            <p className={`text-xs uppercase tracking-widest ${colors.textSubtle}`}>Recursos principais</p>
            <h2 className={`text-4xl font-bold leading-tight ${colors.text}`}>
              Um toolkit completo para apresentações.
            </h2>
            <p className={`text-lg ${colors.textMuted} max-w-2xl`}>
              Cartões com bordas suaves, brilhos sutis e icons minimalistas —
              tudo com utilitários Tailwind e componentes modernos.
            </p>
          </div>
          
          <div className={`grid gap-px ${isDark ? 'bg-white/10' : 'bg-slate-200'} md:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden`}>
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className={`group relative ${colors.cardBg} p-8 transition ${isDark ? 'hover:bg-[#0f0f0f]' : 'hover:bg-slate-50'}`}
              >
                <div className={`absolute top-0 left-0 w-16 h-px ${isDark ? 'bg-gradient-to-r from-blue-500/50 to-transparent' : 'bg-gradient-to-r from-blue-400/60 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border ${colors.border} ${isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-700'} group-hover:border-blue-500/50 transition-all`}>
                  <Icon size={20} />
                </div>
                
                <h3 className={`text-xl font-semibold mb-3 ${colors.text}`}>{title}</h3>
                <p className={`text-sm ${colors.textMuted} leading-relaxed`}>{description}</p>
                
                <div className={`mt-6 flex items-center text-sm ${colors.textSubtle} ${isDark ? 'group-hover:text-white/80' : 'group-hover:text-slate-700'} transition`}>
                  Saiba mais
                  <ArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" size={16} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="mx-auto max-w-7xl px-6 py-24 relative">
          <div className={`absolute top-0 inset-x-0 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`} />
          
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className={`text-xs uppercase tracking-widest ${colors.textSubtle}`}>Fluxo de trabalho</p>
                <h2 className={`text-4xl font-bold ${colors.text}`}>Do Markdown ao palco em três pulsos.</h2>
                <p className={`text-lg ${colors.textMuted}`}>
                  Estrutura modular inspirada em design systems: cada etapa é clara, visual e sempre responsiva.
                </p>
              </div>
              
              <div className={`space-y-px ${isDark ? 'bg-white/10' : 'bg-slate-200'} rounded-xl overflow-hidden`}>
                {workflow.map((step) => (
                  <div
                    key={step.tag}
                    className={`${colors.cardBg} p-6 relative group ${isDark ? 'hover:bg-[#0f0f0f]' : 'hover:bg-slate-50'} transition`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition`} />
                    <span className={`text-xs uppercase tracking-widest ${colors.textSubtle}`}>{step.tag}</span>
                    <h3 className={`mt-2 text-xl font-semibold ${colors.text}`}>{step.title}</h3>
                    <p className={`mt-2 ${colors.textMuted}`}>{step.copy}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-[#0a0a0a]/80' : 'bg-white/80'} p-6 backdrop-blur-sm relative ${colors.borderHover} transition group`}>
              <div className={`absolute top-0 right-0 w-24 h-px ${isDark ? 'bg-gradient-to-l from-purple-500/50 to-transparent' : 'bg-gradient-to-l from-purple-400/60 to-transparent'}`} />
              
              <div className={`flex items-center justify-between border-b ${colors.border} pb-4 text-sm ${colors.textMuted}`}>
                <span>Preview tempo real</span>
                <ArrowRight size={16} />
              </div>
              
              <div className="space-y-6 pt-6">
                <div>
                  <p className={`text-xs uppercase tracking-widest ${colors.textSubtle}`}>Deck</p>
                  <p className={`mt-2 text-xl font-semibold ${colors.text}`}>Design System Review</p>
                </div>
                
                <div>
                  <p className={`text-xs uppercase tracking-widest ${colors.textSubtle}`}>Último build</p>
                  <p className={`mt-2 text-lg ${colors.textMuted}`}>há 12 segundos</p>
                </div>
                
                <div>
                  <p className={`text-xs uppercase tracking-widest ${colors.textSubtle}`}>Branch</p>
                  <p className={`mt-2 text-lg font-mono ${colors.textMuted}`}>feat/slide-view</p>
                </div>
                
                <div className={`rounded-lg border ${colors.border} ${colors.bgTertiary} p-4 font-mono text-xs ${colors.textMuted} space-y-1`}>
                  <p className={isDark ? 'text-white/80' : 'text-slate-700'}>npm run deck:preview</p>
                  <p className="text-emerald-400">✔ pronto em 2.1s</p>
                  <p className="text-blue-400">Preview → app.slidemd.dev/preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="mx-auto max-w-5xl px-6 py-32 text-center relative">
          <div className={`absolute top-0 inset-x-0 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-200 to-transparent'}`} />
          
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${isDark ? 'bg-blue-500/5' : 'bg-blue-400/10'} rounded-full blur-3xl`} />
          
          <div className="space-y-8 relative">
            <p className={`text-xs uppercase tracking-widest ${colors.textSubtle}`}>Hora de apresentar</p>
            <h2 className={`text-5xl font-bold leading-tight ${colors.text}`}>
              Pronto para pilotar sua próxima demo?
            </h2>
            <p className={`text-xl ${colors.textMuted} max-w-2xl mx-auto`}>
              Interface moderna, utilitários Tailwind e componentes para entregar a melhor experiência.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                className={`inline-flex items-center gap-2 rounded-lg ${colors.buttonPrimary} px-8 py-4 text-base font-semibold hover:scale-105 shadow-lg transition-all`}
                onClick={() => navigate("/create")}
              >
                Abrir o app
                <ArrowRight size={18} />
              </button>
              <button
                className={`rounded-lg border ${colors.buttonSecondary} px-8 py-4 text-base transition`}
                onClick={() => navigate("/app")}
              >
                Explorar recursos
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t ${colors.border} ${colors.bg} relative transition-colors duration-300`}>
        <div className={`absolute top-0 inset-x-0 h-px ${isDark ? 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-400/30 to-transparent'}`} />
        
        <div className="mx-auto max-w-7xl px-6 py-8 relative">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 text-sm ${colors.textSubtle}`}>
            <div className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-600'} text-xs`}>
                ▲
              </div>
              <span>© {new Date().getFullYear()} SlideMD</span>
            </div>
            <span>Feito com React, Tailwind e ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
