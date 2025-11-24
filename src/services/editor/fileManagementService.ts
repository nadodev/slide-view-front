export type MarkdownFile = {
    id: string;
    name: string;
    content: string;
};

export const addNewFile = (files: MarkdownFile[]): MarkdownFile[] => {
    const newId = Date.now().toString();
    const newFile: MarkdownFile = {
        id: newId,
        name: `slide-${files.length + 1}.md`,
        content: ''
    };
    return [...files, newFile];
};

export const removeFile = (files: MarkdownFile[], id: string): MarkdownFile[] => {
    if (files.length === 1) return files;
    return files.filter(f => f.id !== id);
};

export const updateFileName = (
    files: MarkdownFile[],
    id: string,
    newName: string
): MarkdownFile[] => {
    return files.map(f =>
        f.id === id
            ? { ...f, name: newName.endsWith('.md') ? newName : `${newName}.md` }
            : f
    );
};

export const updateFileContent = (
    files: MarkdownFile[],
    id: string,
    content: string
): MarkdownFile[] => {
    return files.map(f =>
        f.id === id ? { ...f, content } : f
    );
};

export const getNewActiveFileId = (
    files: MarkdownFile[],
    removedId: string,
    currentActiveId: string
): string => {
    if (currentActiveId !== removedId) return currentActiveId;
    const newFiles = removeFile(files, removedId);
    return newFiles[0]?.id || '1';
};
