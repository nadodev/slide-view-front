import React from 'react';
import { HelpCircle, X } from 'lucide-react';

type HelpModalProps = {
    show: boolean;
    onClose: () => void;
};

export const HelpModal: React.FC<HelpModalProps> = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <HelpCircle size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Ajuda e Atalhos</h2>
                            <p className="text-sm text-slate-400">Atalhos de teclado e referências</p>
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
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                Atalhos do Teclado
                            </h3>
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <ShortcutItem shortcut="F9" description="Habilitar/desabilitar preview" />
                                        <ShortcutItem shortcut="F11" description="Tela inteira" />
                                        <ShortcutItem shortcut="Ctrl + 1~6" description="Inserir título 1~6" />
                                        <ShortcutItem shortcut="Ctrl + B" description="Negrito" />
                                        <ShortcutItem shortcut="Ctrl + I" description="Itálico" />
                                        <ShortcutItem shortcut="Ctrl + K" description="Código inline" />
                                        <ShortcutItem shortcut="Ctrl + L" description="Link" />
                                        <ShortcutItem shortcut="Ctrl + U" description="Lista não ordenada" />
                                        <ShortcutItem shortcut="Ctrl + H" description="Linha horizontal" />
                                        <ShortcutItem shortcut="Ctrl + Z" description="Desfazer" />
                                        <ShortcutItem shortcut="Ctrl + Y" description="Refazer" />
                                        <ShortcutItem shortcut="Ctrl + A" description="Selecionar tudo" />
                                    </div>
                                    <div className="space-y-2">
                                        <ShortcutItem shortcut="Ctrl + Shift + I" description="Inserir Imagem" />
                                        <ShortcutItem shortcut="Ctrl + Shift + O" description="Lista ordenada" />
                                        <ShortcutItem shortcut="Ctrl + Shift + Q" description="Blockquote" />
                                        <ShortcutItem shortcut="Ctrl + Shift + C" description="Código inline" />
                                        <ShortcutItem shortcut="Shift + Alt + C" description="Bloco de código" />
                                        <ShortcutItem shortcut="Shift + Alt + H" description="Abrir ajuda" />
                                        <ShortcutItem shortcut="Esc" description="Fechar modais" />
                                        <ShortcutItem shortcut="Ctrl + S" description="Salvar" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                Referências
                            </h3>
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                                <div className="p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                                    <h4 className="text-sm font-semibold text-white mb-1">Sintaxe Markdown</h4>
                                    <p className="text-xs text-slate-400">Use a barra de ferramentas ou os atalhos para aplicar formatação</p>
                                </div>
                                <div className="p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                                    <h4 className="text-sm font-semibold text-white mb-1">Diagramas Mermaid</h4>
                                    <p className="text-xs text-slate-400">
                                        Use blocos de código com <code className="bg-slate-900 px-1 rounded text-blue-400">```mermaid</code> para criar diagramas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        Pressione Esc para fechar
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

const ShortcutItem: React.FC<{ shortcut: string; description: string }> = ({ shortcut, description }) => (
    <div className="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded transition-colors">
        <span className="text-sm text-slate-300 font-mono">{shortcut}</span>
        <span className="text-sm text-slate-400">{description}</span>
    </div>
);
