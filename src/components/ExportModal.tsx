/**
 * @fileoverview Modal de exportação de apresentações
 * Permite exportar para PDF, PowerPoint e Imagens
 */

import React, { useState, useCallback } from 'react';
import {
    FileDown,
    FileText,
    Image,
    Presentation,
    X,
    Loader2,
    Check,
    Crown,
    AlertCircle,
} from 'lucide-react';
import { exportService, ExportOptions, SlideData } from '../services/export';
import { useAuthStore } from '../stores/useAuthStore';
import { useThemeStore } from '../stores/useThemeStore';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    presentationTitle: string;
    slides: SlideData[];
}

type ExportFormat = 'pdf' | 'pptx' | 'jpg' | 'png';

interface FormatOption {
    id: ExportFormat;
    name: string;
    description: string;
    icon: React.ReactNode;
    isPremium: boolean;
    extension: string;
}

const formatOptions: FormatOption[] = [
    {
        id: 'pdf',
        name: 'PDF',
        description: 'Documento PDF em alta qualidade',
        icon: <FileText size={24} />,
        isPremium: true,
        extension: 'pdf',
    },
    {
        id: 'pptx',
        name: 'PowerPoint',
        description: 'Arquivo PPTX editável',
        icon: <Presentation size={24} />,
        isPremium: true,
        extension: 'pptx',
    },
    {
        id: 'jpg',
        name: 'Imagens JPG',
        description: 'Cada slide como imagem JPG',
        icon: <Image size={24} />,
        isPremium: true,
        extension: 'jpg',
    },
    {
        id: 'png',
        name: 'Imagens PNG',
        description: 'Cada slide como imagem PNG transparente',
        icon: <Image size={24} />,
        isPremium: true,
        extension: 'png',
    },
];

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    presentationTitle,
    slides,
}) => {
    const { user } = useAuthStore();
    const { resolvedTheme } = useThemeStore();
    const isDark = resolvedTheme === 'dark';
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
    const [includeNotes, setIncludeNotes] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Verificar se usuário tem plano premium
    const isPremium = user?.plan?.slug === 'premium' || user?.plan?.slug === 'enterprise';

    const colors = isDark
        ? {
            bg: 'bg-slate-900',
            cardBg: 'bg-slate-800/90',
            border: 'border-slate-700',
            text: 'text-slate-100',
            textMuted: 'text-slate-400',
            hover: 'hover:bg-slate-700',
            selected: 'bg-blue-600/20 border-blue-500',
        }
        : {
            bg: 'bg-white',
            cardBg: 'bg-slate-50',
            border: 'border-slate-200',
            text: 'text-slate-900',
            textMuted: 'text-slate-500',
            hover: 'hover:bg-slate-100',
            selected: 'bg-blue-50 border-blue-500',
        };

    const handleExport = useCallback(async () => {
        if (!isPremium) {
            setError('Faça upgrade para o plano Premium para exportar.');
            return;
        }

        setIsExporting(true);
        setError(null);
        setSuccess(false);

        try {
            const options: ExportOptions = {
                title: presentationTitle,
                author: user?.name,
                slides,
                format: selectedFormat,
                quality: 0.95,
                includeNotes,
            };

            const result = await exportService.export(options, setProgress);

            // Download do resultado
            const formatOption = formatOptions.find(f => f.id === selectedFormat)!;
            const filename = `${presentationTitle.replace(/[^a-zA-Z0-9]/g, '_')}`;

            if (Array.isArray(result)) {
                // Múltiplas imagens
                await exportService.downloadAsZip(
                    result,
                    filename,
                    formatOption.extension
                );
            } else {
                // Arquivo único
                exportService.downloadBlob(
                    result,
                    `${filename}.${formatOption.extension}`
                );
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Erro ao exportar:', err);
            setError(err instanceof Error ? err.message : 'Erro ao exportar');
        } finally {
            setIsExporting(false);
        }
    }, [isPremium, selectedFormat, presentationTitle, slides, user, includeNotes, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-lg mx-4 rounded-2xl ${colors.bg} border ${colors.border} shadow-2xl`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${colors.border}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <FileDown size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold ${colors.text}`}>
                                Exportar Apresentação
                            </h2>
                            <p className={`text-sm ${colors.textMuted}`}>
                                {slides.length} slides
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
                <div className="p-6 space-y-6">
                    {/* Premium Notice */}
                    {!isPremium && (
                        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <Crown size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-500 font-medium">
                                    Funcionalidade Premium
                                </p>
                                <p className={`text-sm ${colors.textMuted} mt-1`}>
                                    Faça upgrade para exportar suas apresentações em diferentes formatos.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Format Selection */}
                    <div>
                        <label className={`block text-sm font-medium ${colors.text} mb-3`}>
                            Formato de Exportação
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {formatOptions.map((format) => (
                                <button
                                    key={format.id}
                                    onClick={() => setSelectedFormat(format.id)}
                                    disabled={!isPremium}
                                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                                        selectedFormat === format.id
                                            ? colors.selected
                                            : `${colors.cardBg} ${colors.border} ${isPremium ? colors.hover : 'opacity-50 cursor-not-allowed'}`
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`${selectedFormat === format.id ? 'text-blue-500' : colors.textMuted}`}>
                                            {format.icon}
                                        </div>
                                        <div>
                                            <div className={`font-medium ${colors.text}`}>
                                                {format.name}
                                            </div>
                                            <div className={`text-xs ${colors.textMuted}`}>
                                                {format.description}
                                            </div>
                                        </div>
                                    </div>
                                    {format.isPremium && (
                                        <Crown
                                            size={14}
                                            className="absolute top-2 right-2 text-amber-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    {selectedFormat === 'pptx' && (
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="includeNotes"
                                checked={includeNotes}
                                onChange={(e) => setIncludeNotes(e.target.checked)}
                                disabled={!isPremium}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="includeNotes"
                                className={`text-sm ${colors.text}`}
                            >
                                Incluir notas do apresentador
                            </label>
                        </div>
                    )}

                    {/* Progress */}
                    {isExporting && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className={colors.textMuted}>{progress.status}</span>
                                <span className={colors.text}>
                                    {progress.current}/{progress.total}
                                </span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                                    style={{
                                        width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <AlertCircle size={18} className="text-red-500" />
                            <span className="text-red-500 text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <Check size={18} className="text-green-500" />
                            <span className="text-green-500 text-sm">
                                Exportação concluída com sucesso!
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-end gap-3 p-6 border-t ${colors.border}`}>
                    <button
                        onClick={onClose}
                        disabled={isExporting}
                        className={`px-4 py-2 rounded-lg ${colors.cardBg} ${colors.text} ${colors.hover} transition-colors`}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting || !isPremium}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                            isPremium
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {isExporting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Exportando...
                            </>
                        ) : (
                            <>
                                <FileDown size={18} />
                                Exportar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;

