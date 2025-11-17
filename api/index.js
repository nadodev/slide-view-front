import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static('.'));

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'App funcionando sem controle remoto (Vercel)' });
});

// Rota para controle remoto (informativa)
app.get('/remote/:sessionId', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Controle Remoto - Não Disponível</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                text-align: center;
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                max-width: 400px;
            }
            h1 { margin-top: 0; }
            .icon { font-size: 4em; margin-bottom: 20px; }
            .btn {
                background: #4CAF50;
                color: white;
                padding: 15px 25px;
                text-decoration: none;
                border-radius: 10px;
                display: inline-block;
                margin-top: 20px;
                transition: background 0.3s;
            }
            .btn:hover { background: #45a049; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">📱</div>
            <h1>Controle Remoto</h1>
            <p><strong>Vercel não suporta WebSockets</strong></p>
            <p>Para usar o controle remoto, faça deploy em:</p>
            <ul style="text-align: left;">
                <li>Railway.app (recomendado)</li>
                <li>Render.com</li>
                <li>Heroku</li>
            </ul>
            <a href="/" class="btn">← Voltar à Apresentação</a>
        </div>
    </body>
    </html>
  `);
});

// Fallback - retornar index.html para todas as outras rotas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;