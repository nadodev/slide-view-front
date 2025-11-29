/**
 * @fileoverview Modal de importação de PDF para slides
 * Permite importar PDF e marcar quebras para criar slides
 */

import React, { useState, useCallback, useRef } from 'react';
import {
    FileUp,
    X,
    Loader2,
    Check,
    Crown,
    AlertCircle,
    Scissors,
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    Wand2,
    Eye,
} from 'lucide-react';
import { importService, PDFPageInfo, SlideBreak, ImportedSlide } from '../services/export';
import { useAuthStore } from '../stores/useAuthStore';
import { useThemeStore } from '../stores/useThemeStore';

interface ImportPDFModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (slides: ImportedSlide[]) => void;
}

type Step = 'upload' | 'preview' | 'mark' | 'processing' | 'done';

export const ImportPDFModal: React.FC<ImportPDFModalProps> = ({
    isOpen,
    onClose,
    onImport,
}) => {
    const { user } = useAuthStore();
    const { resolvedTheme } = useThemeStore();
    const isDark = resolvedTheme === 'dark';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<Step>('upload');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
    const [error, setError] = useState<string | null>(null);
    
    const [pages, setPages] = useState<PDFPageInfo[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [breaks, setBreaks] = useState<SlideBreak[]>([]);
    const [importedSlides, setImportedSlides] = useState<ImportedSlide[]>([]);
    const [importMode, setImportMode] = useState<'auto' | 'manual'>('auto');

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
        }
        : {
            bg: 'bg-white',
            cardBg: 'bg-slate-50',
            border: 'border-slate-200',
            text: 'text-slate-900',
            textMuted: 'text-slate-500',
            hover: 'hover:bg-slate-100',
        };

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Por favor, selecione um arquivo PDF.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const loadedPages = await importService.loadPDF(file, setProgress);
            setPages(loadedPages);
            
            // Criar breaks automáticos (um por página)
            const autoBreaks: SlideBreak[] = loadedPages.map((page, idx) => ({
                id: `break-${idx}`,
                pageNumber: page.pageNumber,
                startY: 0,
                endY: 1,
                title: `Slide ${idx + 1}`,
            }));
            setBreaks(autoBreaks);
            
            setStep('preview');
        } catch (err) {
            console.error('Erro ao carregar PDF:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar PDF');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAddBreak = useCallback(() => {
        const newBreak: SlideBreak = {
            id: `break-${Date.now()}`,
            pageNumber: currentPage + 1,
            startY: 0,
            endY: 1,
            title: `Slide ${breaks.length + 1}`,
        };
        setBreaks([...breaks, newBreak]);
    }, [currentPage, breaks]);

    const handleRemoveBreak = useCallback((id: string) => {
        setBreaks(breaks.filter(b => b.id !== id));
    }, [breaks]);

    const handleUpdateBreakTitle = useCallback((id: string, title: string) => {
        setBreaks(breaks.map(b => 
            b.id === id ? { ...b, title } : b
        ));
    }, [breaks]);

    const handleAutoDetect = useCallback(async () => {
        setIsLoading(true);
        try {
            const detectedTitles = await importService.detectTitles();
            
            const newBreaks: SlideBreak[] = detectedTitles.map((t, idx) => ({
                id: `break-${idx}`,
                pageNumber: t.pageNumber,
                startY: 0,
                endY: 1,
                title: t.title,
            }));
            
            setBreaks(newBreaks);
        } catch (err) {
            console.error('Erro ao detectar títulos:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleImport = useCallback(async () => {
        if (!isPremium) {
            setError('Faça upgrade para o plano Premium para importar PDFs.');
            return;
        }

        setStep('processing');
        setIsLoading(true);
        setError(null);

        try {
            let slides: ImportedSlide[];

            if (importMode === 'auto') {
                slides = await importService.createSlidesFromPages(setProgress);
            } else {
                slides = await importService.convertBreaksToSlides(breaks, setProgress);
            }

            setImportedSlides(slides);
            setStep('done');
        } catch (err) {
            console.error('Erro ao importar:', err);
            setError(err instanceof Error ? err.message : 'Erro ao importar');
            setStep('mark');
        } finally {
            setIsLoading(false);
        }
    }, [isPremium, importMode, breaks]);

    const handleConfirmImport = useCallback(() => {
        onImport(importedSlides);
        handleReset();
        onClose();
    }, [importedSlides, onImport, onClose]);

    const handleReset = useCallback(() => {
        setStep('upload');
        setPages([]);
        setBreaks([]);
        setCurrentPage(0);
        setError(null);
        setImportedSlides([]);
        importService.cleanup();
    }, []);

    const currentPageBreaks = breaks.filter(b => b.pageNumber === currentPage + 1);

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
                className={`relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl ${colors.bg} border ${colors.border} shadow-2xl overflow-hidden flex flex-col`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${colors.border} flex-shrink-0`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                            <FileUp size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold ${colors.text}`}>
                                Importar PDF
                            </h2>
                            <p className={`text-sm ${colors.textMuted}`}>
                                {step === 'upload' && 'Selecione um arquivo PDF'}
                                {step === 'preview' && `${pages.length} páginas carregadas`}
                                {step === 'mark' && 'Marque as quebras de slides'}
                                {step === 'processing' && 'Processando...'}
                                {step === 'done' && `${importedSlides.length} slides criados`}
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
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Premium Notice */}
                    {!isPremium && (
                        <div className="flex items-start gap-3 p-4 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <Crown size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-500 font-medium">
                                    Funcionalidade Premium
                                </p>
                                <p className={`text-sm ${colors.textMuted} mt-1`}>
                                    Faça upgrade para importar PDFs e convertê-los em slides.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step: Upload */}
                    {step === 'upload' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full max-w-md p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                                    isDark
                                        ? 'border-slate-600 hover:border-blue-500 bg-slate-800/50'
                                        : 'border-slate-300 hover:border-blue-500 bg-slate-50'
                                }`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <FileUp size={48} className={`${colors.textMuted} mb-4`} />
                                    <p className={`font-medium ${colors.text} mb-2`}>
                                        Clique para selecionar um PDF
                                    </p>
                                    <p className={`text-sm ${colors.textMuted}`}>
                                        ou arraste e solte aqui
                                    </p>
                                </div>
                            </div>

                            {isLoading && (
                                <div className="mt-8 text-center">
                                    <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
                                    <p className={colors.textMuted}>{progress.status}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step: Preview */}
                    {step === 'preview' && (
                        <div className="space-y-6">
                            {/* Import Mode Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setImportMode('auto')}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        importMode === 'auto'
                                            ? 'bg-blue-600/20 border-blue-500'
                                            : `${colors.cardBg} ${colors.border} ${colors.hover}`
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Wand2 size={24} className={importMode === 'auto' ? 'text-blue-500' : colors.textMuted} />
                                        <span className={`font-medium ${colors.text}`}>
                                            Automático
                                        </span>
                                    </div>
                                    <p className={`text-sm ${colors.textMuted}`}>
                                        Uma página = Um slide. Rápido e simples.
                                    </p>
                                </button>

                                <button
                                    onClick={() => { setImportMode('manual'); setStep('mark'); }}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        importMode === 'manual'
                                            ? 'bg-purple-600/20 border-purple-500'
                                            : `${colors.cardBg} ${colors.border} ${colors.hover}`
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Scissors size={24} className={importMode === 'manual' ? 'text-purple-500' : colors.textMuted} />
                                        <span className={`font-medium ${colors.text}`}>
                                            Manual
                                        </span>
                                    </div>
                                    <p className={`text-sm ${colors.textMuted}`}>
                                        Marque manualmente onde quebrar em slides.
                                    </p>
                                </button>
                            </div>

                            {/* Page Preview */}
                            <div className="relative">
                                <div className={`aspect-[4/3] rounded-xl overflow-hidden ${colors.cardBg} border ${colors.border}`}>
                                    {pages[currentPage]?.imageData && (
                                        <img
                                            src={pages[currentPage].imageData}
                                            alt={`Página ${currentPage + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className={`p-2 rounded-lg ${colors.hover} disabled:opacity-50 transition-colors`}
                                    >
                                        <ChevronLeft size={24} className={colors.textMuted} />
                                    </button>

                                    <span className={colors.text}>
                                        Página {currentPage + 1} de {pages.length}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                                        disabled={currentPage === pages.length - 1}
                                        className={`p-2 rounded-lg ${colors.hover} disabled:opacity-50 transition-colors`}
                                    >
                                        <ChevronRight size={24} className={colors.textMuted} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step: Mark Breaks */}
                    {step === 'mark' && (
                        <div className="grid grid-cols-2 gap-6">
                            {/* PDF Preview */}
                            <div>
                                <div className={`aspect-[4/3] rounded-xl overflow-hidden ${colors.cardBg} border ${colors.border} relative`}>
                                    {pages[currentPage]?.imageData && (
                                        <img
                                            src={pages[currentPage].imageData}
                                            alt={`Página ${currentPage + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                    
                                    {/* Break markers overlay */}
                                    {currentPageBreaks.map((breakItem, idx) => (
                                        <div
                                            key={breakItem.id}
                                            className="absolute left-0 right-0 border-t-2 border-dashed border-blue-500 bg-blue-500/10"
                                            style={{
                                                top: `${breakItem.startY * 100}%`,
                                                height: `${(breakItem.endY - breakItem.startY) * 100}%`,
                                            }}
                                        >
                                            <span className="absolute -top-3 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                                                Slide {idx + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Page Navigation */}
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className={`p-2 rounded-lg ${colors.hover} disabled:opacity-50`}
                                    >
                                        <ChevronLeft size={20} className={colors.textMuted} />
                                    </button>
                                    <span className={`text-sm ${colors.text}`}>
                                        Página {currentPage + 1} de {pages.length}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                                        disabled={currentPage === pages.length - 1}
                                        className={`p-2 rounded-lg ${colors.hover} disabled:opacity-50`}
                                    >
                                        <ChevronRight size={20} className={colors.textMuted} />
                                    </button>
                                </div>
                            </div>

                            {/* Breaks List */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`font-medium ${colors.text}`}>
                                        Slides ({breaks.length})
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAutoDetect}
                                            disabled={isLoading}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${colors.cardBg} ${colors.hover} ${colors.text} border ${colors.border}`}
                                        >
                                            <Wand2 size={14} />
                                            Auto-detectar
                                        </button>
                                        <button
                                            onClick={handleAddBreak}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white"
                                        >
                                            <Plus size={14} />
                                            Adicionar
                                        </button>
                                    </div>
                                </div>

                                <div className={`max-h-[400px] overflow-y-auto rounded-xl border ${colors.border}`}>
                                    {breaks.length === 0 ? (
                                        <div className={`p-8 text-center ${colors.textMuted}`}>
                                            <Scissors size={32} className="mx-auto mb-2 opacity-50" />
                                            <p>Nenhuma marcação ainda.</p>
                                            <p className="text-sm">Clique em "Adicionar" para marcar slides.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-700">
                                            {breaks.map((breakItem, idx) => (
                                                <div
                                                    key={breakItem.id}
                                                    className={`flex items-center gap-3 p-3 ${colors.hover} transition-colors`}
                                                >
                                                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 font-medium text-sm`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={breakItem.title || ''}
                                                            onChange={(e) => handleUpdateBreakTitle(breakItem.id, e.target.value)}
                                                            placeholder={`Slide ${idx + 1}`}
                                                            className={`w-full bg-transparent border-none outline-none ${colors.text} placeholder:${colors.textMuted}`}
                                                        />
                                                        <p className={`text-xs ${colors.textMuted}`}>
                                                            Página {breakItem.pageNumber}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveBreak(breakItem.id)}
                                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step: Processing */}
                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={48} className="animate-spin text-blue-500 mb-6" />
                            <p className={`text-lg font-medium ${colors.text} mb-2`}>
                                Criando slides...
                            </p>
                            <p className={colors.textMuted}>{progress.status}</p>
                            
                            <div className="w-full max-w-md mt-6">
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
                                        style={{
                                            width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step: Done */}
                    {step === 'done' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                <Check size={24} className="text-green-500" />
                                <div>
                                    <p className="text-green-500 font-medium">
                                        Importação concluída!
                                    </p>
                                    <p className={`text-sm ${colors.textMuted}`}>
                                        {importedSlides.length} slides foram criados com sucesso.
                                    </p>
                                </div>
                            </div>

                            {/* Preview of imported slides */}
                            <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                                {importedSlides.map((slide, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-xl ${colors.cardBg} border ${colors.border}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 flex items-center justify-center rounded-md bg-purple-500/20 text-purple-500 text-xs font-medium">
                                                {idx + 1}
                                            </span>
                                            <span className={`text-sm font-medium ${colors.text} truncate`}>
                                                {slide.title}
                                            </span>
                                        </div>
                                        <p className={`text-xs ${colors.textMuted} line-clamp-3`}>
                                            {slide.content.substring(0, 100)}...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 mt-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <AlertCircle size={18} className="text-red-500" />
                            <span className="text-red-500 text-sm">{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-between gap-3 p-6 border-t ${colors.border} flex-shrink-0`}>
                    <button
                        onClick={step === 'upload' ? onClose : handleReset}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg ${colors.cardBg} ${colors.text} ${colors.hover} transition-colors`}
                    >
                        {step === 'upload' ? 'Cancelar' : 'Recomeçar'}
                    </button>

                    <div className="flex gap-3">
                        {step === 'preview' && importMode === 'auto' && (
                            <button
                                onClick={handleImport}
                                disabled={isLoading || !isPremium}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                                    isPremium
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <Wand2 size={18} />
                                Importar Automático
                            </button>
                        )}

                        {step === 'mark' && (
                            <button
                                onClick={handleImport}
                                disabled={isLoading || breaks.length === 0 || !isPremium}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                                    isPremium && breaks.length > 0
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <FileUp size={18} />
                                Criar {breaks.length} Slides
                            </button>
                        )}

                        {step === 'done' && (
                            <button
                                onClick={handleConfirmImport}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 transition-all"
                            >
                                <Check size={18} />
                                Usar Slides
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportPDFModal;

