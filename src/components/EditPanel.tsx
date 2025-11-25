import React, { useEffect, useRef, useMemo } from "react";
import parseMarkdownSafe from "../utils/markdown";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../shared/components/ui/resizable";
import { useMermaid } from "../hooks/useMermaid";
import { toast } from "sonner";
import GitHubIntegrationModal from "./GitHubIntegrationModal";

import { EditorHeader } from "./editor/EditorHeader";
import { EditorToolbar } from "./editor/EditorToolbar";
import { EditorTextarea } from "./editor/EditorTextarea";
import { EditorPreview } from "./editor/EditorPreview";
import { EditorFooter } from "./editor/EditorFooter";
import { FileList } from "./editor/FileList";
import { SlashMenu } from "./editor/SlashMenu";
import { HelpModal } from "./editor/HelpModal";
import { TemplatesModal } from "./editor/TemplatesModal";
import { EditorStyles } from "./editor/EditorStyles";

import type { MarkdownFile } from "../services/editor/fileManagementService";
import {
  applyMarkdownFormat,
  insertSlashCommand as insertSlashCommandService,
  insertTemplate as insertTemplateService,
  shouldShowSlashMenu,
} from "../services/editor/markdownService";
import {
  exportAsMarkdown,
  exportAsHTML,
  exportAsPDF,
  exportAsTXT,
  exportAsXLS,
} from "../services/editor/exportService";

import { useSlashCommands } from "../hooks/editor/useSlashCommands";
import { useKeyboardShortcuts } from "../hooks/editor/useKeyboardShortcuts";
import { useEditorSync, useLineNumbersSync } from "../hooks/editor/useEditorSync";

import { useFileStore } from "../stores/useFileStore";
import { useUIStore } from "../stores/useUIStore";
import { useEditorStore } from "../stores/useEditorStore";

type EditPanelProps = {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave?: () => void;  // Made optional
  editorFocus?: boolean;
  onToggleEditorFocus?: () => void;
  mode?: 'edit' | 'create';
  onCreateFiles?: (files: MarkdownFile[]) => void;
};

export default function EditPanel({
  open,
  value,
  onChange,
  onCancel,
  onSave,
  editorFocus = false,
  onToggleEditorFocus,
  mode = 'edit',
  onCreateFiles,
}: EditPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef1 = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef2 = useRef<HTMLDivElement | null>(null);
  const lineNumbersRef3 = useRef<HTMLDivElement | null>(null);

  const files = useFileStore((state) => state.files);
  const activeFileId = useFileStore((state) => state.activeFileId);
  const getActiveFile = useFileStore((state) => state.getActiveFile);
  const getFilesWithContent = useFileStore((state) => state.getFilesWithContent);
  const updateFileContent = useFileStore((state) => state.updateFileContent);
  const setFiles = useFileStore((state) => state.setFiles);
  const resetFiles = useFileStore((state) => state.resetFiles);

  const showPreview = useUIStore((state) => state.showPreview);
  const editorFocusState = useUIStore((state) => state.editorFocus);
  const showGitHub = useUIStore((state) => state.showGitHub);
  const setShowGitHub = useUIStore((state) => state.setShowGitHub);
  const setShowHelp = useUIStore((state) => state.setShowHelp);
  const setShowTemplates = useUIStore((state) => state.setShowTemplates);
  const toggleShowPreview = useUIStore((state) => state.toggleShowPreview);
  const toggleEditorFocus = useUIStore((state) => state.toggleEditorFocus);
  const setEditorFocus = useUIStore((state) => state.setEditorFocus);

  const editorMode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);

  const slashCommands = useSlashCommands();

  const focusOn = onToggleEditorFocus ? editorFocus : editorFocusState;

  const editorSync = useEditorSync({
    enabled: showPreview,
    focusOn,
  });

  useLineNumbersSync(textareaRef, [lineNumbersRef1, lineNumbersRef2, lineNumbersRef3]);

  const activeFile = useMemo(() => {
    return files.find(f => f.id === activeFileId);
  }, [files, activeFileId]);

  const activeContent = useMemo(() => {
    if (editorMode === 'create' && activeFile) {
      return activeFile.content;
    }
    return value;
  }, [editorMode, activeFile, value]);

  // Preview HTML
  const previewHtml = useMemo(() => {
    try {
      return parseMarkdownSafe(activeContent || "");
    } catch {
      return "<p style='color:#f87171'>Erro ao renderizar preview.</p>";
    }
  }, [activeContent]);

  useMermaid(previewHtml);

  const handleApplyFormat = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = activeContent;

    const { newContent, newCursorPos } = applyMarkdownFormat(
      currentContent,
      start,
      end,
      before,
      after,
      placeholder
    );

    if (editorMode === 'create' && activeFile) {
      updateFileContent(activeFileId, newContent);
    } else {
      onChange(newContent);
    }

    setTimeout(() => {
      if (textarea) {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const handleInsertSlashCommand = (commandContent: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const currentContent = activeContent;

    const { newContent, newCursorPos } = insertSlashCommandService(
      currentContent,
      cursorPos,
      commandContent
    );

    if (editorMode === 'create' && activeFile) {
      updateFileContent(activeFileId, newContent);
    } else {
      onChange(newContent);
    }

    setTimeout(() => {
      if (textarea) {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);

    slashCommands.resetSlashMenu();
  };

  const handleInsertTemplate = (templateContent: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = activeContent;

    const { newContent, newCursorPos } = insertTemplateService(
      currentContent,
      start,
      end,
      templateContent
    );

    if (editorMode === 'create' && activeFile) {
      updateFileContent(activeFileId, newContent);
    } else {
      onChange(newContent);
    }

    setTimeout(() => {
      if (textarea) {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const handleExportMarkdown = () => {
    const filename = editorMode === 'create' && activeFile ? activeFile.name : 'slide.md';
    exportAsMarkdown(activeContent, filename);
  };

  const handleExportHTML = () => {
    const filename = editorMode === 'create' && activeFile
      ? activeFile.name.replace('.md', '.html')
      : 'slide.html';
    exportAsHTML(previewHtml, filename);
  };

  const handleExportPDF = () => {
    exportAsPDF(previewHtml);
  };

  const handleExportTXT = () => {
    const filename = editorMode === 'create' && activeFile
      ? activeFile.name.replace('.md', '.txt')
      : 'slide.txt';
    exportAsTXT(activeContent, filename);
  };

  const handleExportXLS = () => {
    const filename = editorMode === 'create' && activeFile
      ? activeFile.name.replace('.md', '.csv')
      : 'slide.csv';
    exportAsXLS(activeContent, filename);
  };

  const handleCreateFiles = () => {
    if (onCreateFiles) {
      onCreateFiles(getFilesWithContent());
      // onCancel(); // Removed to prevent overriding navigation
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (editorMode === 'create' && activeFile) {
      updateFileContent(activeFileId, newValue);
    } else {
      onChange(newValue);
    }

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
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashCommands.showSlashMenu) {
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
    }
  };

  useKeyboardShortcuts(
    {
      onSave: editorMode === 'create' ? handleCreateFiles : (onSave || (() => { })),
      onCancel,
      onTogglePreview: toggleShowPreview,
      onToggleFocus: onToggleEditorFocus || toggleEditorFocus,
      onShowHelp: () => setShowHelp(true),
      onShowTemplates: () => setShowTemplates(true),
      onApplyFormat: handleApplyFormat,
    },
    {
      enabled: open,
      showTemplates: useUIStore.getState().showTemplates,
      showHelp: useUIStore.getState().showHelp,
    }
  );

  const handleGitHubFilesLoaded = (loadedFiles: MarkdownFile[]) => {
    setFiles(loadedFiles);
    toast.success(`${loadedFiles.length} arquivo(s) carregado(s) do GitHub`);
  };

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Editar slide"
      data-preview={showPreview ? "on" : "off"}
    >
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
        <EditorHeader
          onGitHub={() => setShowGitHub(true)}
          onSave={editorMode === 'create' ? handleCreateFiles : (onSave || (() => { }))}
          onCancel={onCancel}
          onExportMarkdown={handleExportMarkdown}
          onExportHTML={handleExportHTML}
          onExportPDF={handleExportPDF}
          onExportTXT={handleExportTXT}
          onExportXLS={handleExportXLS}
        />

        <div className="flex-1 overflow-hidden flex">
          {editorMode === 'create' && <FileList />}

          <div className="flex-1 overflow-hidden">
            {focusOn ? (
              <div className="h-full flex flex-col">
                <EditorToolbar onFormat={handleApplyFormat} />
                <div className="absolute top-16 left-4 z-10">
                  <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
                    📝 Markdown
                  </span>
                </div>
                <EditorTextarea
                  value={activeContent}
                  onChange={handleContentChange}
                  onKeyDown={handleTextareaKeyDown}
                  onScroll={() => editorSync.onEditorScroll(textareaRef.current, previewScrollRef.current)}
                  textareaRef={textareaRef}
                  lineNumbersRef={lineNumbersRef1}
                />
              </div>
            ) : showPreview ? (
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="h-full flex flex-col relative">
                    <EditorToolbar onFormat={handleApplyFormat} />
                    <div className="absolute top-16 left-4 z-10">
                      <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
                        📝 Markdown {editorMode === 'create' && activeFile && `- ${activeFile.name}`}
                      </span>
                    </div>
                    <EditorTextarea
                      value={activeContent}
                      onChange={handleContentChange}
                      onKeyDown={handleTextareaKeyDown}
                      onScroll={() => editorSync.onEditorScroll(textareaRef.current, previewScrollRef.current)}
                      textareaRef={textareaRef}
                      lineNumbersRef={lineNumbersRef2}
                    />
                  </div>
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-slate-700/30 hover:bg-slate-600/50 transition-all duration-200 relative group border-l border-r border-slate-600/20 hover:border-slate-500/40">
                  <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-slate-500/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-slate-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </ResizableHandle>

                <ResizablePanel defaultSize={50} minSize={30}>
                  <EditorPreview
                    html={previewHtml}
                    previewScrollRef={previewScrollRef}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="h-full flex flex-col">
                <EditorToolbar onFormat={handleApplyFormat} />
                <div className="absolute top-16 left-4 z-10">
                  <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
                    📝 Markdown {editorMode === 'create' && activeFile && `- ${activeFile.name}`}
                  </span>
                </div>
                <EditorTextarea
                  value={activeContent}
                  onChange={handleContentChange}
                  onKeyDown={handleTextareaKeyDown}
                  onScroll={() => editorSync.onEditorScroll(textareaRef.current, previewScrollRef.current)}
                  textareaRef={textareaRef}
                  lineNumbersRef={lineNumbersRef3}
                />
              </div>
            )}
          </div>
        </div>

        <EditorFooter
          characterCount={value.length}
          showPreview={showPreview}
          focusOn={focusOn}
        />
      </div>

      <SlashMenu
        show={slashCommands.showSlashMenu}
        commands={slashCommands.filteredSlashCommands}
        selectedIndex={slashCommands.selectedSlashIndex}
        onSelect={handleInsertSlashCommand}
        onHover={slashCommands.setSelectedSlashIndex}
        textareaRef={textareaRef}
      />

      <HelpModal />
      <TemplatesModal onSelectTemplate={handleInsertTemplate} />
      <EditorStyles />

      <GitHubIntegrationModal
        isOpen={showGitHub}
        onClose={() => setShowGitHub(false)}
        onFilesLoaded={handleGitHubFilesLoaded}
        currentFiles={files}
      />
    </div>
  );
}
