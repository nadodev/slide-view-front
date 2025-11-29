/**
 * @fileoverview Página do Editor
 * Refatorado para usar core e salvar no backend
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MarkdownFile, extractNotes, parseMarkdown } from '../../core';
import EditPanel from '../../components/EditPanel';
import { useFileStore } from '../../stores/useFileStore';
import { usePresentationsStore } from '../../stores/usePresentationsStore';
import { toast } from 'sonner';

export default function EditorPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const presentationId = searchParams.get('id');
    
    const [draftContent, setDraftContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const { 
        currentPresentation, 
        fetchPresentation, 
        saveSlides,
        updatePresentation 
    } = usePresentationsStore();
    
    const files = useFileStore((state) => state.files);
    const setFiles = useFileStore((state) => state.setFiles);

    // Carregar apresentação se houver ID
    useEffect(() => {
        const loadPresentation = async () => {
            if (presentationId) {
                const presentation = await fetchPresentation(parseInt(presentationId));
                if (presentation?.slides) {
                    const mdFiles: MarkdownFile[] = presentation.slides.map((slide, idx) => ({
                        id: String(slide.id || idx + 1),
                        name: slide.title || `Slide ${idx + 1}`,
                        content: slide.content,
                    }));
                    setFiles(mdFiles);
                }
            }
        };
        
        loadPresentation();
    }, [presentationId, fetchPresentation, setFiles]);

    // Auto-save com debounce
    const autoSave = useCallback(async (filesToSave: MarkdownFile[]) => {
        if (!presentationId || filesToSave.length === 0) return;

        setIsSaving(true);
        try {
            const slides = filesToSave.map((file, idx) => ({
                title: file.name.replace('.md', ''),
                content: file.content,
                order: idx,
            }));

            await saveSlides(parseInt(presentationId), slides);
            setLastSaved(new Date());
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar', {
                description: 'Não foi possível salvar as alterações automaticamente.'
            });
        } finally {
            setIsSaving(false);
        }
    }, [presentationId, saveSlides]);

    // Debounced auto-save quando os arquivos mudam
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        if (presentationId && files.length > 0) {
            saveTimeoutRef.current = setTimeout(() => {
                autoSave(files);
            }, 2000); // Salvar 2 segundos após a última alteração
        }

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [files, presentationId, autoSave]);

    const handleCreateFiles = async (newFiles: MarkdownFile[]) => {
        const slides = newFiles.map((file) => {
            const { clean, notes } = extractNotes(file.content);
            const { html } = parseMarkdown(clean);
            return {
                name: file.name.replace('.md', ''),
                content: clean,
                notes,
                html,
            };
        });

        // Salvar antes de navegar
        if (presentationId) {
            setIsSaving(true);
            try {
                const slidesToSave = newFiles.map((file, idx) => ({
                    title: file.name.replace('.md', ''),
                    content: file.content,
                    order: idx,
                }));
                await saveSlides(parseInt(presentationId), slidesToSave);
                toast.success('Apresentação salva!');
            } catch {
                toast.error('Erro ao salvar apresentação');
            } finally {
                setIsSaving(false);
            }
        }

        navigate(`/app${presentationId ? `?id=${presentationId}` : ''}`, { state: { slides } });
    };

    const handleCancel = () => {
        useFileStore.getState().resetFiles();
        navigate('/dashboard');
    };

    const handleSaveManually = async () => {
        if (!presentationId || files.length === 0) return;
        
        setIsSaving(true);
        try {
            const slides = files.map((file, idx) => ({
                title: file.name.replace('.md', ''),
                content: file.content,
                order: idx,
            }));
            await saveSlides(parseInt(presentationId), slides);
            setLastSaved(new Date());
            toast.success('Apresentação salva!');
        } catch {
            toast.error('Erro ao salvar apresentação');
        } finally {
            setIsSaving(false);
        }
    };

    const formatLastSaved = () => {
        if (!lastSaved) return null;
        const now = new Date();
        const diff = now.getTime() - lastSaved.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (seconds < 60) return 'Salvo agora';
        if (minutes === 1) return 'Salvo há 1 minuto';
        return `Salvo há ${minutes} minutos`;
    };

    return (
        <div className="relative h-screen">
            {/* Status de salvamento */}
            {presentationId && (
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    {isSaving ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 rounded-lg border border-slate-700 text-sm text-slate-300">
                            <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            Salvando...
                        </div>
                    ) : lastSaved ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 rounded-lg border border-slate-700 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            {formatLastSaved()}
                        </div>
                    ) : null}
                    
                    <button
                        onClick={handleSaveManually}
                        disabled={isSaving || files.length === 0}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                    >
                        Salvar
                    </button>
                </div>
            )}
            
            <EditPanel
                open={true}
                value={draftContent}
                onChange={setDraftContent}
                onCancel={handleCancel}
                mode="create"
                onCreateFiles={handleCreateFiles}
            />
        </div>
    );
}
