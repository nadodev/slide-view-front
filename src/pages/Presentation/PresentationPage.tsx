import { usePresentationController } from "../../features/presentation/usePresentationController";
import { PresentationLayout } from "./components/PresentationLayout";
import PresentationEmptyState from "../../components/presentation/PresentationEmptyState";
import SlideList from "../../components/SlideList";
import PresenterView from "../../components/PresenterView";
import SlidesWorkspace from "../../components/presentation/SlidesWorkspace";
import ScrollTopButton from "../../components/ScrollTopButton";
import EditPanel from "../../components/EditPanel";
import { QRCodeDisplay } from "../../components/QRCodeDisplay";
import { RemoteControlModal } from "../../components/RemoteControlModal";
import parseMarkdownSafe from "../../utils/markdown";

export default function PresentationPage() {
    const controller = usePresentationController();
    const {
        slides,
        currentSlide,
        showSlideList,
        loading,
        error,
        warning,
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
        handleFileUpload,
        handleAIGeneration,
        duplicateSlide,
        saveSlideToFile,
        saveAllSlidesToFile,
        resetSlidesState,
        reorderSlides,
        createPresentation,
        disconnect,
        slideContentRef,
        slideContainerRef,
        presenterScrollRef,
        thumbsRailRef,
    } = controller;

    // Helper to extract notes (should be in service, but keeping here for now to match EditPanel props)
    const extractNotes = (text: string) => {
        const notes: string[] = [];
        if (!text) return { clean: "", notes };
        const cleaned = text.replace(
            /<!--\s*note:\s*([\s\S]*?)-->/gi,
            (_match, note) => {
                if (note && note.trim()) notes.push(note.trim());
                return "";
            },
        );
        return { clean: cleaned.trim(), notes };
    };

    const containerClasses = [
        highContrast ? "high-contrast" : "",
        presenterMode ? "presenter-full" : "",
        focusMode ? "focus-mode" : "",
    ]
        .filter(Boolean)
        .join(" ");

    if (slides.length === 0) {
        return (
            <PresentationLayout className={containerClasses}>
                <PresentationEmptyState
                    highContrast={highContrast}
                    onToggleHighContrast={() => setHighContrast((v) => !v)}
                    onFilesChange={handleFileUpload}
                    onAIGenerate={handleAIGeneration}
                    onCreateSlide={() => {
                        setDraftContent("");
                        setEditing(true);
                    }}
                    loading={loading}
                    error={error}
                    warning={warning}
                />
                <EditPanel
                    open={editing}
                    value={draftContent}
                    onChange={setDraftContent}
                    onCancel={() => {
                        setEditing(false);
                        setDraftContent("");
                    }}
                    onSave={() => { /* Logic handled in EditPanel for create mode usually */ }}
                    mode="create"
                    onCreateFiles={(files) => {
                        const newSlides = files.map((file) => {
                            const { clean, notes } = extractNotes(file.content);
                            return {
                                name: file.name.replace('.md', ''),
                                content: clean,
                                notes,
                                html: parseMarkdownSafe(clean),
                            };
                        });
                        setSlides(newSlides);
                        setCurrentSlide(0);
                        setShowSlideList(true);
                        setEditing(false);
                    }}
                    editorFocus={editorFocus}
                    onToggleEditorFocus={() => setEditorFocus((v) => !v)}
                />
            </PresentationLayout>
        );
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
                    transitionKey={currentSlide} // Simplified for now
                    setTransitionKey={() => { }}
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

            {!showSlideList && slides.length > 0 && (
                <ScrollTopButton slideContainerRef={slideContainerRef} />
            )}

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
                        newSlides[currentSlide] = {
                            ...newSlides[currentSlide],
                            content: draftContent,
                            html: parseMarkdownSafe(draftContent)
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

            {showQRCode && (
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
            )}
        </PresentationLayout>
    );
}
