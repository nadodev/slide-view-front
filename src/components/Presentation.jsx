import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';
import UploadArea from './UploadArea';
import SlideViewer from './SlideViewer';
import Navigation from './Navigation';
import { Sparkles, AlertCircle } from 'lucide-react';
import '../styles/presentation.css';

const parseMarkdownSafe = (md) => {
  let html = marked.parse(md);
  html = html.replace(/<pre><code class="language-(\w+)">/g, '<pre class="code-block"><code class="hljs language-$1">');
  html = html.replace(/<pre><code class="hljs language-(\w+)">/g, '<pre class="code-block"><code class="hljs language-$1">');
  html = html.replace(/<pre><code>/g, '<pre class="code-block"><code class="hljs">');
  return html;
};

const Presentation = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const slideContentRef = useRef(null);
  const slideContainerRef = useRef(null);

  marked.setOptions({
    highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          return hljs.highlightAuto(code).value;
        }
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
  });

  const handleFileUpload = async (e, options = {}) => {
    const files = Array.from(e?.target?.files || []);
    if (files.length === 0) return;
    setLoading(true); setError('');
    try {
      if (files.length === 1 && options.splitSingle) {
        const file = files[0];
        const raw = await file.text();
        const marker = (options.delimiter || '---').trim();
        const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('^\\s*' + esc(marker) + '\\s*$', 'm');
        const parts = raw.split(new RegExp('\\r?\\n' + '\\s*' + esc(marker) + '\\s*' + '\\r?\\n'));
        const slidesParts = parts.length > 1 ? parts : raw.split(regex);
        const loadedSlides = slidesParts.map((content, i) => ({ name: `${file.name.replace('.md','')}-${i+1}`, content, html: parseMarkdownSafe(content) }));
        setSlides(loadedSlides);
        setCurrentSlide(0);
        return;
      }

      const sortedFiles = files.sort((a,b) => a.name.localeCompare(b.name));
      const loadedSlides = await Promise.all(sortedFiles.map(async (file) => {
        const content = await file.text();
        return { name: file.name.replace('.md',''), content, html: parseMarkdownSafe(content) };
      }));
      setSlides(loadedSlides);
      setCurrentSlide(0);
    } catch (err) {
      setError('Erro ao carregar arquivos: ' + (err?.message || err));
    } finally { setLoading(false); }
  };

  const nextSlide = () => { if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(currentSlide - 1); };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1); }
      if (e.key === 'ArrowLeft') { if (currentSlide > 0) setCurrentSlide(currentSlide - 1); }
      if (e.key === 'Home') setCurrentSlide(0);
      if (e.key === 'End') setCurrentSlide(slides.length - 1);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (slideContentRef.current && slides.length > 0) {
      slideContentRef.current.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
    }
  }, [currentSlide, slides]);

  useEffect(() => { if (slideContainerRef.current && slides.length > 0) slideContainerRef.current.scrollTo({ top:0, behavior:'smooth' }); }, [currentSlide, slides.length]);

  return (
    <div className="presentation-container">
      {slides.length === 0 ? (
        <div className="upload-wrapper">
          <UploadArea onFilesChange={handleFileUpload} loading={loading} />

          <div className="instructions">
            <h3>Instruções</h3>
            <ul>
              <li>Nomeie seus arquivos para controlar a ordem (ex: 01-intro.md, 02-conceitos.md)</li>
              <li>Use código com blocos de linguagem para destaque</li>
            </ul>
          </div>

          {loading && <div className="message"><Sparkles /> Carregando...</div>}
          {error && <div className="message error"><AlertCircle /> {error}</div>}
        </div>
      ) : (
        <>
          <SlideViewer html={slides[currentSlide].html} slideContainerRef={slideContainerRef} slideContentRef={slideContentRef} />

          <Navigation
            currentSlide={currentSlide}
            slidesLength={slides.length}
            onPrev={() => setCurrentSlide((s) => Math.max(0, s - 1))}
            onNext={() => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))}
            onReset={() => { setSlides([]); setCurrentSlide(0); setError(''); }}
          />
        </>
      )}
    </div>
  );
};

export default Presentation;
