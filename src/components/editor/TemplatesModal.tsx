import React from 'react';
import { Sparkles, X } from 'lucide-react';
import type { Template } from '../../constants/editor/editorConstants';

type TemplatesModalProps = {
    show: boolean;
    onClose: () => void;
    templates: Template[];
    onSelectTemplate: (content: string) => void;
};

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
    show,
    onClose,
    templates,
    onSelectTemplate,
}) => {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-4xl max-h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <Sparkles size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Templates Prontos</h2>
                            <p className="text-sm text-slate-400">Clique em um template para inserir no cursor</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
                        title="Fechar (Esc)"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {templates.map((template) => {
                            const Icon = template.icon;
                            return (
                                <button
                                    key={template.id}
                                    onClick={() => onSelectTemplate(template.content)}
                                    className="group p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200 text-left hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-slate-700/50 group-hover:bg-blue-600/20 rounded-lg transition-colors">
                                            <Icon size={18} className="text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                                {template.name}
                                            </div>
                                            <div className="text-xs text-slate-400 line-clamp-2">
                                                {template.description}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        {templates.length} templates disponíveis
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
