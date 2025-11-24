import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GitHubAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (window.opener && window.opener !== window) {
      if (error) {
        window.opener.postMessage({
          type: 'GITHUB_AUTH_ERROR',
          error,
        }, window.location.origin);
      } else if (code && state) {
        window.opener.postMessage({
          type: 'GITHUB_AUTH_SUCCESS',
          code,
          state,
        }, window.location.origin);
      }

      window.close();
      return;
    }

    if (error) {
      console.error('Erro na autenticação GitHub:', error);
      navigate('/app?error=github_auth_failed');
    } else {
      navigate('/app?github_auth=success');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400">Processando autenticação GitHub...</p>
      </div>
    </div>
  );
}