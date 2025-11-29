import React from 'react';
import { Eye } from 'lucide-react';

type EditorPreviewProps = {
    html: string;
    previewScrollRef: React.RefObject<HTMLDivElement | null>;
    onScroll?: () => void;
};

export const EditorPreview: React.FC<EditorPreviewProps> = ({
    html,
    previewScrollRef,
    onScroll,
}) => {
    return (
        <div
            ref={previewScrollRef}
            className="h-full flex flex-col overflow-auto bg-gradient-to-br from-slate-900 to-slate-800 custom-scrollbar"
            onScroll={onScroll}
        >
            <div className="sticky top-0 z-10 px-6 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-semibold text-white">
                        Preview ao Vivo
                    </h3>
                </div>
                <span className="px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    Sync
                </span>
            </div>
            <div className="p-8">
                {html.trim() ? (
                    <div
                        className="markdown-preview"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
                            <Eye size={24} className="text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-500 italic">
                            Nada para pré-visualizar ainda
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                            Digite markdown no editor para ver o resultado aqui
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
