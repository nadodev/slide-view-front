/**
 * @fileoverview Navbar da página de apresentação
 * Mostra informações do usuário, título e controles
 */

import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard,
  Edit3,
  Maximize2
} from 'lucide-react';
import { useState } from 'react';
import { useAuth, useAuthStore } from '../../../stores/useAuthStore';
import { useTheme } from '../../../stores/useThemeStore';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { authService } from '../../../services/auth';

interface PresentationNavbarProps {
  title?: string;
  presentationId?: string | null;
  slideCount?: number;
  currentSlide?: number;
  onFullscreen?: () => void;
  onEdit?: () => void;
  compact?: boolean;
}

export function PresentationNavbar({
  title = 'Apresentação',
  presentationId,
  slideCount = 0,
  currentSlide = 0,
  onFullscreen,
  onEdit,
  compact = false,
}: PresentationNavbarProps) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, token } = useAuth();
  const logout = useAuthStore((state) => state.logout);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  const colors = {
    bg: isDark 
      ? 'bg-slate-900/95 border-slate-800' 
      : 'bg-white/95 border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    textSubtle: isDark ? 'text-slate-500' : 'text-slate-400',
    hover: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
    menuBg: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
    buttonBg: isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200',
  };

  if (compact) {
    return (
      <div className={`fixed top-0 left-0 right-0 z-50 ${colors.bg} border-b backdrop-blur-xl`}>
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className={`p-2 rounded-lg ${colors.hover} transition-colors`}>
              <ArrowLeft size={18} className={colors.textMuted} />
            </Link>
            <span className={`font-medium ${colors.text} truncate max-w-[200px]`}>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            {onFullscreen && (
              <button onClick={onFullscreen} className={`p-2 rounded-lg ${colors.buttonBg} transition-colors`}>
                <Maximize2 size={16} className={colors.textMuted} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 h-[60px] ${colors.bg} border-b backdrop-blur-xl`}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section - Logo + Back */}
        <div className="flex items-center gap-3">
          {/* Back to Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${colors.hover} transition-colors`}
          >
            <ArrowLeft size={16} className={colors.textMuted} />
            <span className={`text-xs ${colors.textMuted} hidden sm:inline`}>Dashboard</span>
          </Link>

          {/* Divider */}
          <div className={`h-5 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

          {/* Logo SlideMD */}
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} font-bold text-xs shadow`}>
              ▲
            </div>
            <span className={`text-lg font-bold ${colors.text}`}>
              SlideMD
            </span>
            <span className={`text-xs ${colors.textSubtle}`}>•</span>
            <span className={`text-sm ${colors.text} truncate max-w-[200px] font-medium`}>
              {title}
            </span>
          </div>
        </div>

        {/* Center Section - Slide Counter */}
        <div className="hidden md:flex items-center">
          <div className={`px-3 py-1.5 rounded-full ${colors.buttonBg} text-xs font-medium ${colors.text}`}>
            {currentSlide + 1} / {slideCount}
          </div>
        </div>

        {/* Right Section - Actions + User */}
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />

          {presentationId && onEdit && (
            <button
              onClick={onEdit}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${colors.buttonBg} transition-colors text-xs`}
            >
              <Edit3 size={14} className={colors.textMuted} />
              <span className={`${colors.textMuted} hidden sm:inline`}>Editar</span>
            </button>
          )}

          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className={`p-1.5 rounded-lg ${colors.buttonBg} transition-colors`}
              title="Tela cheia (F)"
            >
              <Maximize2 size={16} className={colors.textMuted} />
            </button>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${colors.hover} transition-colors`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={14} className={colors.textMuted} />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className={`absolute right-0 mt-2 w-48 rounded-xl border ${colors.menuBg} shadow-xl z-20`}>
                  <div className={`p-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-xs font-medium ${colors.text} truncate`}>{user?.name}</p>
                    <p className={`text-[10px] ${colors.textMuted} truncate`}>{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg ${colors.hover} transition-colors text-xs ${colors.text}`}
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-xs text-red-500"
                    >
                      <LogOut size={14} />
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
  );
}

export default PresentationNavbar;
