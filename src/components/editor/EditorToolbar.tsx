import React from 'react';
import {
    Heading1,
    Heading2,
    Bold,
    Italic,
    List,
    Type,
    Quote,
    Code,
    FileText,
    Table,
    Link2,
    Image,
    Minimize2,
} from 'lucide-react';

type EditorToolbarProps = {
    onFormat: (before: string, after?: string, placeholder?: string) => void;
};

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onFormat }) => {
    return (
        <div className="flex items-center gap-1 px-3 py-2 bg-slate-800/80 border-b border-slate-700/50 flex-shrink-0 overflow-x-auto">
            <button
                onClick={() => onFormat('# ', '', 'Título')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Título (H1)"
            >
                <Heading1 size={16} />
            </button>
            <button
                onClick={() => onFormat('## ', '', 'Subtítulo')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Subtítulo (H2)"
            >
                <Heading2 size={16} />
            </button>
            <div className="w-px h-6 bg-slate-700/50 mx-1" />
            <button
                onClick={() => onFormat('**', '**')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white font-bold"
                title="Negrito"
            >
                <Bold size={16} />
            </button>
            <button
                onClick={() => onFormat('*', '*')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white italic"
                title="Itálico"
            >
                <Italic size={16} />
            </button>
            <div className="w-px h-6 bg-slate-700/50 mx-1" />
            <button
                onClick={() => onFormat('- ', '')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Lista com Bullets"
            >
                <List size={16} />
            </button>
            <button
                onClick={() => onFormat('1. ', '')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Lista Numerada"
            >
                <Type size={16} />
            </button>
            <button
                onClick={() => onFormat('> ', '')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Citação"
            >
                <Quote size={16} />
            </button>
            <div className="w-px h-6 bg-slate-700/50 mx-1" />
            <button
                onClick={() => onFormat('`', '`')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Código Inline"
            >
                <Code size={16} />
            </button>
            <button
                onClick={() => onFormat('```\n', '\n```')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Bloco de Código"
            >
                <FileText size={16} />
            </button>
            <button
                onClick={() => onFormat('| ', ' |', 'Coluna')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Tabela"
            >
                <Table size={16} />
            </button>
            <button
                onClick={() => onFormat('[', '](url)', 'Link')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Link"
            >
                <Link2 size={16} />
            </button>
            <button
                onClick={() => onFormat('![', '](url)', 'Imagem')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Imagem"
            >
                <Image size={16} />
            </button>
            <div className="w-px h-6 bg-slate-700/50 mx-1" />
            <button
                onClick={() => onFormat('---\n', '')}
                className="p-2 hover:bg-slate-700/50 rounded transition-colors text-slate-300 hover:text-white"
                title="Divisor"
            >
                <Minimize2 size={16} />
            </button>
        </div>
    );
};
