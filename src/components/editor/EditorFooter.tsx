import React from 'react';

type EditorFooterProps = {
    characterCount: number;
    showPreview: boolean;
    focusOn: boolean;
};

export const EditorFooter: React.FC<EditorFooterProps> = ({
    characterCount,
    showPreview,
    focusOn,
}) => {
    return (
        <footer className="px-8 py-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">
                            Ctrl+S
                        </kbd>
                        <span>Salvar</span>
                    </div>
                    <div className="w-px h-4 bg-slate-700/50" />
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">
                            Esc
                        </kbd>
                        <span>Cancelar</span>
                    </div>
                    {!focusOn && showPreview && (
                        <>
                            <div className="w-px h-4 bg-slate-700/50" />
                            <span className="text-emerald-400 font-medium">
                                Preview sincronizado
                            </span>
                            <div className="w-px h-4 bg-slate-700/50" />
                            <span className="text-blue-400 font-medium flex items-center gap-1">
                                Redimensionável
                            </span>
                        </>
                    )}
                </div>
                <div className="text-slate-500">{characterCount} caracteres</div>
            </div>
        </footer>
    );
};
