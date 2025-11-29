import React, { useMemo } from 'react';
import { EDITOR_PLACEHOLDER } from '../../constants/editor/editorConstants';

type EditorTextareaProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onScroll?: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    lineNumbersRef: React.RefObject<HTMLDivElement | null>;
    placeholder?: string;
    ariaLabel?: string;
};

export const EditorTextarea: React.FC<EditorTextareaProps> = ({
    value,
    onChange,
    onKeyDown,
    onScroll,
    textareaRef,
    lineNumbersRef,
    placeholder = EDITOR_PLACEHOLDER,
    ariaLabel = "Editor de Markdown do slide",
}) => {
    const lineCount = useMemo(() => {
        if (!value) return 1;
        return Math.max(1, value.split('\n').length);
    }, [value]);

    return (
        <div className="flex-1 flex overflow-hidden">
            <div
                ref={lineNumbersRef}
                className="flex-shrink-0 w-12 bg-slate-900/50 border-r border-slate-700/50 text-right text-xs text-slate-500 font-mono py-20 px-2 overflow-hidden select-none"
                style={{ lineHeight: '1.75rem' }}
            >
                {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i + 1} className="leading-relaxed">
                        {i + 1}
                    </div>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onScroll={onScroll}
                spellCheck={false}
                placeholder={placeholder}
                aria-label={ariaLabel}
                className="flex-1 w-full h-full pt-20 px-6 pb-6 bg-slate-950 text-slate-100 font-mono text-[15px] leading-relaxed resize-none outline-none border-none overflow-auto custom-scrollbar placeholder:text-slate-600"
                style={{ lineHeight: '1.75rem' }}
            />
        </div>
    );
};
