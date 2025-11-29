import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseMarkdown } from "../../core";
import { usePresentationController } from "../../features/presentation/usePresentationController";
import { PresentationLayout } from "./components/PresentationLayout";
import { EmptyState } from "./components/EmptyState";
import SlideList from "../../components/SlideList";
import PresenterView from "../../components/PresenterView";
import SlidesWorkspace from "../../components/presentation/SlidesWorkspace";
import ScrollTopButton from "../../components/ScrollTopButton";
import EditPanel from "../../components/EditPanel";
import { QRCodeDisplay } from "../../components/QRCodeDisplay";
import { RemoteControlModal } from "../../components/RemoteControlModal";
import { usePresentationShortcuts } from "../../hooks/usePresentationShortcuts";

export default function PresentationPage() {
    console.log('🎯 PresentationPage: Component mounting...');
    const location = useLocation();
    const navigate = useNavigate();
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

        if (location.state?.slides && Array.isArray(location.state.slides)) {
            console.log('🎯 PresentationPage: ✅ Setting slides from state:', location.state.slides);
            setSlides(location.state.slides);
            setCurrentSlide(0);
            setShowSlideList(true);
            window.history.replaceState({}, document.title);
        } else {
            console.log('🎯 PresentationPage: ❌ No slides in location.state');
        }
    }, [location.state, setSlides, setCurrentSlide, setShowSlideList]);

    const containerClasses = [
        highContrast ? "high-contrast" : "",
        presenterMode ? "presenter-full" : "",
        focusMode ? "focus-mode" : "",
    ]
        .filter(Boolean)
        .join(" ");

    // If no slides yet, render empty state
    if (slides.length === 0) {
        return <EmptyState />;
    }

    return (
        <PresentationLayout className={containerClasses}>
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
                        {isSupported && session ? (
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
                                onClose={() => setShowQRCode(false)}
                            />
                        )}
                    </>
                )
            }
        </PresentationLayout >
    );
}
