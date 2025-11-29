import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PresentationPage from './pages/Presentation/PresentationPage';
import CreatePage from './pages/Create/CreatePage';
import EditorPage from './pages/Editor/EditorPage';
import PricingPage from './pages/Pricing/PricingPage';
import TemplatesPage from './pages/Templates/TemplatesPage';
import PublicViewPage from './pages/PublicView/PublicViewPage';
import EmbedPage from './pages/Embed/EmbedPage';
import { LoginPage, RegisterPage, OAuthCallbackPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { SubscriptionPage } from './pages/Subscription';
import { RemoteControl } from './components/RemoteControl';
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
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* OAuth Callbacks */}
        <Route path="/auth/google/callback" element={<OAuthCallbackPage />} />
        <Route path="/auth/github/callback" element={<OAuthCallbackPage />} />
        
        {/* Rotas protegidas - requer autenticação (qualquer plano) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
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
        
        {/* Templates - protegido */}
        <Route 
          path="/templates" 
          element={
            <ProtectedRoute>
              <TemplatesPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Assinatura - protegido */}
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota pública para controle remoto */}
        <Route path="/remote/:sessionId" element={<RemoteControl />} />
        
        {/* Rotas públicas para visualização */}
        <Route path="/view/:token" element={<PublicViewPage />} />
        <Route path="/embed/:token" element={<EmbedPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
