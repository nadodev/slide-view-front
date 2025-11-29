import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { parseMarkdown, extractNotes } from "../../core";
import { usePresentationController } from "../../features/presentation/usePresentationController";
import { PresentationLayout } from "./components/PresentationLayout";
import { PresentationNavbar } from "./components/PresentationNavbar";
import { EmptyState } from "./components/EmptyState";
import SlideList from "../../components/SlideList";
import PresenterView from "../../components/PresenterView";
import SlidesWorkspace from "../../components/presentation/SlidesWorkspace";
import ScrollTopButton from "../../components/ScrollTopButton";
import EditPanel from "../../components/EditPanel";
import { QRCodeDisplay } from "../../components/QRCodeDisplay";
import { RemoteControlModal } from "../../components/RemoteControlModal";
import { usePresentationShortcuts } from "../../hooks/usePresentationShortcuts";
import { usePresentationsStore } from "../../stores/usePresentationsStore";
import { useTheme } from "../../stores/useThemeStore";
import { Loader2 } from "lucide-react";

// Loading Component
function LoadingPresentation({ title }: { title?: string }) {
    const { isDark } = useTheme();
    
    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-slate-100'} flex flex-col items-center justify-center transition-colors duration-300`}>
            <div className="text-center">
                {/* Logo */}
                <div className="mb-8">
                    <div className={`flex h-16 w-16 mx-auto items-center justify-center rounded-2xl ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} font-bold text-2xl shadow-2xl`}>
                        ▲
                    </div>
                </div>

                {/* Loading spinner */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    </div>
                </div>

                {/* Text */}
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Carregando apresentação
                </h2>
                {title && (
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-lg mb-4`}>
                        "{title}"
                    </p>
                )}
                <p className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-sm`}>
                    Preparando seus slides...
                </p>

                {/* Progress bar animation */}
                <div className={`mt-8 w-64 mx-auto h-1 ${isDark ? 'bg-slate-800' : 'bg-slate-300'} rounded-full overflow-hidden`}>
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" 
                         style={{ width: '60%', animation: 'loading-progress 1.5s ease-in-out infinite' }} />
                </div>
            </div>

            <style>{`
                @keyframes loading-progress {
                    0% { width: 0%; margin-left: 0; }
                    50% { width: 60%; margin-left: 20%; }
                    100% { width: 0%; margin-left: 100%; }
                }
            `}</style>
        </div>
    );
}

export default function PresentationPage() {
    console.log('🎯 PresentationPage: Component mounting...');
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const presentationId = searchParams.get('id');
    const { fetchPresentation, currentPresentation, isLoading: storeLoading } = usePresentationsStore();
    const [isLoadingFromApi, setIsLoadingFromApi] = useState(!!presentationId);
    const [presentationTitle, setPresentationTitle] = useState<string | undefined>();
    const controller = usePresentationController();
    const {
        slides,
        currentSlide,
        showSlideList,
        loading,
        presenterMode,
        focusMode,
        showQRCode,
        editing,
        draftContent,
        editorFocus,
        highContrast,
        session,
        isSupported,
        platform,
        serverStatus,
        socketError,
        transitionKey,
        showHelp,
        setSlides,
        setCurrentSlide,
        setShowSlideList,
        setPresenterMode,
        setFocusMode,
        setShowQRCode,
        setEditing,
        setDraftContent,
        setEditorFocus,
        setHighContrast,
        setTransitionKey,
        setShowHelp,
        toggleFullscreen,
        duplicateSlide,
        saveSlideToFile,
        saveAllSlidesToFile,
        resetSlidesState,
        reorderSlides,
        createPresentation,
        slideContentRef,
        slideContainerRef,
        presenterScrollRef,
        thumbsRailRef,
    } = controller;

    usePresentationShortcuts({
        editing,
        presenterMode,
        slides,
        currentSlide,
        setCurrentSlide,
        setTransitionKey,
        setFocusMode,
        setShowHelp,
        setDraftContent,
        setEditing,
        duplicateSlide,
        toggleFullscreen,
        setPresenterMode,
    });

    useEffect(() => {
        console.log('🎯 PresentationPage: useEffect triggered');
        console.log('🎯 PresentationPage: location:', location);
        console.log('🎯 PresentationPage: location.state:', location.state);

        // Pegar título do state se disponível
        if (location.state?.presentationTitle) {
            setPresentationTitle(location.state.presentationTitle);
        }

        const loadFromApi = async () => {
            if (presentationId && !location.state?.slides) {
                console.log('🎯 PresentationPage: Loading from API, id:', presentationId);
                setIsLoadingFromApi(true);
                
                const presentation = await fetchPresentation(parseInt(presentationId));
                
                if (presentation?.slides && presentation.slides.length > 0) {
                    setPresentationTitle(presentation.title);
                    const loadedSlides = presentation.slides.map((slide) => {
                        const { clean, notes } = extractNotes(slide.content);
                        const { html } = parseMarkdown(clean);
                        return {
                            name: slide.title || 'Slide',
                            content: clean,
                            notes,
                            html,
                        };
                    });
                    console.log('🎯 PresentationPage: ✅ Loaded slides from API:', loadedSlides);
                    setSlides(loadedSlides);
                    setCurrentSlide(0);
                    // Ir direto para apresentação, não mostrar lista
                    setShowSlideList(false);
                } else {
                    // Se não tem slides, redireciona para o editor
                    navigate(`/editor?id=${presentationId}`);
                    return;
                }
                
                setIsLoadingFromApi(false);
            }
        };

        if (location.state?.slides && Array.isArray(location.state.slides)) {
            console.log('🎯 PresentationPage: ✅ Setting slides from state:', location.state.slides);
            setSlides(location.state.slides);
            setCurrentSlide(0);
            // Ir direto para apresentação quando vem do editor
            setShowSlideList(false);
            setIsLoadingFromApi(false);
            window.history.replaceState({}, document.title);
        } else if (presentationId) {
            loadFromApi();
        } else {
            setIsLoadingFromApi(false);
            console.log('🎯 PresentationPage: ❌ No slides in location.state');
        }
    }, [location.state, presentationId, setSlides, setCurrentSlide, setShowSlideList, fetchPresentation, navigate]);

    const containerClasses = [
        highContrast ? "high-contrast" : "",
        presenterMode ? "presenter-full" : "",
        focusMode ? "focus-mode" : "",
    ]
        .filter(Boolean)
        .join(" ");

    // Loading state - mostrar enquanto carrega do banco
    if (isLoadingFromApi || storeLoading) {
        return <LoadingPresentation title={presentationTitle || currentPresentation?.title} />;
    }

    // If no slides and not loading, render empty state
    if (slides.length === 0) {
        return <EmptyState />;
    }

    // Verificar se deve mostrar navbar (não mostrar no focus mode ou presenter mode)
    const showNavbar = !focusMode && !presenterMode;

    return (
        <PresentationLayout className={containerClasses} hasNavbar={showNavbar}>
            {/* Navbar */}
            {showNavbar && (
                <PresentationNavbar
                    title={presentationTitle || 'Apresentação'}
                    presentationId={presentationId}
                    slideCount={slides.length}
                    currentSlide={currentSlide}
                    onFullscreen={toggleFullscreen}
                    onEdit={() => navigate(`/editor?id=${presentationId}`)}
                />
            )}

            {showSlideList ? (
                <SlideList
                    slides={slides}
                    onReorder={(newSlides) => setSlides(newSlides)}
                    onStart={() => {
                        setShowSlideList(false);
                        setCurrentSlide(0);
                    }}
                    onRemove={(idx) => {
                        const newSlides = [...slides];
                        newSlides.splice(idx, 1);
                        setSlides(newSlides);
                        if (newSlides.length === 0) setShowSlideList(false);
                    }}
                    highContrast={highContrast}
                    onToggleContrast={() => setHighContrast((v) => !v)}
                />
            ) : presenterMode ? (
                <PresenterView
                    currentHtml={slides[currentSlide].html}
                    currentIndex={currentSlide}
                    slidesLength={slides.length}
                    onNext={() => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))}
                    onPrev={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                    onExit={() => setPresenterMode(false)}
                    scrollContainerRef={presenterScrollRef}
                />
            ) : (
                <SlidesWorkspace
                    slides={slides}
                    currentSlide={currentSlide}
                    setCurrentSlide={setCurrentSlide}
                    transitionKey={transitionKey}
                    setTransitionKey={setTransitionKey}
                    slideTransition="fade"
                    setSlideTransition={() => { }}
                    focusMode={focusMode}
                    setFocusMode={setFocusMode}
                    presenterMode={presenterMode}
                    setPresenterMode={setPresenterMode}
                    thumbsRailRef={thumbsRailRef}
                    slideContainerRef={slideContainerRef}
                    slideContentRef={slideContentRef}
                    onRemove={(idx) => {
                        const newSlides = [...slides];
                        newSlides.splice(idx, 1);
                        setSlides(newSlides);
                    }}
                    onReorder={reorderSlides}
                    setShowSlideList={setShowSlideList}
                    setEditing={setEditing}
                    setDraftContent={setDraftContent}
                    duplicateSlide={duplicateSlide}
                    onSaveAllSlides={saveAllSlidesToFile}
                    onRestart={resetSlidesState}
                    highContrast={highContrast}
                    setHighContrast={setHighContrast}
                    loading={loading}
                    onShowRemoteControl={() => {
                        if (!isSupported) {
                            setShowQRCode(true);
                            return;
                        }
                        if (!session) {
                            createPresentation();
                        }
                        setShowQRCode(true);
                    }}
                    remoteSession={session ? {
                        isConnected: session.isConnected,
                        remoteClients: session.remoteClients
                    } : null}
                    hasNavbar={showNavbar}
                />
            )}

            {
                !showSlideList && slides.length > 0 && (
                    <ScrollTopButton slideContainerRef={slideContainerRef} />
                )
            }

            <EditPanel
                open={editing}
                value={draftContent}
                onChange={setDraftContent}
                onCancel={() => {
                    setEditing(false);
                    setDraftContent("");
                }}
                onSave={() => {
                    if (slides.length > 0 && currentSlide < slides.length) {
                        const newSlides = [...slides];
                        const { html } = parseMarkdown(draftContent);
                        newSlides[currentSlide] = {
                            ...newSlides[currentSlide],
                            content: draftContent,
                            html,
                        };
                        setSlides(newSlides);
                        setEditing(false);
                        saveSlideToFile(currentSlide, draftContent);
                    }
                }}
                mode="edit"
                onCreateFiles={() => { }}
                editorFocus={editorFocus}
                onToggleEditorFocus={() => setEditorFocus((v) => !v)}
            />

            {
                showQRCode && (
                    <>
                        {isSupported && session && serverStatus === 'online' ? (
                            <QRCodeDisplay
                                qrUrl={session.qrUrl}
                                sessionId={session.sessionId}
                                remoteClients={session.remoteClients}
                                isConnected={session.isConnected}
                                onClose={() => setShowQRCode(false)}
                            />
                        ) : (
                            <RemoteControlModal
                                qrUrl={session?.qrUrl}
                                sessionId={session?.sessionId}
                                remoteClients={session?.remoteClients}
                                isConnected={session?.isConnected}
                                isSupported={isSupported}
                                platform={platform}
                                serverStatus={serverStatus}
                                error={socketError}
                                onClose={() => setShowQRCode(false)}
                                onRetry={createPresentation}
                            />
                        )}
                    </>
                )
            }
        </PresentationLayout >
    );
}
