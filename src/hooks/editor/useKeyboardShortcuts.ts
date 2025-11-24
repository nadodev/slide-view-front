import { useEffect } from 'react';

type KeyboardShortcutHandlers = {
    onSave: () => void;
    onCancel: () => void;
    onTogglePreview?: () => void;
    onToggleFocus?: () => void;
    onShowHelp?: () => void;
    onShowTemplates?: () => void;
    onApplyFormat?: (before: string, after?: string, placeholder?: string) => void;
};

type KeyboardShortcutOptions = {
    enabled: boolean;
    showTemplates: boolean;
    showHelp: boolean;
};

export const useKeyboardShortcuts = (
    handlers: KeyboardShortcutHandlers,
    options: KeyboardShortcutOptions
) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!options.enabled) return;

            const key = e.key.toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;
            const shift = e.shiftKey;
            const alt = e.altKey;

            if (key === "escape") {
                e.preventDefault();
                if (options.showTemplates && handlers.onShowTemplates) {
                    handlers.onShowTemplates();
                    return;
                }
                if (options.showHelp && handlers.onShowHelp) {
                    handlers.onShowHelp();
                    return;
                }
                handlers.onCancel();
                return;
            }

            if (ctrl && key === "s" && !shift && !alt) {
                e.preventDefault();
                handlers.onSave();
                return;
            }

            if (ctrl && !shift && !alt && handlers.onApplyFormat) {
                switch (key) {
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                        e.preventDefault();
                        const level = parseInt(key);
                        handlers.onApplyFormat(`${'#'.repeat(level)} `, '', `Título ${level}`);
                        return;
                    case "b":
                        e.preventDefault();
                        handlers.onApplyFormat('**', '**');
                        return;
                    case "i":
                        e.preventDefault();
                        handlers.onApplyFormat('*', '*');
                        return;
                    case "k":
                        e.preventDefault();
                        handlers.onApplyFormat('`', '`');
                        return;
                    case "l":
                        e.preventDefault();
                        handlers.onApplyFormat('[', '](url)', 'Link');
                        return;
                    case "u":
                        e.preventDefault();
                        handlers.onApplyFormat('- ', '');
                        return;
                    case "h":
                        e.preventDefault();
                        handlers.onApplyFormat('---\n', '');
                        return;
                    case "a":
                        // Deixa o comportamento padrão de selecionar tudo
                        return;
                    case "z":
                        // Deixa o comportamento padrão de desfazer
                        return;
                    case "y":
                        // Deixa o comportamento padrão de refazer
                        return;
                }
            }

            if (ctrl && shift && !alt && handlers.onApplyFormat) {
                switch (key) {
                    case "i":
                        e.preventDefault();
                        handlers.onApplyFormat('![', '](url)', 'Imagem');
                        return;
                    case "o":
                        e.preventDefault();
                        handlers.onApplyFormat('1. ', '');
                        return;
                    case "q":
                        e.preventDefault();
                        handlers.onApplyFormat('> ', '');
                        return;
                    case "c":
                        e.preventDefault();
                        handlers.onApplyFormat('`', '`');
                        return;
                }
            }

            if (shift && alt && !ctrl) {
                switch (key) {
                    case "c":
                        e.preventDefault();
                        if (handlers.onApplyFormat) {
                            handlers.onApplyFormat('```\n', '\n```');
                        }
                        return;
                    case "h":
                        e.preventDefault();
                        if (handlers.onShowHelp) {
                            handlers.onShowHelp();
                        }
                        return;
                }
            }

            if (key === "f9") {
                e.preventDefault();
                if (handlers.onTogglePreview) {
                    handlers.onTogglePreview();
                }
                return;
            }

            if (key === "f11") {
                e.preventDefault();
                if (handlers.onToggleFocus) {
                    handlers.onToggleFocus();
                }
                return;
            }
        };

        window.addEventListener("keydown", handler as EventListener);
        return () => window.removeEventListener("keydown", handler as EventListener);
    }, [handlers, options]);
};
