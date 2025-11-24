
export const applyMarkdownFormat = (
    content: string,
    start: number,
    end: number,
    before: string,
    after: string = '',
    placeholder: string = ''
): { newContent: string; newCursorPos: number } => {
    const selectedText = content.substring(start, end);

    let newContent: string;
    let newCursorPos: number;

    if (selectedText) {
        newContent =
            content.substring(0, start) +
            before + selectedText + after +
            content.substring(end);
        newCursorPos = start + before.length + selectedText.length + after.length;
    } else {
        const placeholderText = placeholder || 'texto';
        newContent =
            content.substring(0, start) +
            before + placeholderText + after +
            content.substring(end);
        newCursorPos = start + before.length + placeholderText.length;
    }

    return { newContent, newCursorPos };
};

export const insertSlashCommand = (
    content: string,
    cursorPos: number,
    commandContent: string
): { newContent: string; newCursorPos: number } => {
    let slashPos = cursorPos - 1;
    while (slashPos >= 0 && content[slashPos] !== '/' && content[slashPos] !== '\n') {
        slashPos--;
    }

    if (slashPos < 0 || content[slashPos] !== '/') {
        return { newContent: content, newCursorPos: cursorPos };
    }

    const beforeSlash = content.substring(0, slashPos);
    const afterCursor = content.substring(cursorPos);
    const newContent = beforeSlash + commandContent + afterCursor;
    const newCursorPos = slashPos + commandContent.length;

    return { newContent, newCursorPos };
};

export const insertTemplate = (
    content: string,
    start: number,
    end: number,
    templateContent: string
): { newContent: string; newCursorPos: number } => {
    const newContent =
        content.substring(0, start) +
        templateContent +
        content.substring(end);
    const newCursorPos = start + templateContent.length;

    return { newContent, newCursorPos };
};

export const shouldShowSlashMenu = (
    content: string,
    cursorPos: number
): { show: boolean; query: string } => {
    const textBeforeCursor = content.substring(0, cursorPos);
    const lastLine = textBeforeCursor.split('\n').pop() || '';

    if (lastLine === '/' || (lastLine.startsWith('/') && !lastLine.includes(' '))) {
        return { show: true, query: lastLine.substring(1) };
    }

    if (lastLine.startsWith('/') && lastLine.includes(' ')) {
        return { show: false, query: '' };
    }

    if (!lastLine.startsWith('/')) {
        return { show: false, query: '' };
    }

    return { show: true, query: lastLine.substring(1) };
};
