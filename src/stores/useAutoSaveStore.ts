/**
 * @fileoverview Store global para status de auto-save
 */

import { create } from 'zustand';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveState {
    status: SaveStatus;
    lastSaved: Date | null;
    error: string | null;
    
    // Actions
    setStatus: (status: SaveStatus) => void;
    setSaved: () => void;
    setError: (error: string) => void;
    reset: () => void;
}

export const useAutoSaveStore = create<AutoSaveState>((set) => ({
    status: 'idle',
    lastSaved: null,
    error: null,
    
    setStatus: (status) => set({ status, error: null }),
    
    setSaved: () => set({ 
        status: 'saved', 
        lastSaved: new Date(),
        error: null 
    }),
    
    setError: (error) => set({ 
        status: 'error', 
        error 
    }),
    
    reset: () => set({ 
        status: 'idle', 
        lastSaved: null, 
        error: null 
    }),
}));

