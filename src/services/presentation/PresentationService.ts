import { Slide } from '../../components/slides/types';
import parseMarkdownSafe from '../../utils/markdown';

const STORAGE_KEY = 'presentation-slides';

// Pure functions for logic
const extractNotes = (text: string): { clean: string; notes: string[] } => {
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

const parseMarkdown = (content: string): string => {
    return parseMarkdownSafe(content);
};

export const presentationService = {
    loadSlides(): Slide[] {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading slides:', e);
        }
        return [];
    },

    saveSlides(slides: Slide[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
        } catch (e) {
            console.error('Error saving slides:', e);
        }
    },

    parseMarkdown,
    extractNotes,

    async createSlidesFromFiles(files: File[]): Promise<Slide[]> {
        return Promise.all(
            files.map(async (file) => {
                const text = await file.text();
                const { clean, notes } = extractNotes(text);
                return {
                    name: file.name.replace('.md', ''),
                    content: clean,
                    notes,
                    html: parseMarkdown(clean),
                };
            })
        );
    }
};
