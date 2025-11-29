/**
 * @fileoverview Hook para lógica do painel de edição
 * Extrai toda a lógica do EditPanel para melhor separação de concerns
 */

import { useRef, useMemo, useCallback, useEffect, type ChangeEvent } from 'react';
import { parseMarkdown, applyMarkdownFormat, insertSlashCommand, shouldShowSlashMenu } from '../../core';
import { useFileStore } from '../../stores/useFileStore';
import { useUIStore } from '../../stores/useUIStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useSlashCommands } from './useSlashCommands';
import { useEditorSync, useLineNumbersSync } from './useEditorSync';
import { useMermaid } from '../useMermaid';
import {
  exportAsMarkdown,
  exportAsHTML,
  exportAsPDF,
  exportAsTXT,
  exportAsXLS,
} from '../../services/editor/exportService';
import { insertTemplate as insertTemplateService } from '../../services/editor/markdownService';
import type { MarkdownFile } from '../../core';

// ============================================
// TYPES
// ============================================

interface UseEditorPanelProps {
  value: string;
  onChange: (v: string) => void;
  onSave?: () => void;
  onCancel: () => void;
  onCreateFiles?: (files: MarkdownFile[]) => void;
  editorFocus?: boolean;
  onToggleEditorFocus?: () => void;
  mode?: 'edit' | 'create';
  open: boolean;
}

interface UseEditorPanelReturn {
  // Refs
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  previewScrollRef: React.RefObject<HTMLDivElement | null>;
  lineNumbersRefs: React.RefObject<HTMLDivElement | null>[];
  
  // State
  activeContent: string;
  previewHtml: string;
  activeFile: MarkdownFile | undefined;
  focusOn: boolean;
  editorMode: 'edit' | 'create';
  
  // Store State
  showPreview: boolean;
  showGitHub: boolean;
  files: MarkdownFile[];
  
  // Slash Commands
  slashCommands: ReturnType<typeof useSlashCommands>;
  
  // Handlers
  handleApplyFormat: (before: string, after?: string, placeholder?: string) => void;
  handleInsertSlashCommand: (commandContent: string) => void;
  handleInsertTemplate: (templateContent: string) => void;
  handleContentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleCreateFiles: () => void;
  handleGitHubFilesLoaded: (files: MarkdownFile[]) => void;
  handleEditorScroll: () => void;
  
  // Export Handlers
  handleExportMarkdown: () => void;
  handleExportHTML: () => void;
  handleExportPDF: () => void;
  handleExportTXT: () => void;
  handleExportXLS: () => void;
  
  // Actions
  setShowGitHub: (show: boolean) => void;
  toggleShowPreview: () => void;
  setShowHelp: (show: boolean) => void;
  setShowTemplates: (show: boolean) => void;
  getSaveHandler: () => () => void;
}

// ============================================
// HOOK
// ============================================

export function useEditorPanel({
  value,
  onChange,
  onSave,
  onCancel,
  onCreateFiles,
  editorFocus = false,
  onToggleEditorFocus,
  mode = 'edit',
  open,
}: UseEditorPanelProps): UseEditorPanelReturn {
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef1 = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef2 = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef3 = useRef<HTMLDivElement | null>(null);
  const lineNumbersRefs = [lineNumbersRef1, lineNumbersRef2, lineNumbersRef3];

  // File Store
  const files = useFileStore((state) => state.files);
  const activeFileId = useFileStore((state) => state.activeFileId);
  const getFilesWithContent = useFileStore((state) => state.getFilesWithContent);
  const updateFileContent = useFileStore((state) => state.updateFileContent);
  const setFiles = useFileStore((state) => state.setFiles);
  const resetFiles = useFileStore((state) => state.resetFiles);

  // UI Store
  const showPreview = useUIStore((state) => state.showPreview);
  const editorFocusState = useUIStore((state) => state.editorFocus);
  const showGitHub = useUIStore((state) => state.showGitHub);
  const setShowGitHub = useUIStore((state) => state.setShowGitHub);
  const setShowHelp = useUIStore((state) => state.setShowHelp);
  const setShowTemplates = useUIStore((state) => state.setShowTemplates);
  const toggleShowPreview = useUIStore((state) => state.toggleShowPreview);
  const setEditorFocus = useUIStore((state) => state.setEditorFocus);

  // Editor Store
  const editorMode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);

  // Custom Hooks
  const slashCommands = useSlashCommands();
  const focusOn = onToggleEditorFocus ? editorFocus : editorFocusState;

  const editorSync = useEditorSync({
    enabled: showPreview,
    focusOn,
  });

  useLineNumbersSync(textareaRef, lineNumbersRefs);

  // ============================================
  // MEMOIZED VALUES
  // ============================================

  const activeFile = useMemo(() => {
    return files.find(f => f.id === activeFileId);
  }, [files, activeFileId]);

  const activeContent = useMemo(() => {
    if (editorMode === 'create' && activeFile) {
      return activeFile.content;
    }
    return value;
  }, [editorMode, activeFile, value]);

  const previewHtml = useMemo(() => {
    try {
      const { html } = parseMarkdown(activeContent || '');
      return html;
    } catch {
      return "<p style='color:#f87171'>Erro ao renderizar preview.</p>";
    }
  }, [activeContent]);

  // Initialize Mermaid
  useMermaid(previewHtml);

  // ============================================
  // UPDATE CONTENT HELPER
  // ============================================

  const updateContent = useCallback((newContent: string) => {
    if (editorMode === 'create' && activeFile) {
      updateFileContent(activeFileId, newContent);
    } else {
      onChange(newContent);
    }
  }, [editorMode, activeFile, activeFileId, updateFileContent, onChange]);

  const setCursorPosition = useCallback((pos: number) => {
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      }
    }, 0);
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const handleApplyFormat = useCallback((
    before: string,
    after: string = '',
    placeholder: string = ''
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { newContent, newCursorPos } = applyMarkdownFormat(
      activeContent,
      textarea.selectionStart,
      textarea.selectionEnd,
      before,
      after,
      placeholder
    );

    updateContent(newContent);
    setCursorPosition(newCursorPos);
  }, [activeContent, updateContent, setCursorPosition]);

  const handleInsertSlashCommand = useCallback((commandContent: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { newContent, newCursorPos } = insertSlashCommand(
      activeContent,
      textarea.selectionStart,
      commandContent
    );

    updateContent(newContent);
    setCursorPosition(newCursorPos);
    slashCommands.resetSlashMenu();
  }, [activeContent, updateContent, setCursorPosition, slashCommands]);

  const handleInsertTemplate = useCallback((templateContent: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { newContent, newCursorPos } = insertTemplateService(
      activeContent,
      textarea.selectionStart,
      textarea.selectionEnd,
      templateContent
    );

    updateContent(newContent);
    setCursorPosition(newCursorPos);
  }, [activeContent, updateContent, setCursorPosition]);

  const handleContentChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    updateContent(newValue);

    const cursorPos = e.target.selectionStart;
    const { show, query } = shouldShowSlashMenu(newValue, cursorPos);

    if (show) {
      slashCommands.setShowSlashMenu(true);
      slashCommands.setSlashQuery(query);
      slashCommands.setSelectedSlashIndex(0);
    } else {
      slashCommands.setShowSlashMenu(false);
      slashCommands.setSlashQuery('');
    }
  }, [updateContent, slashCommands]);

  const handleTextareaKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!slashCommands.showSlashMenu) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      slashCommands.selectNextCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      slashCommands.selectPreviousCommand();
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const selectedCommand = slashCommands.getSelectedCommand();
      if (selectedCommand) {
        handleInsertSlashCommand(selectedCommand.content);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      slashCommands.resetSlashMenu();
    }
  }, [slashCommands, handleInsertSlashCommand]);

  const handleCreateFiles = useCallback(() => {
    if (onCreateFiles) {
      onCreateFiles(getFilesWithContent());
    }
  }, [onCreateFiles, getFilesWithContent]);

  const handleGitHubFilesLoaded = useCallback((loadedFiles: MarkdownFile[]) => {
    setFiles(loadedFiles);
  }, [setFiles]);

  const handleEditorScroll = useCallback(() => {
    editorSync.onEditorScroll(textareaRef.current, previewScrollRef.current);
  }, [editorSync]);

  // ============================================
  // EXPORT HANDLERS
  // ============================================

  const handleExportMarkdown = useCallback(() => {
    const filename = editorMode === 'create' && activeFile ? activeFile.name : 'slide.md';
    exportAsMarkdown(activeContent, filename);
  }, [editorMode, activeFile, activeContent]);

  const handleExportHTML = useCallback(() => {
    const filename = editorMode === 'create' && activeFile
      ? activeFile.name.replace('.md', '.html')
      : 'slide.html';
    exportAsHTML(previewHtml, filename);
  }, [editorMode, activeFile, previewHtml]);

  const handleExportPDF = useCallback(() => {
    exportAsPDF(previewHtml);
  }, [previewHtml]);

  const handleExportTXT = useCallback(() => {
    const filename = editorMode === 'create' && activeFile
      ? activeFile.name.replace('.md', '.txt')
      : 'slide.txt';
    exportAsTXT(activeContent, filename);
  }, [editorMode, activeFile, activeContent]);

  const handleExportXLS = useCallback(() => {
    const filename = editorMode === 'create' && activeFile
      ? activeFile.name.replace('.md', '.csv')
      : 'slide.csv';
    exportAsXLS(activeContent, filename);
  }, [editorMode, activeFile, activeContent]);

  const getSaveHandler = useCallback(() => {
    return editorMode === 'create' ? handleCreateFiles : (onSave || (() => {}));
  }, [editorMode, handleCreateFiles, onSave]);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  useEffect(() => {
    if (onToggleEditorFocus) {
      setEditorFocus(editorFocus);
    }
  }, [editorFocus, onToggleEditorFocus, setEditorFocus]);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
    if (open && editorMode === 'create' && files.length === 0) {
      resetFiles();
    }
  }, [open, editorMode, files.length, resetFiles]);

  useEffect(() => {
    const previewEl = previewScrollRef.current;
    if (!previewEl) return;

    const handleScroll = () => {
      editorSync.onPreviewScroll(textareaRef.current, previewEl);
    };

    previewEl.addEventListener("scroll", handleScroll);
    return () => previewEl.removeEventListener("scroll", handleScroll);
  }, [showPreview, focusOn, value, editorSync]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Refs
    textareaRef,
    previewScrollRef,
    lineNumbersRefs,
    
    // State
    activeContent,
    previewHtml,
    activeFile,
    focusOn,
    editorMode,
    
    // Store State
    showPreview,
    showGitHub,
    files,
    
    // Slash Commands
    slashCommands,
    
    // Handlers
    handleApplyFormat,
    handleInsertSlashCommand,
    handleInsertTemplate,
    handleContentChange,
    handleTextareaKeyDown,
    handleCreateFiles,
    handleGitHubFilesLoaded,
    handleEditorScroll,
    
    // Export Handlers
    handleExportMarkdown,
    handleExportHTML,
    handleExportPDF,
    handleExportTXT,
    handleExportXLS,
    
    // Actions
    setShowGitHub,
    toggleShowPreview,
    setShowHelp,
    setShowTemplates,
    getSaveHandler,
  };
}

export default useEditorPanel;

