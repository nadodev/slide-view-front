/**
 * @fileoverview Painel de Edição de Markdown
 * Refatorado para usar useEditorPanel hook
 */

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../shared/components/ui/resizable";
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

import { useEditorPanel } from "../hooks/editor/useEditorPanel";
import { useKeyboardShortcuts } from "../hooks/editor/useKeyboardShortcuts";
import { useUIStore } from "../stores/useUIStore";
import type { MarkdownFile } from "../core";

// ============================================
// TYPES
// ============================================

interface EditPanelProps {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave?: () => void;
  editorFocus?: boolean;
  onToggleEditorFocus?: () => void;
  mode?: 'edit' | 'create';
  onCreateFiles?: (files: MarkdownFile[]) => void;
}

// ============================================
// COMPONENT
// ============================================

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
  const editor = useEditorPanel({
    value,
    onChange,
    onSave,
    onCancel,
    onCreateFiles,
    editorFocus,
    onToggleEditorFocus,
    mode,
    open,
  });

  const toggleEditorFocus = useUIStore((state) => state.toggleEditorFocus);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      onSave: editor.getSaveHandler(),
      onCancel,
      onTogglePreview: editor.toggleShowPreview,
      onToggleFocus: onToggleEditorFocus || toggleEditorFocus,
      onShowHelp: () => editor.setShowHelp(true),
      onShowTemplates: () => editor.setShowTemplates(true),
      onApplyFormat: editor.handleApplyFormat,
    },
    {
      enabled: open,
      showTemplates: useUIStore.getState().showTemplates,
      showHelp: useUIStore.getState().showHelp,
    }
  );

  // Handle GitHub files loaded
  const handleGitHubFilesLoaded = (loadedFiles: MarkdownFile[]) => {
    editor.handleGitHubFilesLoaded(loadedFiles);
    toast.success(`${loadedFiles.length} arquivo(s) carregado(s) do GitHub`);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Editar slide"
      data-preview={editor.showPreview ? "on" : "off"}
    >
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
        {/* Header */}
        <EditorHeader
          onGitHub={() => editor.setShowGitHub(true)}
          onSave={editor.getSaveHandler()}
          onCancel={onCancel}
          onExportMarkdown={editor.handleExportMarkdown}
          onExportHTML={editor.handleExportHTML}
          onExportPDF={editor.handleExportPDF}
          onExportTXT={editor.handleExportTXT}
          onExportXLS={editor.handleExportXLS}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {editor.editorMode === 'create' && <FileList />}

          <div className="flex-1 overflow-hidden">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer */}
        <EditorFooter
          characterCount={value.length}
          showPreview={editor.showPreview}
          focusOn={editor.focusOn}
        />
      </div>

      {/* Modals & Overlays */}
      <SlashMenu
        show={editor.slashCommands.showSlashMenu}
        commands={editor.slashCommands.filteredSlashCommands}
        selectedIndex={editor.slashCommands.selectedSlashIndex}
        onSelect={editor.handleInsertSlashCommand}
        onHover={editor.slashCommands.setSelectedSlashIndex}
        textareaRef={editor.textareaRef}
      />

      <HelpModal />
      <TemplatesModal onSelectTemplate={editor.handleInsertTemplate} />
      <EditorStyles />

      <GitHubIntegrationModal
        isOpen={editor.showGitHub}
        onClose={() => editor.setShowGitHub(false)}
        onFilesLoaded={handleGitHubFilesLoaded}
        currentFiles={editor.files}
      />
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface EditorContentProps {
  editor: ReturnType<typeof useEditorPanel>;
}

function EditorContent({ editor }: EditorContentProps) {
  const {
    focusOn,
    showPreview,
    editorMode,
    activeFile,
    activeContent,
    previewHtml,
    textareaRef,
    previewScrollRef,
    lineNumbersRefs,
    handleApplyFormat,
    handleContentChange,
    handleTextareaKeyDown,
    handleEditorScroll,
  } = editor;

  // Common textarea props
  const textareaProps = {
    value: activeContent,
    onChange: handleContentChange,
    onKeyDown: handleTextareaKeyDown,
    onScroll: handleEditorScroll,
    textareaRef,
  };

  // Label showing current file
  const FileLabel = ({ refIndex }: { refIndex: number }) => (
    <div className="absolute top-16 left-4 z-10">
      <span className="px-3 py-1 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
        📝 Markdown {editorMode === 'create' && activeFile && `- ${activeFile.name}`}
      </span>
    </div>
  );

  // Focus mode - only editor
  if (focusOn) {
    return (
      <div className="h-full flex flex-col">
        <EditorToolbar onFormat={handleApplyFormat} />
        <FileLabel refIndex={0} />
        <EditorTextarea {...textareaProps} lineNumbersRef={lineNumbersRefs[0]} />
      </div>
    );
  }

  // Split view - editor + preview
  if (showPreview) {
    return (
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col relative">
            <EditorToolbar onFormat={handleApplyFormat} />
            <FileLabel refIndex={1} />
            <EditorTextarea {...textareaProps} lineNumbersRef={lineNumbersRefs[1]} />
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-slate-700/30 hover:bg-slate-600/50 transition-all duration-200 relative group border-l border-r border-slate-600/20 hover:border-slate-500/40">
          <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-slate-500/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-slate-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </ResizableHandle>

        <ResizablePanel defaultSize={50} minSize={30}>
          <EditorPreview html={previewHtml} previewScrollRef={previewScrollRef} />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  // No preview - only editor
  return (
    <div className="h-full flex flex-col">
      <EditorToolbar onFormat={handleApplyFormat} />
      <FileLabel refIndex={2} />
      <EditorTextarea {...textareaProps} lineNumbersRef={lineNumbersRefs[2]} />
    </div>
  );
}
