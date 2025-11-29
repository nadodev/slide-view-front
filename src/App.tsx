import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PresentationPage from './pages/Presentation/PresentationPage';
import CreatePage from './pages/Create/CreatePage';
import EditorPage from './pages/Editor/EditorPage';
import { LoginPage, RegisterPage } from './pages/Auth';
import { RemoteControl } from './components/RemoteControl';
import GitHubAuthCallback from './components/GitHubAuthCallback';
import { ProtectedRoute } from './components/auth';
import { Toaster } from './shared/components/ui/sonner';
import { JSX } from 'react';

const RouteLogger = ({ children }: { children: JSX.Element }) => {
  console.log('🎯 RouteLogger: Rendering route for /app');
  return children;
};

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrar" element={<RegisterPage />} />
        <Route path="/auth/github/callback" element={<GitHubAuthCallback />} />
        
        {/* Rotas protegidas - requer autenticação (qualquer plano) */}
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/editor" 
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <RouteLogger>
                <PresentationPage />
              </RouteLogger>
            </ProtectedRoute>
          } 
        />
        
        {/* Rota pública para controle remoto */}
        <Route path="/remote/:sessionId" element={<RemoteControl />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
