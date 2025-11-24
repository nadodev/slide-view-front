import React from 'react';
import { Maximize2, Minimize2, Eye, EyeOff, X, Save, Plus, HelpCircle, Github } from 'lucide-react';
import { ExportDrawer } from './ExportDrawer';
import { useUIStore } from '../../stores/useUIStore';
import { useFileStore } from '../../stores/useFileStore';
import { useEditorStore } from '../../stores/useEditorStore';

type EditorHeaderProps = {
    onGitHub: () => void;
    onSave: () => void;
    onCancel: () => void;
    onExportMarkdown: () => void;
    onExportHTML: () => void;
    onExportPDF: () => void;
    onExportTXT: () => void;
    onExportXLS: () => void;
};

export const EditorHeader: React.FC<EditorHeaderProps> = ({
    onGitHub,
    onSave,
    onCancel,
    onExportMarkdown,
    onExportHTML,
    onExportPDF,
    onExportTXT,
    onExportXLS,
}) => {
    const showPreview = useUIStore((state) => state.showPreview);
    const editorFocus = useUIStore((state) => state.editorFocus);
    const showExport = useUIStore((state) => state.showExport);
    const setShowExport = useUIStore((state) => state.setShowExport);
    const setShowHelp = useUIStore((state) => state.setShowHelp);
    const setShowTemplates = useUIStore((state) => state.setShowTemplates);
    const toggleShowPreview = useUIStore((state) => state.toggleShowPreview);
    const toggleEditorFocus = useUIStore((state) => state.toggleEditorFocus);

    const mode = useEditorStore((state) => state.mode);

    const getFilesWithContent = useFileStore((state) => state.getFilesWithContent);
    const filesCount = getFilesWithContent().length;

    return (
        <header className="relative flex items-center justify-between px-8 py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <div>
                    <h2 className="text-lg font-bold text-white">
                        Editor de Markdown
                    </h2>
                    <p className="text-xs text-slate-400">
                        Edite e visualize em tempo real
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <ExportDrawer
                    show={showExport}
                    onClose={() => setShowExport(false)}
                    onExportMarkdown={onExportMarkdown}
                    onExportHTML={onExportHTML}
                    onExportPDF={onExportPDF}
                    onExportTXT={onExportTXT}
                    onExportXLS={onExportXLS}
                />

                <button
                    className="group px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50"
                    onClick={onGitHub}
                    title="GitHub (Pull/Push)"
                >
                    <Github
                        size={16}
                        className="transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium">GitHub</span>
                </button>

                <button
                    className="group px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50"
                    onClick={() => setShowHelp(true)}
                    title="Ajuda e Atalhos (Shift+Alt+H)"
                >
                    <HelpCircle
                        size={16}
                        className="transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium">Ajuda</span>
                </button>

                <button
                    className="group px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50"
                    onClick={() => setShowTemplates(true)}
                    title="Inserir template"
                >
                    <span className="text-sm font-medium">Templates</span>
                </button>

                {!editorFocus && (
                    <button
                        className={`group px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${showPreview
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/30"
                            : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50"
                            }`}
                        aria-pressed={showPreview}
                        onClick={toggleShowPreview}
                        title={showPreview ? "Ocultar preview" : "Mostrar preview"}
                    >
                        {showPreview ? (
                            <EyeOff
                                size={16}
                                className="transition-transform group-hover:scale-110"
                            />
                        ) : (
                            <Eye
                                size={16}
                                className="transition-transform group-hover:scale-110"
                            />
                        )}
                        <span className="text-sm font-medium">
                            {showPreview ? "Ocultar" : "Preview"}
                        </span>
                    </button>
                )}

                <button
                    className="group px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 text-slate-300 hover:text-white rounded-lg flex items-center gap-2 transition-all duration-200"
                    onClick={toggleEditorFocus}
                    title={editorFocus ? "Sair do foco do editor" : "Foco no editor"}
                >
                    {editorFocus ? (
                        <Minimize2
                            size={16}
                            className="transition-transform group-hover:scale-110"
                        />
                    ) : (
                        <Maximize2
                            size={16}
                            className="transition-transform group-hover:scale-110"
                        />
                    )}
                    <span className="text-sm font-medium">
                        {editorFocus ? "Normal" : "Expandir"}
                    </span>
                </button>

                <div className="w-px h-8 bg-slate-700/50 mx-1" />

                <button
                    className="group px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 text-slate-300 hover:text-white rounded-lg flex items-center gap-2 transition-all duration-200"
                    onClick={onCancel}
                    title="Cancelar (Esc)"
                >
                    <X
                        size={16}
                        className="transition-transform group-hover:rotate-90"
                    />
                    <span className="text-sm font-medium">Cancelar</span>
                </button>

                {mode === 'create' ? (
                    <button
                        className="group px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all duration-200 hover:scale-105"
                        onClick={onSave}
                        title="Criar slides dos arquivos .md"
                    >
                        <Plus
                            size={16}
                            className="transition-transform group-hover:scale-110"
                        />
                        <span className="text-sm">Criar Slides ({filesCount})</span>
                    </button>
                ) : (
                    <button
                        className="group px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg text-white font-medium flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:scale-105"
                        onClick={onSave}
                        title="Salvar (Ctrl+S ou Cmd+S)"
                    >
                        <Save
                            size={16}
                            className="transition-transform group-hover:scale-110"
                        />
                        <span className="text-sm">Salvar</span>
                    </button>
                )}
            </div>
        </header>
    );
};
