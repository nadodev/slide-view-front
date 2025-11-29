/**
 * @fileoverview Componente de histórico de versões de slides
 */

import { useState, useEffect } from 'react';
import { 
    History, 
    RotateCcw, 
    X, 
    Clock, 
    User,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';
import { useTheme } from '../stores/useThemeStore';
import { useAuth } from '../stores/useAuthStore';
import { Button } from '../shared/components/ui/button';

interface SlideVersion {
    id: number;
    version_number: number;
    title: string | null;
    content: string;
    notes: string | null;
    change_description: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface VersionHistoryProps {
    presentationId: number;
    slideId: number;
    isOpen: boolean;
    onClose: () => void;
    onRestore: (version: SlideVersion) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export function VersionHistory({ 
    presentationId, 
    slideId, 
    isOpen, 
    onClose, 
    onRestore 
}: VersionHistoryProps) {
    const { isDark } = useTheme();
    const { token } = useAuth();
    const [versions, setVersions] = useState<SlideVersion[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<SlideVersion | null>(null);
    const [restoring, setRestoring] = useState(false);

    useEffect(() => {
        if (isOpen && slideId) {
            loadVersions();
        }
    }, [isOpen, slideId]);

    const loadVersions = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/presentations/${presentationId}/slides/${slideId}/versions`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            if (!response.ok) throw new Error('Erro ao carregar versões');

            const data = await response.json();
            setVersions(data.versions);
        } catch (error) {
            console.error('Erro ao carregar versões:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (version: SlideVersion) => {
        if (!token) return;

        try {
            setRestoring(true);
            const response = await fetch(
                `${API_BASE_URL}/presentations/${presentationId}/slides/${slideId}/versions/${version.id}/restore`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            if (!response.ok) throw new Error('Erro ao restaurar versão');

            onRestore(version);
            onClose();
        } catch (error) {
            console.error('Erro ao restaurar versão:', error);
        } finally {
            setRestoring(false);
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
        selected: isDark ? 'bg-blue-500/20 border-blue-500' : 'bg-blue-50 border-blue-300',
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-2xl max-h-[80vh] rounded-2xl border ${colors.border} ${colors.bg} shadow-2xl overflow-hidden flex flex-col`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${colors.border}`}>
                    <div className="flex items-center gap-3">
                        <History className="text-blue-400" size={20} />
                        <div>
                            <h2 className={`font-semibold ${colors.text}`}>Histórico de Versões</h2>
                            <p className={`text-sm ${colors.textMuted}`}>
                                {versions.length} versões encontradas
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
                    ) : versions.length === 0 ? (
                        <div className="text-center py-12">
                            <History size={48} className={`mx-auto mb-4 ${colors.textMuted}`} />
                            <p className={colors.textMuted}>Nenhuma versão anterior encontrada</p>
                            <p className={`text-sm ${colors.textMuted} mt-1`}>
                                As versões são salvas automaticamente ao editar
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((version) => (
                                <div
                                    key={version.id}
                                    onClick={() => setSelectedVersion(
                                        selectedVersion?.id === version.id ? null : version
                                    )}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedVersion?.id === version.id 
                                            ? colors.selected 
                                            : `${colors.border} ${colors.hover}`
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                isDark ? 'bg-slate-800' : 'bg-slate-100'
                                            }`}>
                                                <span className={`text-sm font-bold ${colors.text}`}>
                                                    v{version.version_number}
                                                </span>
                                            </div>
                                            <div>
                                                <p className={`font-medium ${colors.text}`}>
                                                    {version.change_description || `Versão ${version.version_number}`}
                                                </p>
                                                <div className={`flex items-center gap-3 text-xs ${colors.textMuted}`}>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(version.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User size={12} />
                                                        {version.user.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedVersion?.id === version.id ? (
                                            <ChevronUp size={20} className={colors.textMuted} />
                                        ) : (
                                            <ChevronDown size={20} className={colors.textMuted} />
                                        )}
                                    </div>

                                    {/* Preview do conteúdo */}
                                    {selectedVersion?.id === version.id && (
                                        <div className="mt-4 pt-4 border-t border-dashed border-slate-600">
                                            <p className={`text-sm ${colors.textMuted} mb-3`}>
                                                Preview do conteúdo:
                                            </p>
                                            <pre className={`text-xs p-3 rounded-lg ${
                                                isDark ? 'bg-slate-800' : 'bg-slate-100'
                                            } ${colors.text} overflow-x-auto max-h-40`}>
                                                {version.content.slice(0, 500)}
                                                {version.content.length > 500 && '...'}
                                            </pre>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(version);
                                                }}
                                                disabled={restoring}
                                                className="mt-4 w-full bg-blue-600 hover:bg-blue-500"
                                            >
                                                {restoring ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <RotateCcw size={16} className="mr-2" />
                                                )}
                                                Restaurar esta versão
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t ${colors.border} flex justify-end`}>
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}

