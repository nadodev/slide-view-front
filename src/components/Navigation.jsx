import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Navigation({ currentSlide, slidesLength, onPrev, onNext, onReset }) {
  return (
    <div className="navigation">
      <button className="nav-btn" onClick={onPrev} disabled={currentSlide === 0}>
        <ChevronLeft size={20} />
        Anterior
      </button>

      <span className="slide-counter">{currentSlide + 1} / {slidesLength}</span>

      <button className="nav-btn" onClick={onNext} disabled={currentSlide === slidesLength - 1}>
        Próximo
        <ChevronRight size={20} />
      </button>

      <button className="reload-btn" onClick={onReset}>Recarregar</button>
    </div>
  );
}
