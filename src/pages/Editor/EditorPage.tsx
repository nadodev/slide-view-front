/**
 * @fileoverview Página do Editor
 * Refatorado para usar core
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarkdownFile, extractNotes, parseMarkdown } from '../../core';
import EditPanel from '../../components/EditPanel';
import { useFileStore } from '../../stores/useFileStore';

export default function EditorPage() {
    const navigate = useNavigate();
    const [draftContent, setDraftContent] = useState('');

    const handleCreateFiles = (files: MarkdownFile[]) => {
        const slides = files.map((file) => {
            const { clean, notes } = extractNotes(file.content);
            const { html } = parseMarkdown(clean);
            return {
                name: file.name.replace('.md', ''),
                content: clean,
                notes,
                html,
            };
        });

        navigate('/app', { state: { slides } });
    };

    const handleCancel = () => {
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
