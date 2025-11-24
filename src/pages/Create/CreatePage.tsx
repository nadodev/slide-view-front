import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Plus, FolderOpen, Brain, Palette, Users, Settings, Wand2, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EditPanel from '../../components/EditPanel';
import parseMarkdownSafe from '../../utils/markdown';
import type { MarkdownFile } from '../../services/editor/fileManagementService';
import { Button } from '../../shared/components/ui/button';
import { Progress } from '../../shared/components/ui/progress';
import InteractiveSplitModal from '../../shared/components/InteractiveSplitModal';

export default function CreatePage() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Estados do upload
    const [editing, setEditing] = useState(false);
    const [draftContent, setDraftContent] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [splitSingle, setSplitSingle] = useState(false);
    const [delimiter, setDelimiter] = useState("----'----");
    const [loading, setLoading] = useState(false);

    // Estados da IA
    const [aiPrompt, setAiPrompt] = useState('');
    const [slideCount, setSlideCount] = useState(6);
    const [preserveText, setPreserveText] = useState(false);
    const [baseText, setBaseText] = useState('');

    // Estados do modal de split
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalFilename, setModalFilename] = useState('');

    const extractNotes = (text: string) => {
        const notes: string[] = [];
        if (!text) return { clean: "", notes };
        const cleaned = text.replace(
            /<!--\s*note:\s*([\s\S]*?)-->/gi,
            (_match, note) => {
                if (note && note.trim()) notes.push(note.trim());
                return "";
            },
        );
        return { clean: cleaned.trim(), notes };
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from((e.target.files || []) as File[]);
        const invalid = files.find((f: File) => !/\.md$/i.test(f.name));

        if (invalid) {
            toast.error("Arquivo inválido", {
                description: `${invalid.name} não é um arquivo Markdown válido.`
            });
            return;
        }

        setUploadProgress(0);
        toast.success("Upload iniciado", {
            description: `${files.length} arquivo(s) sendo processado(s)...`,
        });

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                const newProgress = prev + 20;
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    toast.success("Upload concluído!", {
                        description: "Arquivos processados com sucesso."
                    });
                    setTimeout(() => setUploadProgress(0), 1000);
                    return 100;
                }
                return newProgress;
            });
        }, 200);

        // Se for arquivo único grande, mostrar modal de split
        if (files.length === 1) {
            try {
                const file = files[0];
                const txt = await file.text();
                const LARGE_THRESHOLD = 5000;
                if (txt && txt.length > LARGE_THRESHOLD) {
                    setModalFilename(file.name);
                    setModalContent(txt);
                    setShowSplitModal(true);
                    return;
                }
            } catch (err) {
                // fallback
            }
        }

        processFiles(files);
    };

    const processFiles = async (files: File[]) => {
        const mdFiles: MarkdownFile[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const content = await file.text();

            if (splitSingle && files.length === 1) {
                // Dividir arquivo único
                const parts = content.split(delimiter);
                parts.forEach((part, idx) => {
                    if (part.trim()) {
                        mdFiles.push({
                            id: String(idx + 1),
                            name: `${file.name.replace('.md', '')}-${idx + 1}.md`,
                            content: part.trim(),
                        });
                    }
                });
            } else {
                mdFiles.push({
                    id: String(i + 1),
                    name: file.name,
                    content,
                });
            }
        }

        // Abrir EditPanel com os arquivos
        setEditing(true);
        // Passar arquivos para o store
        const { useFileStore } = await import('../../stores/useFileStore');
        useFileStore.getState().setFiles(mdFiles);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const input = inputRef.current;
        if (input) {
            const dataTransfer = new DataTransfer();
            files.forEach((file) => dataTransfer.items.add(file));
            name: file.name.replace('.md', ''),
                content: clean,
                    notes,
                    html: parseMarkdownSafe(clean),
            };
    });

    navigate('/app', { state: { slides } });
};

const recentProjects = [
    { id: 1, name: 'Relatório Q4', slides: 15, updated: 'Há 2 horas', color: 'from-blue-500 to-purple-500' },
    { id: 2, name: 'Pitch Startup', slides: 22, updated: 'Ontem', color: 'from-emerald-500 to-teal-500' },
    { id: 3, name: 'Treinamento', slides: 8, updated: 'Há 3 dias', color: 'from-pink-500 to-rose-500' },
];

return (
    <>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold">SlideCraft AI</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-slate-400 hover:text-white transition-colors text-sm">
                            Configurações
                        </button>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
                    </div>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-6 py-16 text-center">
                <h2 className="text-5xl font-bold mb-4">
                    Crie Apresentações{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Incríveis
                    </span>
                    <br />
                    com Inteligência Artificial
                </h2>
                <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                    Transforme suas ideias em slides profissionais em segundos. Upload de arquivos Markdown,
                    geração por IA ou criação visual – tudo em uma plataforma.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Upload Card */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                        <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                            <Upload size={28} className="text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">📁 Upload</h3>
                        <p className="text-slate-400 mb-6 text-sm">
                            Arraste e solte arquivos Markdown (.md). Suporta múltiplos arquivos ou divida-os em um arquivo único.
                        </p>

                        <div
                            className={`border-2 border-dashed rounded-xl p-8 mb-4 transition-all ${isDragging
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-600 hover:border-blue-500/50'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <label className="cursor-pointer block">
                                <div className="text-center">
                                    <Upload size={32} className="mx-auto text-slate-500 mb-2" />
                                    <p className="text-sm text-slate-500">
                                        {isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos .md aqui'}
                                    </p>
                                </div>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept=".md"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <label className="block w-full py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium text-center cursor-pointer">
                            Selecionar Arquivos
                            <input
                                type="file"
                                accept=".md"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>

                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-4">
                                <Progress value={uploadProgress} className="h-2" />
                                <p className="text-xs text-slate-400 text-center mt-2">
                                    Processando... {uploadProgress}%
                                </p>
                            </div>
                        )}

                        {/* Opções Avançadas */}
                        <div className="mt-6 pt-6 border-t border-slate-700/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Settings size={16} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-400">Opções</span>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={splitSingle}
                                    onChange={(e) => setSplitSingle(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs text-slate-300">Dividir arquivo único</span>
                            </label>
                            {splitSingle && (
                                <input
                                    type="text"
                                    value={delimiter}
                                    onChange={(e) => setDelimiter(e.target.value)}
                                    placeholder="Delimitador"
                                    className="mt-3 w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                                />
                            )}
                        </div>
                    </div>

                    {/* AI Card */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                        <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                            <Brain size={28} className="text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">✨ IA Generativa</h3>
                        <p className="text-slate-400 mb-6 text-sm">
                            Crie apresentações completas apenas descrevendo o tema. Powered by Google Gemini.
                        </p>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                                <span className="text-xs text-slate-300">Slides:</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSlideCount(Math.max(3, slideCount - 1))}
                                        disabled={slideCount <= 3}
                                        className="h-7 w-7 p-0"
                                    >
                                        −
                                    </Button>
                                    <span className="text-sm font-bold text-white w-8 text-center">{slideCount}</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSlideCount(Math.min(12, slideCount + 1))}
                                        disabled={slideCount >= 12}
                                        className="h-7 w-7 p-0"
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Descreva o tema da sua apresentação..."
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm resize-none h-24 focus:outline-none focus:border-purple-500/50 transition-colors"
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleAIGenerate}
                            disabled={loading || !aiPrompt.trim()}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Wand2 size={16} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Gerando...' : '🪄 Gerar com IA'}
                        </button>
                    </div>

                    {/* Create Card */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                        <div className="w-14 h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-6">
                            <Plus size={28} className="text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">➕ Criar Slide</h3>
                        <p className="text-slate-400 mb-6 text-sm">
                            Editor visual para criar slides do zero com ferramentas profissionais e templates.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={handleCreateSlide}
                                className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition-colors"
                            >
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                        <Plus size={20} className="text-slate-500" />
                                    </div>
                                    <p className="text-xs font-medium">Slide Vazio</p>
                                </div>
                            </button>
                            <button
                                onClick={handleCreateSlide}
                                className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition-colors"
                            >
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                        <FolderOpen size={20} className="text-slate-500" />
                                    </div>
                                    <p className="text-xs font-medium">Template</p>
                                </div>
                            </button>
                        </div>
                        <button
                            onClick={handleCreateSlide}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-all text-sm font-medium"
                        >
                            ➕ Novo Projeto
                        </button>
                    </div>
                </div>
            </section>

            {/* Recent Projects */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Projetos Recentes</h3>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                        Ver todos →
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {recentProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all cursor-pointer group"
                        >
                            <div className={`w-full h-32 bg-gradient-to-br ${project.color} rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                <FolderOpen size={40} className="text-white/80" />
                            </div>
                            <h4 className="font-semibold mb-2">{project.name}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>{project.slides} slides • {project.updated}</span>
                                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={handleCreateSlide}
                        className="bg-slate-800/30 border-2 border-dashed border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                    >
                        <Plus size={40} className="text-slate-600 mb-3" />
                        <p className="text-slate-500 text-sm font-medium">Novo Projeto</p>
                        <p className="text-slate-600 text-xs mt-1">Comece uma nova apresentação</p>
                    </div>
                </div>
            </section>

            {/* Advanced Resources */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <h3 className="text-2xl font-bold mb-6 text-center">Recursos Avançados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain size={32} className="text-blue-400" />
                        </div>
                        <h4 className="font-semibold mb-2">IA Inteligente</h4>
                        <p className="text-sm text-slate-400">
                            Powered by Google Gemini para resultados precisos
                        </p>
                    </div>
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Palette size={32} className="text-purple-400" />
                        </div>
                        <h4 className="font-semibold mb-2">Design Profissional</h4>
                        <p className="text-sm text-slate-400">
                            Templates e layouts modernos
                        </p>
                    </div>
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={32} className="text-emerald-400" />
                        </div>
                        <h4 className="font-semibold mb-2">Colaboração</h4>
                        <p className="text-sm text-slate-400">
                            Compartilhe e edite em tempo real
                        </p>
                    </div>
                </div>
            </section>
        </div>

        <EditPanel
            open={editing}
            value={draftContent}
            onChange={setDraftContent}
            onCancel={() => {
                setEditing(false);
                setDraftContent('');
            }}
            onSave={() => { }}
            mode="create"
            onCreateFiles={handleCreateFiles}
        />

        {showSplitModal && (
            <InteractiveSplitModal
                filename={modalFilename}
                content={modalContent}
                onCancel={() => {
                    setShowSplitModal(false);
                    setModalContent('');
                    setModalFilename('');
                }}
                onConfirm={(parts) => {
                    const files = parts.map((p) => new File([p.content], `${p.name}.md`, { type: 'text/markdown' }));
                    processFiles(files);
                    setShowSplitModal(false);
                    setModalContent('');
                    setModalFilename('');
                }}
            />
        )}
    </>
);
}
