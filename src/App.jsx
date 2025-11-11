import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';

const MarkdownPresentation = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const slideContentRef = useRef(null);
  const slideContainerRef = useRef(null);

  // Configura o marked para usar highlight.js
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

  // Processa Markdown com marked
  const parseMarkdown = (md) => {
    let html = marked.parse(md);
    
    // Adiciona classes para code blocks com linguagem
    html = html.replace(/<pre><code class="language-(\w+)">/g, '<pre class="code-block"><code class="hljs language-$1">');
    html = html.replace(/<pre><code class="hljs language-(\w+)">/g, '<pre class="code-block"><code class="hljs language-$1">');
    html = html.replace(/<pre><code>/g, '<pre class="code-block"><code class="hljs">');
    
    return html;
  };

  // Carrega arquivos via input
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Ordena arquivos por nome
      const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
      
      const loadedSlides = await Promise.all(
        sortedFiles.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name.replace('.md', ''),
            content: content,
            html: parseMarkdown(content)
          };
        })
      );
      
      setSlides(loadedSlides);
      setCurrentSlide(0);
    } catch (err) {
      setError('Erro ao carregar arquivos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Navegação
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(currentSlide + 1);
        }
      }
      if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) {
          setCurrentSlide(currentSlide - 1);
        }
      }
      if (e.key === 'Home') setCurrentSlide(0);
      if (e.key === 'End') setCurrentSlide(slides.length - 1);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, slides.length]);

  // Aplica highlight quando o slide muda
  useEffect(() => {
    if (slideContentRef.current && slides.length > 0) {
      slideContentRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [currentSlide, slides]);

  // Scroll para o topo quando muda de slide
  useEffect(() => {
    if (slideContainerRef.current && slides.length > 0) {
      slideContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentSlide, slides.length]);

  return (
    <div className="presentation-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .presentation-container {
          width: 100vw;
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .upload-screen {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          padding: 70px;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05);
          text-align: center;
          max-width: 650px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .upload-screen h1 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
          font-size: 2.8em;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .upload-screen p {
          color: #666;
          margin-bottom: 30px;
          font-size: 1.1em;
          line-height: 1.6;
        }

        .upload-area {
          border: 3px dashed #667eea;
          border-radius: 18px;
          padding: 50px 40px;
          margin: 30px 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 200px;
        }

        .upload-area::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .upload-area:hover::before {
          left: 100%;
        }

        .upload-area:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-color: #764ba2;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }

        .upload-area input {
          display: none;
        }

        .upload-icon {
          color: #667eea;
          margin-bottom: 20px;
          display: block;
        }

        .upload-text-primary {
          margin: 0;
          font-size: 1.15em;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .upload-text-secondary {
          margin: 0;
          font-size: 0.95em;
          color: #718096;
        }

        .upload-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 25px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .upload-btn:hover {
          transform: scale(1.05);
        }

        .instructions {
          background: #fff8e1;
          border-left: 4px solid #ffd700;
          padding: 20px;
          margin-top: 30px;
          border-radius: 10px;
          text-align: left;
        }

        .instructions h3 {
          color: #f57c00;
          margin-bottom: 10px;
        }

        .instructions ul {
          margin-left: 20px;
          color: #666;
        }

        .instructions li {
          margin: 8px 0;
        }

        .slide-container {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          width: 90%;
          max-width: 1400px;
          height: 85vh;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05);
          padding: 80px;
          overflow-y: auto;
          animation: slideIn 0.5s ease-out;
          position: relative;
        }

        .slide-container::-webkit-scrollbar {
          width: 10px;
        }

        .slide-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .slide-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        .slide-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-content {
          max-width: 100%;
        }

        .slide-content h1 {
          color: #667eea;
          font-size: 3.5em;
          margin-bottom: 30px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .slide-content h2 {
          color: #764ba2;
          font-size: 2.3em;
          margin: 40px 0 25px 0;
          border-bottom: 3px solid;
          border-image: linear-gradient(90deg, #667eea, #764ba2) 1;
          padding-bottom: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .slide-content h3 {
          color: #667eea;
          font-size: 1.7em;
          margin: 30px 0 18px 0;
          font-weight: 600;
        }

        .slide-content h4 {
          color: #764ba2;
          font-size: 1.3em;
          margin: 25px 0 15px 0;
          font-weight: 600;
        }

        .slide-content p {
          font-size: 1.15em;
          line-height: 1.9;
          color: #2d3748;
          margin: 20px 0;
          font-weight: 400;
        }

        .slide-content ul, .slide-content ol {
          margin: 20px 0;
          padding-left: 40px;
        }

        .slide-content ul li {
          margin: 12px 0;
          line-height: 1.8;
          font-size: 1.1em;
          color: #2d3748;
          position: relative;
          list-style: none;
        }

        .slide-content ul li::before {
          content: '▸';
          color: #667eea;
          font-weight: bold;
          position: absolute;
          left: -25px;
          font-size: 1.2em;
        }

        .slide-content ol li {
          margin: 12px 0;
          line-height: 1.8;
          font-size: 1.1em;
          color: #2d3748;
        }

        .slide-content blockquote {
          background: linear-gradient(120deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.12) 100%);
          padding: 30px 35px;
          border-radius: 16px;
          margin: 30px 0;
          border-left: 5px solid;
          border-image: linear-gradient(180deg, #667eea, #764ba2) 1;
          font-size: 1.25em;
          font-style: italic;
          color: #4a5568;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .slide-content pre.code-block {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 25px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 25px 0;
          font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.95em;
          line-height: 1.6;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          position: relative;
        }

        .slide-content pre.code-block::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 12px 12px 0 0;
        }

        .slide-content pre code {
          background: transparent;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
          color: inherit;
        }

        .slide-content code {
          font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .slide-content code:not(pre code) {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
          padding: 4px 10px;
          border-radius: 6px;
          color: #667eea;
          font-size: 0.9em;
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .slide-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-radius: 12px;
          overflow: hidden;
        }

        .slide-content table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 600;
        }

        .slide-content table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e2e8f0;
          color: #2d3748;
        }

        .slide-content table tr:last-child td {
          border-bottom: none;
        }

        .slide-content table tr:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .slide-content strong {
          color: #667eea;
          font-weight: 700;
        }

        .slide-content em {
          color: #764ba2;
          font-style: italic;
        }

        .slide-content hr, .slide-content .separator {
          height: 3px;
          background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
          margin: 40px 0;
          border: none;
          border-radius: 2px;
        }

        .slide-content a {
          color: #667eea;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .slide-content a:hover {
          color: #764ba2;
          border-bottom-color: #764ba2;
          transform: translateY(-1px);
        }

        .slide-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          margin: 25px 0;
        }

        .navigation {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 18px 30px;
          border-radius: 50px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.5);
          z-index: 100;
          align-items: center;
        }

        .nav-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1em;
          font-weight: bold;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slide-counter {
          color: #667eea;
          font-weight: bold;
          font-size: 1.1em;
          min-width: 80px;
          text-align: center;
        }

        .reload-btn {
          background: #f0f0f0;
          color: #667eea;
          border: 2px solid #667eea;
          padding: 8px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9em;
          font-weight: bold;
          transition: all 0.2s;
        }

        .reload-btn:hover {
          background: #667eea;
          color: white;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 15px 20px;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #c62828;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .success-message {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 15px 20px;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #2e7d32;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #667eea;
          font-size: 1.2em;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
      `}</style>

      {slides.length === 0 ? (
        <div className="upload-screen">
          <h1>✨ Aurea Presentation Viewer</h1>
          <p>Carregue seus arquivos Markdown (.md) para criar uma apresentação profissional e elegante</p>
          
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Carregando slides...</p>
            </div>
          ) : (
            <>
              <label className="upload-area" htmlFor="file-upload">
                <Upload size={56} className="upload-icon" />
                <p className="upload-text-primary">
                  Clique para selecionar arquivos
                </p>
                <p className="upload-text-secondary">
                  Selecione múltiplos arquivos .md
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".md"
                  multiple
                  onChange={handleFileUpload}
                />
              </label>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="slide-container" ref={slideContainerRef}>
            <div 
              ref={slideContentRef}
              className="slide-content"
              dangerouslySetInnerHTML={{ __html: slides[currentSlide].html }}
            />
          </div>
          
          <div className="navigation">
            <button 
              className="nav-btn"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={20} />
              Anterior
            </button>
            
            <span className="slide-counter">
              {currentSlide + 1} / {slides.length}
            </span>
            
            <button 
              className="nav-btn"
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              Próximo
              <ChevronRight size={20} />
            </button>
            
            <button 
              className="reload-btn"
              onClick={() => {
                setSlides([]);
                setCurrentSlide(0);
                setError('');
              }}
            >
              Recarregar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MarkdownPresentation;