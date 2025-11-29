/**
 * @fileoverview Componente para recuperar rascunhos salvos automaticamente
 */

import { useState, useEffect } from 'react';
import { 
    FileText, 
    Clock, 
    Trash2, 
    RotateCcw, 
    X,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { useTheme } from '../stores/useThemeStore';
import { useAuth } from '../stores/useAuthStore';
import { draftService, type Draft } from '../services/drafts/draftService';
import { Button } from '../shared/components/ui/button';
import { toast } from 'sonner';

interface DraftRecoveryProps {
    presentationId?: number;
    onRecover: (draft: Draft) => void;
    onDismiss?: () => void;
}

export function DraftRecoveryBanner({ presentationId, onRecover, onDismiss }: DraftRecoveryProps) {
    const { isDark } = useTheme();
    const { token } = useAuth();
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        checkForDrafts();
    }, [presentationId, token]);

    const checkForDrafts = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const drafts = await draftService.getDrafts(token);
            
            // Encontrar rascunho relevante
            const relevantDraft = drafts.find(d => 
                presentationId 
                    ? d.presentation_id === presentationId 
                    : d.type === 'presentation' && !d.presentation_id
            );

            if (relevantDraft) {
                // Verificar se é recente (menos de 24 horas)
                const lastSaved = new Date(relevantDraft.last_saved_at);
                const now = new Date();
                const hoursDiff = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    setDraft(relevantDraft);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar rascunhos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecover = () => {
        if (draft) {
            onRecover(draft);
            setDismissed(true);
        }
    };

    const handleDismiss = async () => {
        if (draft && token) {
            try {
                await draftService.deleteDraft(token, draft.id);
            } catch (error) {
                console.error('Erro ao deletar rascunho:', error);
            }
        }
        setDismissed(true);
        onDismiss?.();
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `Há ${diffMins} minutos`;
        if (diffHours < 24) return `Há ${diffHours} horas`;
        
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (loading || dismissed || !draft) return null;

    return (
        <div className={`mb-4 p-4 rounded-xl border ${
            isDark 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-amber-50 border-amber-200'
        }`}>
            <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                    <h4 className={`font-medium ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
                        Rascunho não salvo encontrado
                    </h4>
                    <p className={`text-sm mt-1 ${isDark ? 'text-amber-300/70' : 'text-amber-700'}`}>
                        {draft.title || 'Sem título'} • Salvo {formatTime(draft.last_saved_at)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <Button
                            size="sm"
                            onClick={handleRecover}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            <RotateCcw size={14} className="mr-1.5" />
                            Recuperar
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDismiss}
                            className={isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-700 hover:text-amber-800'}
                        >
                            Descartar
                        </Button>
                    </div>
                </div>
                <button 
                    onClick={handleDismiss}
                    className={`p-1 rounded ${isDark ? 'hover:bg-amber-500/20' : 'hover:bg-amber-200'}`}
                >
                    <X size={16} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                </button>
            </div>
        </div>
    );
}

/**
 * Modal completo de rascunhos
 */
interface DraftRecoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecover: (draft: Draft) => void;
}

export function DraftRecoveryModal({ isOpen, onClose, onRecover }: DraftRecoveryModalProps) {
    const { isDark } = useTheme();
    const { token } = useAuth();
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadDrafts();
        }
    }, [isOpen]);

    const loadDrafts = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await draftService.getDrafts(token);
            setDrafts(data);
        } catch (error) {
            toast.error('Erro ao carregar rascunhos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (draftId: number) => {
        if (!token) return;

        try {
            setDeleting(draftId);
            await draftService.deleteDraft(token, draftId);
            setDrafts(drafts.filter(d => d.id !== draftId));
            toast.success('Rascunho removido');
        } catch (error) {
            toast.error('Erro ao remover rascunho');
        } finally {
            setDeleting(null);
        }
    };

    const handleCleanup = async () => {
        if (!token) return;

        try {
            const result = await draftService.cleanup(token);
            toast.success(`${result.deleted_count} rascunhos antigos removidos`);
            await loadDrafts();
        } catch (error) {
            toast.error('Erro ao limpar rascunhos');
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString));
    };

    const colors = {
        bg: isDark ? 'bg-slate-900' : 'bg-white',
        border: isDark ? 'border-slate-700' : 'border-slate-200',
        text: isDark ? 'text-white' : 'text-slate-900',
        textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
        hover: isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50',
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-lg max-h-[70vh] rounded-2xl border ${colors.border} ${colors.bg} shadow-2xl overflow-hidden flex flex-col`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${colors.border}`}>
                    <div className="flex items-center gap-3">
                        <FileText className="text-blue-400" size={20} />
                        <div>
                            <h2 className={`font-semibold ${colors.text}`}>Rascunhos Salvos</h2>
                            <p className={`text-sm ${colors.textMuted}`}>
                                {drafts.length} rascunhos encontrados
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className={`p-2 rounded-lg ${colors.hover} transition-colors`}
                    >
                        <X size={20} className={colors.textMuted} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : drafts.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText size={48} className={`mx-auto mb-4 ${colors.textMuted}`} />
                            <p className={colors.textMuted}>Nenhum rascunho encontrado</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {drafts.map((draft) => (
                                <div
                                    key={draft.id}
                                    className={`p-4 rounded-xl border ${colors.border} ${colors.hover} transition-colors`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium ${colors.text} truncate`}>
                                                {draft.title || 'Sem título'}
                                            </p>
                                            <div className={`flex items-center gap-2 text-xs ${colors.textMuted} mt-1`}>
                                                <Clock size={12} />
                                                <span>{formatDate(draft.last_saved_at)}</span>
                                                <span>•</span>
                                                <span>{draft.type === 'presentation' ? 'Apresentação' : 'Slide'}</span>
                                            </div>
                                            <p className={`text-sm ${colors.textMuted} mt-2 line-clamp-2`}>
                                                {draft.content.slice(0, 100)}...
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    onRecover(draft);
                                                    onClose();
                                                }}
                                            >
                                                <RotateCcw size={14} className="mr-1" />
                                                Recuperar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(draft.id)}
                                                disabled={deleting === draft.id}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                {deleting === draft.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={14} />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t ${colors.border} flex justify-between`}>
                    <Button
                        variant="ghost"
                        onClick={handleCleanup}
                        className="text-red-400 hover:text-red-300"
                    >
                        <Trash2 size={14} className="mr-1.5" />
                        Limpar Antigos
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}

