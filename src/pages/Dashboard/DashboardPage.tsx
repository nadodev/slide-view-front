/**
 * @fileoverview Página de Dashboard com listagem de apresentações
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit3, 
  Clock,
  Presentation,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../stores/useThemeStore';
import { useAuth, useAuthStore } from '../../stores/useAuthStore';
import { usePresentationsStore } from '../../stores/usePresentationsStore';
import { authService } from '../../services/auth';
import { ThemeToggle } from '../../components/ThemeToggle';
import type { Presentation as PresentationType } from '../../services/presentation';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, token } = useAuth();
  const logout = useAuthStore((state) => state.logout);
  const { 
    presentations, 
    isLoading, 
    error, 
    fetchPresentations, 
    deletePresentation,
    duplicatePresentation 
  } = usePresentationsStore();
  
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchPresentations();
  }, [fetchPresentations]);

  const handleLogout = async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch {
      // Ignora erros de logout
    } finally {
      logout();
      navigate('/login');
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deletePresentation(id);
    if (success) {
      setDeleteConfirm(null);
      setMenuOpen(null);
    }
  };

  const handleDuplicate = async (id: number) => {
    await duplicatePresentation(id);
    setMenuOpen(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca editado';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const colors = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-slate-50',
    cardBg: isDark ? 'bg-slate-900/50' : 'bg-white',
    cardBorder: isDark ? 'border-slate-800' : 'border-slate-200',
    cardHover: isDark ? 'hover:border-slate-700 hover:bg-slate-800/50' : 'hover:border-slate-300 hover:bg-slate-50',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    textSubtle: isDark ? 'text-slate-500' : 'text-slate-400',
    menuBg: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${colors.cardBg} border-b ${colors.cardBorder} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} font-bold shadow-lg`}>
                ▲
              </div>
              <span className={`text-xl font-semibold ${colors.text}`}>SlideMD</span>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle size="sm" />
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
                >
                  <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'} flex items-center justify-center`}>
                    <User size={16} className={colors.textMuted} />
                  </div>
                  <span className={`text-sm font-medium ${colors.text} hidden sm:inline`}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={16} className={colors.textMuted} />
                </button>

                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className={`absolute right-0 mt-2 w-56 rounded-xl border ${colors.menuBg} shadow-xl z-20`}>
                      <div className="p-3 border-b border-slate-700/50">
                        <p className={`text-sm font-medium ${colors.text}`}>{user?.name}</p>
                        <p className={`text-xs ${colors.textMuted}`}>{user?.email}</p>
                        <div className={`mt-2 px-2 py-1 rounded-md text-xs font-medium inline-block ${
                          user?.plan?.slug === 'free' 
                            ? 'bg-slate-700 text-slate-300' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        }`}>
                          Plano {user?.plan?.name || 'Free'}
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm`}
                        >
                          <LogOut size={16} />
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${colors.text}`}>Minhas Apresentações</h1>
            <p className={colors.textMuted}>
              {presentations.length} {presentations.length === 1 ? 'apresentação' : 'apresentações'}
            </p>
          </div>
          
          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus size={20} />
            <span>Nova Apresentação</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && presentations.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className={colors.textMuted}>Carregando apresentações...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && presentations.length === 0 && (
          <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${colors.cardBorder}`}>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center`}>
              <Presentation size={40} className={colors.textSubtle} />
            </div>
            <h2 className={`text-xl font-semibold ${colors.text} mb-2`}>
              Nenhuma apresentação ainda
            </h2>
            <p className={`${colors.textMuted} mb-6 max-w-md mx-auto`}>
              Crie sua primeira apresentação e ela aparecerá aqui. Você pode criar slides usando Markdown!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus size={20} />
              Criar primeira apresentação
            </Link>
          </div>
        )}

        {/* Presentations Grid */}
        {presentations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <PresentationCard
                key={presentation.id}
                presentation={presentation}
                colors={colors}
                isDark={isDark}
                menuOpen={menuOpen === presentation.id}
                onMenuToggle={() => setMenuOpen(menuOpen === presentation.id ? null : presentation.id)}
                onEdit={() => navigate(`/editor?id=${presentation.id}`)}
                onPresent={() => navigate(`/app?id=${presentation.id}`, { 
                  state: { presentationTitle: presentation.title } 
                })}
                onDuplicate={() => handleDuplicate(presentation.id)}
                onDelete={() => setDeleteConfirm(presentation.id)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`${colors.cardBg} rounded-2xl border ${colors.cardBorder} p-6 max-w-md w-full shadow-2xl`}>
            <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
              Confirmar exclusão
            </h3>
            <p className={colors.textMuted}>
              Tem certeza que deseja excluir esta apresentação? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`flex-1 px-4 py-2.5 rounded-xl border ${colors.cardBorder} ${colors.text} hover:bg-slate-800/50 transition-colors`}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Presentation Card Component
interface PresentationCardProps {
  presentation: PresentationType;
  colors: Record<string, string>;
  isDark: boolean;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onPresent: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  formatDate: (date?: string) => string;
}

function PresentationCard({
  presentation,
  colors,
  isDark,
  menuOpen,
  onMenuToggle,
  onEdit,
  onPresent,
  onDuplicate,
  onDelete,
  formatDate,
}: PresentationCardProps) {
  return (
    <div className={`group relative rounded-xl border ${colors.cardBorder} ${colors.cardBg} ${colors.cardHover} transition-all duration-200`}>
      {/* Thumbnail/Preview */}
      <div 
        onClick={onPresent}
        className={`aspect-video rounded-t-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center cursor-pointer overflow-hidden`}
      >
        {presentation.thumbnail ? (
          <img 
            src={presentation.thumbnail} 
            alt={presentation.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText size={48} className={colors.textSubtle} />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 
              onClick={onPresent}
              className={`font-semibold ${colors.text} truncate cursor-pointer hover:text-blue-500 transition-colors`}
            >
              {presentation.title}
            </h3>
            <div className={`flex items-center gap-2 mt-1 text-sm ${colors.textMuted}`}>
              <Clock size={14} />
              <span>{formatDate(presentation.last_edited_at || presentation.updated_at)}</span>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={onMenuToggle}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} transition-colors`}
            >
              <MoreVertical size={18} className={colors.textMuted} />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={onMenuToggle}
                />
                <div className={`absolute right-0 mt-1 w-44 rounded-xl border ${colors.menuBg} shadow-xl z-20`}>
                  <div className="p-1">
                    <button
                      onClick={onEdit}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors text-sm ${colors.text}`}
                    >
                      <Edit3 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={onPresent}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors text-sm ${colors.text}`}
                    >
                      <Presentation size={16} />
                      Apresentar
                    </button>
                    <button
                      onClick={onDuplicate}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors text-sm ${colors.text}`}
                    >
                      <Copy size={16} />
                      Duplicar
                    </button>
                    <hr className={`my-1 ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />
                    <button
                      onClick={onDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-500"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={`flex items-center gap-4 mt-3 pt-3 border-t ${colors.cardBorder}`}>
          <div className={`flex items-center gap-1.5 text-sm ${colors.textMuted}`}>
            <FileText size={14} />
            <span>{presentation.slide_count || presentation.slides_count || 0} slides</span>
          </div>
          <div className={`px-2 py-0.5 rounded-md text-xs font-medium ${
            presentation.status === 'published' 
              ? 'bg-green-500/20 text-green-500' 
              : presentation.status === 'archived'
              ? 'bg-slate-500/20 text-slate-400'
              : 'bg-blue-500/20 text-blue-500'
          }`}>
            {presentation.status === 'published' ? 'Publicado' : 
             presentation.status === 'archived' ? 'Arquivado' : 'Rascunho'}
          </div>
        </div>
      </div>
    </div>
  );
}

