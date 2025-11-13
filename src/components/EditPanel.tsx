import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

type EditPanelProps = {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
  editorFocus?: boolean;
  onToggleEditorFocus?: () => void;
};

export default function EditPanel({ open, value, onChange, onCancel, onSave, editorFocus = false, onToggleEditorFocus }: EditPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [internalFocus, setInternalFocus] = useState(false);
  const focusOn = onToggleEditorFocus ? editorFocus : internalFocus;

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      const key = (e as KeyboardEvent & { key?: string }).key || '';
      if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 's') {
        e.preventDefault();
        onSave();
      }
      if (key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handler as EventListener);
    return () => window.removeEventListener('keydown', handler as EventListener);
  }, [open, onSave, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-end z-50" role="dialog" aria-modal="true" aria-label="Editar slide">
      <div className={`w-full max-w-[560px] h-full bg-[#0f172a] text-white flex flex-col ${focusOn ? 'w-full' : ''}`}>
        <header className="flex items-center justify-between p-4 border-b border-white/6">
          <h2 className="text-lg font-semibold">Editar Markdown do Slide</h2>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 bg-white/5 rounded-md flex items-center gap-2"
              onClick={() => (onToggleEditorFocus ? onToggleEditorFocus() : setInternalFocus(v => !v))}
              title={focusOn ? 'Sair do foco do editor' : 'Foco no editor'}
            >
              {focusOn ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="text-sm">{focusOn ? 'Sair foco' : 'Foco'}</span>
            </button>
            <button className="px-3 py-1 bg-white/5 rounded-md" onClick={onCancel} title="Cancelar (Esc)">Cancelar</button>
            <button className="px-3 py-1 bg-gradient-to-br from-primary-1 to-primary-2 rounded-md text-white" onClick={onSave} title="Salvar (Ctrl+S ou Cmd+S)">Salvar</button>
          </div>
        </header>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder="Edite o Markdown do slide aqui..."
          aria-label="Editor de Markdown do slide"
          className="flex-1 w-full p-4 bg-[#0b1220] text-white font-mono text-sm resize-none outline-none border-none"
        />
        <footer className="p-3 border-t border-white/6">
          <span className="text-xs text-white/70">Dica: Ctrl+S para salvar, Esc para cancelar</span>
        </footer>
      </div>
    </div>
  );
}
