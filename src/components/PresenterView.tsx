import { useEffect, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';

type PresenterViewProps = {
  currentHtml?: string;
  currentIndex: number;
  slidesLength: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
};

export default function PresenterView({ currentHtml = '', currentIndex, slidesLength, onNext, onPrev, onExit }: PresenterViewProps) {
  const [clockNow, setClockNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setClockNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.presenter .slide-content pre code').forEach((b: Element) => hljs.highlightElement(b as HTMLElement));
    }, 60);
    return () => clearTimeout(timer);
  }, [currentHtml]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-4 p-4 bg-presenter-bg text-presenter-text" role="dialog" aria-label="Modo apresentador">
      <div className="bg-presenter-surface rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-3 items-center gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="font-mono font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-1 to-primary-2">{clockNow.toLocaleTimeString()}</div>
            <div className="text-sm text-presenter-muted px-3 py-1 bg-white/5 rounded-md">{currentIndex + 1} / {slidesLength}</div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl bg-white/5 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-1 to-primary-2" style={{ width: `${Math.min(100, Math.max(0, ((currentIndex + 1) / Math.max(1, slidesLength)) * 100))}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button className="px-3 py-2 rounded-md bg-gradient-to-br from-primary-1 to-primary-2 text-white" onClick={onPrev} aria-label="Slide anterior">Anterior</button>
            <button className="px-3 py-2 rounded-md bg-gradient-to-br from-primary-1 to-primary-2 text-white" onClick={onNext} aria-label="Próximo slide">Próximo</button>
            <button className="px-3 py-2 rounded-md bg-gray-800 text-white border border-white/10" onClick={onExit} aria-label="Sair do modo apresentador">Sair</button>
          </div>
        </div>
        <div className="text-sm text-presenter-muted flex gap-6">
          <span>F: Fullscreen</span>
          <span>P: Presenter</span>
          <span>←/→ ou Espaço: navegar</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="bg-white rounded-md shadow-sm p-4 min-h-[60vh]">
          <div className="prose max-w-full text-text" dangerouslySetInnerHTML={{ __html: currentHtml }} />
        </div>
      </div>
    </div>
  );
}
