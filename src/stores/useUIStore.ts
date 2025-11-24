import { create } from 'zustand';

type UIStoreState = {
    showHelp: boolean;
    showTemplates: boolean;
    showExport: boolean;
    showGitHub: boolean;

    showPreview: boolean;
    editorFocus: boolean;

    setShowHelp: (show: boolean) => void;
    setShowTemplates: (show: boolean) => void;
    setShowExport: (show: boolean) => void;
    setShowGitHub: (show: boolean) => void;
    setShowPreview: (show: boolean) => void;
    setEditorFocus: (focus: boolean) => void;
    toggleShowPreview: () => void;
    toggleEditorFocus: () => void;
    toggleShowHelp: () => void;
    toggleShowTemplates: () => void;
    resetUI: () => void;
};

const initialState = {
    showHelp: false,
    showTemplates: false,
    showExport: false,
    showGitHub: false,
    showPreview: true,
    editorFocus: false,
};

export const useUIStore = create<UIStoreState>((set) => ({
    ...initialState,

    setShowHelp: (show: boolean) => set({ showHelp: show }),
    setShowTemplates: (show: boolean) => set({ showTemplates: show }),
    setShowExport: (show: boolean) => set({ showExport: show }),
    setShowGitHub: (show: boolean) => set({ showGitHub: show }),
    setShowPreview: (show: boolean) => set({ showPreview: show }),
    setEditorFocus: (focus: boolean) => set({ editorFocus: focus }),

    toggleShowPreview: () => set((state) => ({ showPreview: !state.showPreview })),
    toggleEditorFocus: () => set((state) => ({ editorFocus: !state.editorFocus })),
    toggleShowHelp: () => set((state) => ({ showHelp: !state.showHelp })),
    toggleShowTemplates: () => set((state) => ({ showTemplates: !state.showTemplates })),

    resetUI: () => set(initialState),
}));
