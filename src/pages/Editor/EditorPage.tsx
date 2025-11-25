import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EditPanel from '../../components/EditPanel';
import parseMarkdownSafe from '../../utils/markdown';
import type { MarkdownFile } from '../../services/editor/fileManagementService';
import { useFileStore } from '../../stores/useFileStore';

export default function EditorPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [draftContent, setDraftContent] = useState('');

    const extractNotes = (text: string) => {
        const notes: string[] = [];
        if (!text) return { clean: "", notes };
        const cleaned = text.replace(
            /<!--\s*note:\s*([\s\S]*?)-->/gi,
            (_match, note) => {
                if (note && note.trim()) notes.push(note.trim());
                return "";
            },
        );
        return { clean: cleaned.trim(), notes };
    };

    const handleCreateFiles = (files: MarkdownFile[]) => {
        console.log('🎯 EditorPage: handleCreateFiles called with files:', files);

        const slides = files.map((file) => {
            const { clean, notes } = extractNotes(file.content);
            return {
                name: file.name.replace('.md', ''),
                content: clean,
                notes,
                html: parseMarkdownSafe(clean),
            };
        });

        console.log('🎯 EditorPage: Generated slides:', slides);
        console.log('🎯 EditorPage: Navigating to /app with state');
        navigate('/app', { state: { slides } });
    };

    const handleCancel = () => {
        console.log('🎯 EditorPage: Navigating to /create');
        useFileStore.getState().resetFiles();
        navigate('/create');
    };

    return (
        <EditPanel
            open={true}
            value={draftContent}
            onChange={setDraftContent}
            onCancel={handleCancel}
            mode="create"
            onCreateFiles={handleCreateFiles}
        />
    );
}
