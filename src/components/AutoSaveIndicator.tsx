/**
 * @fileoverview Indicador visual de auto-save
 */

import { useEffect, useState } from 'react';
import { Check, Cloud, CloudOff, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../stores/useThemeStore';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

interface AutoSaveIndicatorProps {
    status: SaveStatus;
    lastSaved?: Date | null;
    error?: string;
    className?: string;
    showText?: boolean;
}

export function AutoSaveIndicator({ 
    status, 
    lastSaved, 
    error,
    className = '',
    showText = true 
}: AutoSaveIndicatorProps) {
    const { isDark } = useTheme();
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (status === 'saved') {
            setShowSaved(true);
            const timer = setTimeout(() => setShowSaved(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [status, lastSaved]);

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusContent = () => {
        switch (status) {
            case 'saving':
                return (
                    <>
                        <Loader2 size={14} className="animate-spin text-blue-400" />
                        {showText && <span className="text-blue-400">Salvando...</span>}
                    </>
                );
            case 'saved':
                return (
                    <>
                        <Check size={14} className="text-green-400" />
                        {showText && (
                            <span className={`transition-opacity duration-300 ${showSaved ? 'opacity-100' : 'opacity-60'} ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                {showSaved ? 'Salvo!' : lastSaved ? `Salvo às ${formatTime(lastSaved)}` : 'Salvo'}
                            </span>
                        )}
                    </>
                );
            case 'error':
                return (
                    <>
                        <AlertCircle size={14} className="text-red-400" />
                        {showText && <span className="text-red-400">{error || 'Erro ao salvar'}</span>}
                    </>
                );
            case 'offline':
                return (
                    <>
                        <CloudOff size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                        {showText && <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Offline</span>}
                    </>
                );
            default:
                return (
                    <>
                        <Cloud size={14} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
                        {showText && <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>Auto-save ativo</span>}
                    </>
                );
        }
    };

    return (
        <div className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${className}`}>
            {getStatusContent()}
        </div>
    );
}

/**
 * Hook para gerenciar o status do auto-save
 */
export function useAutoSave(
    saveFunction: () => Promise<void>,
    debounceMs: number = 2000
) {
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [error, setError] = useState<string>('');

    const save = async () => {
        try {
            setStatus('saving');
            setError('');
            await saveFunction();
            setStatus('saved');
            setLastSaved(new Date());
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Erro ao salvar');
        }
    };

    // Debounced save
    const debouncedSave = (() => {
        let timeoutId: NodeJS.Timeout | null = null;
        
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                save();
            }, debounceMs);
        };
    })();

    return {
        status,
        lastSaved,
        error,
        save,
        debouncedSave,
        setStatus,
    };
}

