import React from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import type { MarkdownFile } from '../../services/editor/fileManagementService';

type FileListProps = {
    files: MarkdownFile[];
    activeFileId: string;
    onFileSelect: (id: string) => void;
    onFileAdd: () => void;
    onFileRemove: (id: string) => void;
    onFileRename: (id: string, newName: string) => void;
};

export const FileList: React.FC<FileListProps> = ({
    files,
    activeFileId,
    onFileSelect,
    onFileAdd,
    onFileRemove,
    onFileRename,
}) => {
    return (
        <div className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
            <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Arquivos .md</h3>
                    <Button
                        size="sm"
                        onClick={onFileAdd}
                        className="h-7 px-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus size={14} />
                    </Button>
                </div>
                <p className="text-xs text-slate-400">Cada arquivo será um slide</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className={`p-3 border-b border-slate-700/30 cursor-pointer transition-colors ${activeFileId === file.id
                                ? 'bg-blue-600/20 border-l-2 border-l-blue-500'
                                : 'hover:bg-slate-700/30'
                            }`}
                        onClick={() => onFileSelect(file.id)}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={14} className="text-slate-400" />
                            <input
                                type="text"
                                value={file.name.replace('.md', '')}
                                onChange={(e) => onFileRename(file.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-transparent text-xs text-white font-medium border-none outline-none focus:bg-slate-700/50 px-1 rounded"
                                placeholder="Nome do arquivo"
                            />
                            {files.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFileRemove(file.id);
                                    }}
                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                        <div className="text-xs text-slate-500">
                            {file.content.trim() ? `${file.content.split('\n').length} linhas` : 'Vazio'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
