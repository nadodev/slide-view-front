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
    }, 100);
    return () => clearTimeout(timer);
  }, [currentHtml]);

  const progress = Math.min(100, Math.max(0, ((currentIndex + 1) / Math.max(1, slidesLength)) * 100));

  return (
    <div className="presenter" role="dialog" aria-label="Modo apresentador">
      <div className="presenter-bar">
        <div className="presenter-top">
          <div className="presenter-left">
            <div className="presenter-clock">{clockNow.toLocaleTimeString()}</div>
            <div className="presenter-index">{currentIndex + 1} / {slidesLength}</div>
          </div>

          <div className="presenter-center">
            <div className="presenter-progress" aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="presenter-actions">
            <button className="nav-btn" onClick={onPrev} aria-label="Slide anterior">Anterior</button>
            <button className="nav-btn" onClick={onNext} aria-label="Próximo slide">Próximo</button>
            <button className="exit-btn" onClick={onExit} aria-label="Sair do modo apresentador">Sair</button>
          </div>
        </div>
        <div className="presenter-help">
          <span>F: Fullscreen</span>
          <span>P: Presenter</span>
          <span>←/→ ou Espaço: navegar</span>
        </div>
      </div>

      <div className="presenter-main">
        <div className="presenter-current">
          <div className="slide-container">
            <div className="slide-content" dangerouslySetInnerHTML={{ __html: currentHtml }} />
          </div>
        </div>
      </div>
    </div>
  );
}
