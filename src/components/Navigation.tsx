import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
  EyeOff,
  Download,
  Copy,
  RotateCw,
  QrCode,
  Wifi,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../shared/components/ui/alert-dialog";
import { useTheme } from "../stores/useThemeStore";

type NavigationProps = {
  currentSlide: number;
  totalSlides: number;
  setCurrentSlide: (slide: number) => void;
  setTransitionKey: (updater: number | ((prev: number) => number)) => void;
  setSlideTransition: (transition: string) => void;
  slideTransition: string;
  focusMode: boolean;
  setFocusMode: (mode: boolean) => void;
  presenterMode: boolean;
  setPresenterMode: (mode: boolean) => void;
  setShowSlideList: (show: boolean) => void;
  setEditing: (editing: boolean) => void;
  onStartEditing: () => void;
  duplicateSlide: () => void;
  onSaveAllSlides?: () => void;
  onRestart?: () => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;

  onShowRemoteControl?: () => void;
  remoteSession?: {
    isConnected: boolean;
    remoteClients: number;
  } | null;
};

const Navigation = ({
  currentSlide,
  totalSlides,
  setCurrentSlide,
  setTransitionKey,
  focusMode,
  setFocusMode,
  onStartEditing,
  duplicateSlide,
  onSaveAllSlides,
  onRestart,
  onShowRemoteControl,
  remoteSession,
}: NavigationProps) => {

  const onPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setTransitionKey(prev => prev + 1);
    }
  };

  const onNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
      setTransitionKey(prev => prev + 1);
    }
  };

  const onReset = () => {
    setCurrentSlide(0);
    setTransitionKey(prev => prev + 1);
  };

  const { isDark } = useTheme();

  const colors = {
    navBg: isDark ? 'bg-slate-900/95' : 'bg-white/95',
    buttonBg: isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200',
    buttonText: isDark ? 'text-slate-200' : 'text-slate-700',
    counterBg: isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200',
    counterText: isDark ? 'text-white' : 'text-slate-900',
    counterSubtext: isDark ? 'text-slate-400' : 'text-slate-500',
    divider: isDark ? 'bg-slate-700' : 'bg-slate-300',
  };

  return (
    <nav className={`w-full ${colors.navBg} shadow-lg backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Navegação de slides */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              title="Anterior (←)"
              className={`cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-md ${colors.buttonBg} ${colors.buttonText} disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-medium border`}
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className={`flex items-center gap-1 px-2.5 py-1.5 ${colors.counterBg} rounded-md border min-w-[60px] justify-center`}>
              <span className={`text-xs font-bold ${colors.counterText}`}>
                {currentSlide + 1}
              </span>
              <span className={`text-[10px] ${colors.counterSubtext}`}>/</span>
              <span className={`text-xs ${colors.counterSubtext}`}>{totalSlides}</span>
            </div>

            <button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              title="Próximo (→)"
              className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-medium shadow-md shadow-blue-500/20"
            >
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-1">
            <button
              onClick={onStartEditing}
              title="Editar"
              className={`cursor-pointer flex items-center gap-1 px-2 py-1.5 rounded-md ${colors.buttonBg} ${colors.buttonText} transition-all text-xs border`}
            >
              <Pencil size={12} />
              <span className="hidden md:inline">Editar</span>
            </button>

            <button
              onClick={() => setFocusMode(!focusMode)}
              title={focusMode ? "Sair do foco" : "Modo foco"}
              className={`cursor-pointer flex items-center gap-1 px-2 py-1.5 rounded-md transition-all text-xs border ${focusMode
                ? "bg-purple-600 hover:bg-purple-500 text-white border-purple-500"
                : `${colors.buttonBg} ${colors.buttonText}`
                }`}
            >
              {focusMode ? <Eye size={12} /> : <EyeOff size={12} />}
              <span className="hidden md:inline">{focusMode ? "Sair" : "Foco"}</span>
            </button>

            <button
              onClick={duplicateSlide}
              title="Duplicar (Ctrl+D)"
              className={`cursor-pointer flex items-center gap-1 px-2 py-1.5 rounded-md ${colors.buttonBg} ${colors.buttonText} transition-all text-xs border`}
            >
              <Copy size={12} />
              <span className="hidden lg:inline">Duplicar</span>
            </button>

            {onShowRemoteControl && (
              <button
                onClick={onShowRemoteControl}
                title="QR Code"
                className={`cursor-pointer flex items-center gap-1 px-2 py-1.5 rounded-md transition-all text-xs border ${remoteSession?.isConnected
                  ? "bg-violet-600 hover:bg-violet-500 text-white border-violet-500"
                  : `${colors.buttonBg} ${colors.buttonText}`
                  }`}
              >
                {remoteSession?.isConnected ? <Wifi size={12} /> : <QrCode size={12} />}
                <span className="hidden lg:inline">QR</span>
                {remoteSession?.isConnected && remoteSession.remoteClients > 0 && (
                  <span className="bg-white text-violet-600 text-[10px] font-bold px-1 rounded-full">
                    {remoteSession.remoteClients}
                  </span>
                )}
              </button>
            )}

            {onSaveAllSlides && (
              <button
                onClick={onSaveAllSlides}
                title="Salvar (.md)"
                className="cursor-pointer flex items-center gap-1 px-2 py-1.5 rounded-md bg-green-600 hover:bg-green-500 text-white transition-all text-xs border border-green-500"
              >
                <Download size={12} />
                <span className="hidden lg:inline">Salvar</span>
              </button>
            )}

            {onRestart && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    title="Recomençar"
                    className="cursor-pointer flex items-center gap-1 px-2 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white transition-all text-xs border border-orange-500"
                  >
                    <RotateCw size={12} />
                    <span className="hidden xl:inline">Recomençar</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className={`${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                      <RotateCw size={18} className="text-orange-500" />
                      Recomençar
                    </AlertDialogTitle>
                    <AlertDialogDescription className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      Todos os slides serão perdidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className={`${isDark ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onRestart}
                      className="bg-orange-600 hover:bg-orange-500 text-white"
                    >
                      Recomençar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <div className={`h-4 w-px ${colors.divider} mx-0.5`} />

            <button
              onClick={onReset}
              title="Voltar ao início"
              className={`cursor-pointer p-1.5 rounded-md ${colors.buttonBg} ${colors.buttonText} transition-all border`}
            >
              <RotateCw size={12} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
