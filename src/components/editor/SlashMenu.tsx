import React, { useRef } from 'react';
import type { SlashCommand } from '../../constants/editor/editorConstants';

type SlashMenuProps = {
    show: boolean;
    commands: SlashCommand[];
    selectedIndex: number;
    onSelect: (content: string) => void;
    onHover: (index: number) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
};

export const SlashMenu: React.FC<SlashMenuProps> = ({
    show,
    commands,
    selectedIndex,
    onSelect,
    onHover,
    textareaRef,
}) => {
    const slashMenuRef = useRef<HTMLDivElement | null>(null);

    if (!show || commands.length === 0 || !textareaRef.current) {
        return null;
    }

    const textarea = textareaRef.current;
    const rect = textarea.getBoundingClientRect();
    const scrollTop = textarea.scrollTop;
    const lineHeight = 28;
    const lines = textarea.value.substring(0, textarea.selectionStart).split('\n').length;
    const top = rect.top + (lines * lineHeight) - scrollTop + 40;
    const left = rect.left + 48;

    return (
        <div
            ref={slashMenuRef}
            className="fixed z-[10002] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
            style={{
                top,
                left,
                width: '320px',
                maxHeight: '400px',
            }}
        >
            <div className="p-2 border-b border-slate-700/50 bg-slate-900/50">
                <div className="text-xs text-slate-400 px-2">Comandos</div>
            </div>
            <div className="overflow-y-auto max-h-[360px] custom-scrollbar">
                {commands.map((cmd, index) => {
                    const Icon = cmd.icon;
                    return (
                        <button
                            key={cmd.id}
                            onClick={() => onSelect(cmd.content)}
                            className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${index === selectedIndex
                                    ? 'bg-blue-600/20 border-l-2 border-blue-500'
                                    : 'hover:bg-slate-700/50'
                                }`}
                            onMouseEnter={() => onHover(index)}
                        >
                            <div
                                className={`p-2 rounded-lg ${index === selectedIndex
                                        ? 'bg-blue-600/30'
                                        : 'bg-slate-700/50'
                                    }`}
                            >
                                <Icon
                                    size={18}
                                    className={index === selectedIndex ? 'text-blue-400' : 'text-slate-400'}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    className={`text-sm font-medium ${index === selectedIndex ? 'text-white' : 'text-slate-200'
                                        }`}
                                >
                                    {cmd.name}
                                </div>
                                <div className="text-xs text-slate-400 truncate">
                                    {cmd.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
