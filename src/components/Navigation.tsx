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
  onDuplicate?: () => void;
};

export default function Navigation({ currentSlide, slidesLength, onPrev, onNext, onReset, onEdit, onToggleFocus, focusMode, onExport, onDuplicate }: NavigationProps) {
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
            <button className="bg-white border px-3 py-1 rounded-md flex items-center gap-2 text-sm hover:shadow-sm" onClick={onEdit} aria-label="Editar slide atual" title="Editar">
              <Pencil size={16} /> <span>Editar</span>
            </button>
          )}

          {typeof onToggleFocus === 'function' && (
            <button className="bg-white border px-3 py-1 rounded-md flex items-center gap-2 text-sm hover:shadow-sm" onClick={onToggleFocus} aria-label={focusMode ? 'Sair do modo de foco' : 'Ativar modo de foco'} title="Foco">
              {focusMode ? <Eye size={16} /> : <EyeOff size={16} />} <span>{focusMode ? 'Sair foco' : 'Foco'}</span>
            </button>
          )}

          {typeof onExport === 'function' && (
            <button className="bg-white border px-3 py-1 rounded-md flex items-center gap-2 text-sm hover:shadow-sm" onClick={onExport} aria-label="Exportar todos os slides como .md" title="Exportar .md">
              <Download size={16} /> <span>Exportar</span>
            </button>
          )}

          {typeof onDuplicate === 'function' && (
            <button className="bg-white border px-3 py-1 rounded-md flex items-center gap-2 text-sm hover:shadow-sm" onClick={onDuplicate} aria-label="Duplicar slide atual (Ctrl+D)" title="Duplicar">
              <Copy size={16} /> <span>Duplicar</span>
            </button>
          )}

          <button className="reload-btn" onClick={onReset} title="Recarregar">Recarregar</button>
        </div>
      </div>
    </div>
  );
}
