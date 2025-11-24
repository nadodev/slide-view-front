import { useEffect, useRef } from 'react';

type SyncOptions = {
    enabled: boolean;
    focusOn: boolean;
};

export const useEditorSync = (options: SyncOptions) => {
    const suppressEditorSync = useRef(false);
    const suppressPreviewSync = useRef(false);

    const sync = (from: HTMLElement, to: HTMLElement) => {
        const maxFrom = from.scrollHeight - from.clientHeight;
        if (maxFrom <= 0) return;
        const ratio = from.scrollTop / maxFrom;
        const maxTo = to.scrollHeight - to.clientHeight;
        to.scrollTop = ratio * maxTo;
    };

    const onEditorScroll = (
        editorEl: HTMLTextAreaElement | null,
        previewEl: HTMLDivElement | null
    ) => {
        if (!options.enabled || options.focusOn) return;
        if (suppressEditorSync.current) return;
        if (!editorEl || !previewEl) return;

        suppressPreviewSync.current = true;
        sync(editorEl, previewEl);
        requestAnimationFrame(() => {
            suppressPreviewSync.current = false;
        });
    };

    const onPreviewScroll = (
        editorEl: HTMLTextAreaElement | null,
        previewEl: HTMLDivElement | null
    ) => {
        if (!options.enabled || options.focusOn) return;
        if (suppressPreviewSync.current) return;
        if (!editorEl || !previewEl) return;

        suppressEditorSync.current = true;
        sync(previewEl, editorEl);
        requestAnimationFrame(() => {
            suppressEditorSync.current = false;
        });
    };

    return {
        onEditorScroll,
        onPreviewScroll,
    };
};

export const useLineNumbersSync = (
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    lineNumbersRefs: React.RefObject<HTMLDivElement>[]
) => {
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const syncScroll = () => {
            lineNumbersRefs.forEach(ref => {
                if (ref.current) {
                    ref.current.scrollTop = textarea.scrollTop;
                }
            });
        };

        textarea.addEventListener('scroll', syncScroll);
        return () => textarea.removeEventListener('scroll', syncScroll);
    }, [textareaRef, lineNumbersRefs]);
};
