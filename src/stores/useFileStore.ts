import { create } from 'zustand';
import type { MarkdownFile } from '../services/editor/fileManagementService';
import {
    addNewFile,
    removeFile,
    updateFileName,
    updateFileContent,
    getNewActiveFileId,
} from '../services/editor/fileManagementService';

type FileStoreState = {
    files: MarkdownFile[];
    activeFileId: string;

    addFile: () => void;
    removeFile: (id: string) => void;
    updateFileName: (id: string, newName: string) => void;
    updateFileContent: (id: string, content: string) => void;
    setActiveFileId: (id: string) => void;
    setFiles: (files: MarkdownFile[]) => void;
    resetFiles: () => void;

    getActiveFile: () => MarkdownFile | undefined;
    getFilesWithContent: () => MarkdownFile[];
};

export const useFileStore = create<FileStoreState>((set, get) => ({
    files: [{ id: '1', name: 'slide-1.md', content: '' }],
    activeFileId: '1',

    addFile: () => {
        const newFiles = addNewFile(get().files);
        set({
            files: newFiles,
            activeFileId: newFiles[newFiles.length - 1].id
        });
    },

    removeFile: (id: string) => {
        const currentFiles = get().files;
        const currentActiveId = get().activeFileId;
        const newActiveId = getNewActiveFileId(currentFiles, id, currentActiveId);

        set({
            files: removeFile(currentFiles, id),
            activeFileId: newActiveId
        });
    },

    updateFileName: (id: string, newName: string) => {
        set({ files: updateFileName(get().files, id, newName) });
    },

    updateFileContent: (id: string, content: string) => {
        set({ files: updateFileContent(get().files, id, content) });
    },

    setActiveFileId: (id: string) => {
        set({ activeFileId: id });
    },

    setFiles: (files: MarkdownFile[]) => {
        set({
            files,
            activeFileId: files[0]?.id || '1'
        });
    },

    resetFiles: () => {
        set({
            files: [{ id: '1', name: 'slide-1.md', content: '' }],
            activeFileId: '1'
        });
    },

    getActiveFile: () => {
        return get().files.find(f => f.id === get().activeFileId);
    },

    getFilesWithContent: () => {
        return get().files.filter(f => f.content.trim());
    },
}));
