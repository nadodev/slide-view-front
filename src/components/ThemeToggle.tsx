/**
 * @fileoverview Componente de toggle de tema
 * Alterna entre light, dark e system
 */

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../stores/useThemeStore';

// ============================================
// TYPES
// ============================================

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================
// COMPONENT
// ============================================

export function ThemeToggle({ className = '', showLabel = false, size = 'md' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor size={iconSizes[size]} />;
    }
    return resolvedTheme === 'dark' 
      ? <Moon size={iconSizes[size]} /> 
      : <Sun size={iconSizes[size]} />;
  };

  const getLabel = () => {
    switch (theme) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'system': return 'Sistema';
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        ${sizes[size]}
        inline-flex items-center justify-center gap-2
        rounded-lg
        bg-secondary text-secondary-foreground
        hover:bg-secondary/80
        border border-border
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${className}
      `}
      title={`Tema: ${getLabel()}`}
      aria-label={`Mudar tema. Atual: ${getLabel()}`}
    >
      <span className="transition-transform duration-200 hover:scale-110">
        {getIcon()}
      </span>
      {showLabel && (
        <span className="text-sm font-medium">{getLabel()}</span>
      )}
    </button>
  );
}

// ============================================
// THEME SELECTOR (dropdown version)
// ============================================

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Claro', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Escuro', icon: <Moon size={16} /> },
    { value: 'system', label: 'Sistema', icon: <Monitor size={16} /> },
  ];

  return (
    <div className={`flex gap-1 p-1 bg-muted rounded-lg ${className}`}>
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
            transition-all duration-200
            ${theme === value 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }
          `}
          title={label}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;

