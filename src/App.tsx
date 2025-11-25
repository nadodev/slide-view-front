import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PresentationPage from './pages/Presentation/PresentationPage';
import CreatePage from './pages/Create/CreatePage';
import EditorPage from './pages/Editor/EditorPage';
import { RemoteControl } from './components/RemoteControl';
import GitHubAuthCallback from './components/GitHubAuthCallback';
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/app" element={<RouteLogger><PresentationPage /></RouteLogger>} />
        <Route path="/remote/:sessionId" element={<RemoteControl />} />
        <Route path="/auth/github/callback" element={<GitHubAuthCallback />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
