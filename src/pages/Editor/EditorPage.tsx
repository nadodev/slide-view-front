/**
 * @fileoverview Página do Editor
 * Com auto-save visual, histórico de versões e recuperação de rascunhos
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MarkdownFile, extractNotes, parseMarkdown } from '../../core';
import EditPanel from '../../components/EditPanel';
import { VersionHistory } from '../../components/VersionHistory';
import { DraftRecoveryBanner, DraftRecoveryModal } from '../../components/DraftRecovery';
import { useFileStore } from '../../stores/useFileStore';
import { usePresentationsStore } from '../../stores/usePresentationsStore';
import { useAutoSaveStore } from '../../stores/useAutoSaveStore';
import { useUIStore } from '../../stores/useUIStore';
import { useAuth } from '../../stores/useAuthStore';
import { draftService } from '../../services/drafts/draftService';
import { toast } from 'sonner';

export default function EditorPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const presentationId = searchParams.get('id');
    const { token } = useAuth();
    const { setStatus, setSaved, setError } = useAutoSaveStore();
    const { showDrafts, showVersionHistory, setShowDrafts, setShowVersionHistory } = useUIStore();
    
    const [draftContent, setDraftContent] = useState('');
    const [selectedSlideId, setSelectedSlideId] = useState<number | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const draftTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const { 
        currentPresentation, 
        fetchPresentation, 
        saveSlides,
    } = usePresentationsStore();
    
    const files = useFileStore((state) => state.files);
    const setFiles = useFileStore((state) => state.setFiles);
    const activeFileId = useFileStore((state) => state.activeFileId);

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

    // Auto-save no backend
    const autoSave = useCallback(async (filesToSave: MarkdownFile[]) => {
        if (!presentationId || filesToSave.length === 0) return;

        setStatus('saving');
        try {
            const slides = filesToSave.map((file, idx) => {
                // Verificar se o file.id é um ID numérico do banco
                const slideId = file.id && !isNaN(Number(file.id)) ? Number(file.id) : undefined;
                return {
                    id: slideId,
                    title: file.name.replace('.md', ''),
                    content: file.content,
                    order: idx,
                };
            });

            console.log('💾 Salvando slides com IDs:', slides.map(s => s.id));
            await saveSlides(parseInt(presentationId), slides);
            setSaved();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setError('Não foi possível salvar');
            toast.error('Erro ao salvar', {
                description: 'Não foi possível salvar as alterações automaticamente.'
            });
        }
    }, [presentationId, saveSlides, setStatus, setSaved, setError]);

    // Salvar rascunho local (para recuperação)
    const saveDraft = useCallback(async () => {
        if (!token) {
            console.log('⚠️ Auto-save: Usuário não está logado');
            return;
        }
        if (files.length === 0) {
            console.log('⚠️ Auto-save: Nenhum arquivo para salvar');
            return;
        }

        try {
            setStatus('saving');
            console.log('💾 Salvando rascunho...');
            const content = files.map(f => f.content).join('\n\n---\n\n');
            await draftService.saveDraft(token, {
                presentation_id: presentationId ? parseInt(presentationId) : null,
                type: 'presentation',
                title: currentPresentation?.title || 'Rascunho',
                content,
                metadata: { files: files.map(f => ({ name: f.name, id: f.id })) },
            });
            console.log('✅ Rascunho salvo!');
            setSaved();
        } catch (error) {
            console.error('❌ Erro ao salvar rascunho:', error);
            setError('Erro ao salvar rascunho');
        }
    }, [token, files, presentationId, currentPresentation?.title, setStatus, setSaved, setError]);

    // Debounced auto-save quando os arquivos mudam
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        if (draftTimeoutRef.current) {
            clearTimeout(draftTimeoutRef.current);
        }

        // Só executa se tiver arquivos com conteúdo
        const hasContent = files.some(f => f.content.trim().length > 0);
        if (!hasContent) return;

        // Salvar no backend após 2 segundos (só se tiver presentationId)
        if (presentationId) {
            saveTimeoutRef.current = setTimeout(() => {
                autoSave(files);
            }, 2000);
        }

        // Salvar rascunho após 3 segundos (SEMPRE que tiver conteúdo)
        draftTimeoutRef.current = setTimeout(() => {
            saveDraft();
        }, 3000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            if (draftTimeoutRef.current) clearTimeout(draftTimeoutRef.current);
        };
    }, [files, presentationId, autoSave, saveDraft]);

    // Obter ID do slide atual para histórico
    const getCurrentSlideId = (): number | null => {
        if (!currentPresentation?.slides || !activeFileId) return null;
        const fileIndex = files.findIndex(f => f.id === activeFileId);
        if (fileIndex < 0) return null;
        const slide = currentPresentation.slides[fileIndex];
        return slide?.id || null;
    };

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
            setStatus('saving');
            try {
                const slidesToSave = newFiles.map((file, idx) => {
                    const slideId = file.id && !isNaN(Number(file.id)) ? Number(file.id) : undefined;
                    return {
                        id: slideId,
                        title: file.name.replace('.md', ''),
                        content: file.content,
                        order: idx,
                    };
                });
                await saveSlides(parseInt(presentationId), slidesToSave);
                setSaved();
                toast.success('Apresentação salva!');
            } catch {
                setError('Erro ao salvar');
                toast.error('Erro ao salvar apresentação');
            }
        }

        // Limpar rascunho após salvar
        if (token && presentationId) {
            try {
                const drafts = await draftService.getDrafts(token);
                const draft = drafts.find(d => d.presentation_id === parseInt(presentationId));
                if (draft) {
                    await draftService.deleteDraft(token, draft.id);
                }
            } catch {
                // Ignora erro
            }
        }

        navigate(`/app${presentationId ? `?id=${presentationId}` : ''}`, { state: { slides } });
    };

    const handleCancel = () => {
        useFileStore.getState().resetFiles();
        navigate('/dashboard');
    };

    // Quando o modal de histórico abrir, pegar o slide atual
    useEffect(() => {
        if (showVersionHistory) {
            const slideId = getCurrentSlideId();
            if (slideId) {
                setSelectedSlideId(slideId);
            } else if (!presentationId) {
                toast.info('Salve a apresentação primeiro para ver o histórico');
                setShowVersionHistory(false);
            }
        }
    }, [showVersionHistory]);

    const handleRestoreVersion = (version: any) => {
        // Atualizar o conteúdo do slide atual
        const fileIndex = files.findIndex(f => f.id === activeFileId);
        if (fileIndex >= 0 && files[fileIndex]) {
            const newFiles = [...files];
            newFiles[fileIndex] = {
                ...newFiles[fileIndex],
                content: version.content,
            };
            setFiles(newFiles);
            toast.success(`Restaurado para versão ${version.version_number}`);
        }
    };

    const handleRecoverDraft = (draft: any) => {
        try {
            // Se tem metadata com files, usar isso
            if (draft.metadata?.files) {
                const parts = draft.content.split('\n\n---\n\n');
                const recoveredFiles: MarkdownFile[] = draft.metadata.files.map((f: any, idx: number) => ({
                    id: f.id || String(idx + 1),
                    name: f.name || `Slide ${idx + 1}`,
                    content: parts[idx] || '',
                }));
                setFiles(recoveredFiles);
            } else {
                // Fallback: criar um único arquivo
                setFiles([{
                    id: '1',
                    name: draft.title || 'Rascunho',
                    content: draft.content,
                }]);
            }
            toast.success('Rascunho recuperado!');
        } catch (error) {
            toast.error('Erro ao recuperar rascunho');
        }
    };

    return (
        <div className="relative h-screen">
            {/* Banner de recuperação de rascunho */}
            <div className="absolute top-16 left-4 right-4 z-40">
                <DraftRecoveryBanner
                    presentationId={presentationId ? parseInt(presentationId) : undefined}
                    onRecover={handleRecoverDraft}
                />
            </div>

            
            <EditPanel
                open={true}
                value={draftContent}
                onChange={setDraftContent}
                onCancel={handleCancel}
                mode="create"
                onCreateFiles={handleCreateFiles}
            />

            {/* Modal de histórico de versões */}
            {showVersionHistory && presentationId && (
                <VersionHistory
                    presentationId={parseInt(presentationId)}
                    slideId={selectedSlideId || 0}
                    isOpen={showVersionHistory}
                    onClose={() => setShowVersionHistory(false)}
                    onRestore={handleRestoreVersion}
                />
            )}

            {/* Modal de rascunhos */}
            <DraftRecoveryModal
                isOpen={showDrafts}
                onClose={() => setShowDrafts(false)}
                onRecover={handleRecoverDraft}
            />
        </div>
    );
}
