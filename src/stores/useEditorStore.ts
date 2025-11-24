import { create } from 'zustand';

type EditorStoreState = {
    content: string;
    mode: 'edit' | 'create';

    setContent: (content: string) => void;
    setMode: (mode: 'edit' | 'create') => void;
    resetEditor: () => void;
};

export const useEditorStore = create<EditorStoreState>((set) => ({
    content: '',
    mode: 'edit',

    setContent: (content: string) => set({ content }),
    setMode: (mode: 'edit' | 'create') => set({ mode }),

    resetEditor: () => set({
        content: '',
        mode: 'edit'
    }),
}));
