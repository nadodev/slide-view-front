import React, { useState } from 'react';
import type { Slide } from './Presentation';
import { Play, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

type SlideListProps = {
  slides: Slide[];
  onReorder?: (s: Slide[]) => void;
  onStart: () => void;
  onRemove: (idx: number) => void;
  highContrast?: boolean;
  onToggleContrast?: () => void;
};

export default function SlideList({ slides, onReorder, onStart, onRemove, highContrast = false, onToggleContrast }: SlideListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
    setDragIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, destIdx: number) => {
    e.preventDefault();
    const src = Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(src)) return;
    if (src === destIdx) return;
    const copy = slides.slice();
    const [moved] = copy.splice(src, 1);
    copy.splice(destIdx, 0, moved);
    setDragIndex(null);
    if (typeof onReorder === 'function') onReorder(copy);
  };

  const stripTags = (html?: string): string => html ? html.replace(/<[^>]+>/g, '') : '';
  const shortPreview = (html?: string) => {
    const text = stripTags(html).replace(/\s+/g, ' ').trim();
    return text.length > 180 ? text.slice(0, 180) + '…' : text;
  };

  const move = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= slides.length || to >= slides.length) return;
    const copy = slides.slice();
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    if (typeof onReorder === 'function') onReorder(copy);
  };

  return (
    <div className="slide-list" role="list" aria-label="Lista de slides">
      <div className="slide-list-header">
        <h3 className="m-0">{slides.length} slide(s)</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="nav-btn" onClick={onStart} aria-label="Iniciar apresentação">
            <Play size={16} /> <span style={{ marginLeft: 6 }}>Iniciar</span>
          </button>
          <button
            className="reload-btn"
            style={{ marginLeft: 0 }}
            onClick={() => typeof onToggleContrast === 'function' && onToggleContrast()}
            aria-pressed={!!highContrast}
            aria-label="Alternar alto contraste"
          >
            {highContrast ? 'Contraste Padrão' : 'Alto Contraste'}
          </button>
        </div>
      </div>

      <div className="slide-thumbs">
        {slides.map((s: Slide, idx: number) => (
          <div
            key={s.name + '-' + idx}
            className={`thumb ${dragIndex === idx ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
            role="listitem"
            tabIndex={0}
            aria-label={`Slide ${idx + 1}: ${s.name}`}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'ArrowLeft') { move(idx, Math.max(0, idx - 1)); }
              if (e.key === 'ArrowRight') { move(idx, Math.min(slides.length - 1, idx + 1)); }
              if (e.key === 'Delete') { onRemove(idx); }
            }}
          >
            <div className="thumb-body">
              <div className="thumb-number" aria-hidden>{idx + 1}</div>
              <div className="thumb-preview">
                <div className="thumb-preview-text">
                  <pre aria-hidden className="m-0">{shortPreview(s.html)}</pre>
                </div>
              </div>
            </div>
            <div className="thumb-actions">
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  title="Mover para esquerda"
                  onClick={() => move(idx, Math.max(0, idx - 1))}
                  style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  title="Mover para direita"
                  onClick={() => move(idx, Math.min(slides.length - 1, idx + 1))}
                  style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <button
                title="Remover"
                onClick={() => onRemove(idx)}
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Trash2 size={14} /> Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}