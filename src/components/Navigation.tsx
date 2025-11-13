import { ChevronLeft, ChevronRight, Pencil, Eye, EyeOff, Download, Copy } from 'lucide-react';

type NavigationProps = {
  currentSlide: number;
  slidesLength: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onEdit?: () => void;
  onToggleFocus?: () => void;
  focusMode?: boolean;
  onExport?: () => void;
  onExportPdf?: () => void;
  onDuplicate?: () => void;
};

export default function Navigation({ currentSlide, slidesLength, onPrev, onNext, onReset, onEdit, onToggleFocus, focusMode, onExport, onExportPdf, onDuplicate }: NavigationProps) {
  return (
    <div className="navigation">
      <div style={{ width: '96%', maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="nav-btn"
            onClick={onPrev}
            disabled={currentSlide === 0}
            aria-label="Slide anterior"
            title="Anterior (←)"
          >
            <ChevronLeft size={18} />
            <span style={{ marginLeft: 8 }}>Anterior</span>
          </button>

          <span className="slide-counter" aria-live="polite">{currentSlide + 1} / {slidesLength}</span>

          <button
            className="nav-btn"
            onClick={onNext}
            disabled={currentSlide === slidesLength - 1}
            aria-label="Próximo slide"
            title="Próximo (→)"
          >
            <span style={{ marginRight: 8 }}>Próximo</span>
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {typeof onEdit === 'function' && (
            <button className="nav-btn" onClick={onEdit} aria-label="Editar slide atual" title="Editar" style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Pencil size={14} /> <span style={{ fontSize: 13 }}>Editar</span>
            </button>
          )}

          {typeof onToggleFocus === 'function' && (
            <button className="nav-btn" onClick={onToggleFocus} aria-label={focusMode ? 'Sair do modo de foco' : 'Ativar modo de foco'} title="Foco" style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {focusMode ? <Eye size={14} /> : <EyeOff size={14} />} <span style={{ fontSize: 13 }}>{focusMode ? 'Sair foco' : 'Foco'}</span>
            </button>
          )}

          {typeof onExport === 'function' && (
            <button className="nav-btn" onClick={onExport} aria-label="Exportar todos os slides como .md" title="Exportar .md" style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Download size={14} /> <span style={{ fontSize: 13 }}>Exportar</span>
            </button>
          )}

          {typeof onExportPdf === 'function' && (
            <button className="nav-btn" onClick={onExportPdf} aria-label="Exportar slide atual como PDF" title="Exportar PDF" style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/><path d="M12 12v6"/><path d="M9 15l3-3 3 3"/></svg>
              <span style={{ fontSize: 13 }}>PDF</span>
            </button>
          )}

          {typeof onDuplicate === 'function' && (
            <button className="nav-btn" onClick={onDuplicate} aria-label="Duplicar slide atual (Ctrl+D)" title="Duplicar" style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Copy size={14} /> <span style={{ fontSize: 13 }}>Duplicar</span>
            </button>
          )}

          <button className="reload-btn" onClick={onReset} title="Recarregar">Recarregar</button>
        </div>
      </div>
    </div>
  );
}
