/**
 * @fileoverview Componente de alerta para quando o usuário atinge limites do plano
 */

import { Link } from 'react-router-dom';
import { AlertTriangle, Crown, X } from 'lucide-react';
import { useTheme } from '../stores/useThemeStore';

interface LimitAlertProps {
  type: 'presentations' | 'slides';
  used: number;
  max: number;
  onClose?: () => void;
}

export function LimitAlert({ type, used, max, onClose }: LimitAlertProps) {
  const { isDark } = useTheme();
  
  const isAtLimit = used >= max;
  if (!isAtLimit) return null;

  const colors = {
    bg: isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200',
    text: isDark ? 'text-amber-400' : 'text-amber-800',
    textMuted: isDark ? 'text-amber-300' : 'text-amber-700',
    button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
  };

  const messages = {
    presentations: {
      title: 'Limite de apresentações atingido!',
      description: `Você já criou ${used} de ${max} apresentações permitidas no plano Free.`,
      action: 'Faça upgrade para criar apresentações ilimitadas.',
    },
    slides: {
      title: 'Limite de slides atingido!',
      description: `Esta apresentação já tem ${used} de ${max} slides permitidos no plano Free.`,
      action: 'Faça upgrade para criar apresentações com mais slides.',
    },
  };

  const message = messages[type];

  return (
    <div className={`relative rounded-xl border-2 ${colors.bg} p-4 mb-6 animate-in slide-in-from-top-2`}>
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1 rounded-lg ${isDark ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100'} transition-colors`}
        >
          <X size={16} className={colors.text} />
        </button>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'} flex items-center justify-center`}>
          <AlertTriangle size={20} className={colors.text} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${colors.text} mb-1`}>
            {message.title}
          </h3>
          <p className={`text-sm ${colors.textMuted} mb-3`}>
            {message.description} {message.action}
          </p>
          
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm transition-all hover:scale-[1.02] shadow-lg ${colors.button}`}
            >
              <Crown size={16} />
              Fazer Upgrade
            </Link>
            
            <div className={`text-xs ${colors.textMuted} flex items-center gap-1`}>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
              {used} / {max} {type === 'presentations' ? 'apresentações' : 'slides'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

