import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Cabeçalho */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">SlideMD</div>
          <nav className="nav">
            <a href="#features">Recursos</a>
            <a href="#how">Como Funciona</a>
            <a href="#pricing">Preços</a>
            <button className="btn primary" onClick={() => navigate("/app")}>
              Abrir o app
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <h1>
            Crie apresentações com{" "}
            <span className="highlight">Markdown</span>
          </h1>
          <p>
            Transforme seus arquivos .md em slides bonitos, com modo
            apresentador, notas e destaque de código.
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => navigate("/app")}>
              Começar agora
            </button>
            <a href="#features" className="btn ghost">
              Ver recursos
            </a>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="features" className="features">
        <div className="container">
          <h2>Recursos poderosos, simples de usar</h2>
          <div className="grid">
            <div className="card">
              <h3>Markdown puro</h3>
              <p>Use seus arquivos .md sem conversões complicadas.</p>
            </div>
            <div className="card">
              <h3>Modo apresentador</h3>
              <p>Veja notas privadas e o próximo slide com facilidade.</p>
            </div>
            <div className="card">
              <h3>Destaque de código</h3>
              <p>Syntax highlight automático para mais de 30 linguagens.</p>
            </div>
            <div className="card">
              <h3>Exportação fácil</h3>
              <p>Exporte apresentações completas em Markdown ou HTML.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="how" className="steps">
        <div className="container">
          <h2>Como funciona</h2>
          <div className="step">
            <div className="num">1</div>
            <div>
              <h3>Importe seus arquivos .md</h3>
              <p>Envie um ou vários arquivos Markdown e comece a montar.</p>
            </div>
          </div>
          <div className="step">
            <div className="num">2</div>
            <div>
              <h3>Organize seus slides</h3>
              <p>Adicione, duplique ou reordene slides de forma intuitiva.</p>
            </div>
          </div>
          <div className="step">
            <div className="num">3</div>
            <div>
              <h3>Apresente com estilo</h3>
              <p>Ative o modo apresentador e brilhe na sua próxima reunião.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Pronto para criar sua próxima apresentação?</h2>
          <button className="btn primary" onClick={() => navigate("/app")}>
            Abrir o app
          </button>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} SlideMD • Feito com ❤️ em React</p>
      </footer>
    </div>
  );
}
