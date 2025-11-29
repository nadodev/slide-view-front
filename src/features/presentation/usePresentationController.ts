import { useState, useEffect, useRef, useCallback } from "react";
import { useSlidesManager } from "../../hooks/useSlidesManager";
import { useSocket } from "../../hooks/useSocket";

export function usePresentationController() {
    console.log('🎯 usePresentationController initialized');
    const slidesManager = useSlidesManager();
    const {
        slides,
        setSlides,
        currentSlide,
        setCurrentSlide,
        showSlideList,
        setShowSlideList,
        loading,
        error,
        warning,
        handleFileUpload,
        handleAIGeneration,
        duplicateSlide,
        saveSlideToFile,
        saveAllSlidesToFile,
        resetSlidesState,
        reorderSlides,
    } = slidesManager;

    const [presenterMode, setPresenterMode] = useState<boolean>(false);
    const [focusMode, setFocusMode] = useState<boolean>(false);
    const [showQRCode, setShowQRCode] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [draftContent, setDraftContent] = useState<string>("");
    const [editorFocus, setEditorFocus] = useState<boolean>(false);
    const [highContrast, setHighContrast] = useState(() => {
        try {
            return localStorage.getItem("presentation-high-contrast") === "1";
        } catch {
            return false;
        }
    });

    // New states for shortcuts
    const [transitionKey, setTransitionKey] = useState<number>(0);
    const [showHelp, setShowHelp] = useState<boolean>(false);

    const slideContentRef = useRef<HTMLElement | null>(null);
    const slideContainerRef = useRef<HTMLElement | null>(null);
    const presenterScrollRef = useRef<HTMLDivElement | null>(null);
    const thumbsRailRef = useRef<HTMLElement | null>(null);

    const { 
        session, 
        isSupported, 
        platform, 
        serverStatus,
        error: socketError,
        createPresentation, 
        disconnect,
        onRemoteCommand,
        updateSlide,
        shareContent 
    } = useSocket();

    useEffect(() => {
        localStorage.setItem("presentation-high-contrast", highContrast ? "1" : "0");
    }, [highContrast]);

    // Sincronizar estado com o controle remoto
    useEffect(() => {
        if (session && slides.length > 0) {
            console.log('📡 Sincronizando estado com controle remoto:', { currentSlide, totalSlides: slides.length });
            updateSlide(currentSlide, slides.length);
        }
    }, [session, currentSlide, slides.length, updateSlide]);

    // Compartilhar conteúdo do slide atual com o controle remoto
    useEffect(() => {
        if (session && slides.length > 0 && slides[currentSlide]) {
            const currentSlideData = slides[currentSlide];
            const contentHtml = currentSlideData.html || '';
            
            shareContent(JSON.stringify({
                html: contentHtml,
                currentSlide,
                totalSlides: slides.length,
            }));
        }
    }, [session, slides, currentSlide, shareContent]);

    // Handler para comandos remotos
    const handleRemoteCommand = useCallback((command: any) => {
        console.log('🎮 Command received:', command);
        if (command.command === 'next') {
            setCurrentSlide((prev: number) => Math.min(prev + 1, slides.length - 1));
        } else if (command.command === 'previous') {
            setCurrentSlide((prev: number) => Math.max(prev - 1, 0));
        } else if (command.command === 'goto' && command.slideIndex !== undefined) {
            setCurrentSlide(Math.max(0, Math.min(command.slideIndex, slides.length - 1)));
        } else if (command.command === 'presenter') {
            setPresenterMode(prev => command.toggle !== undefined ? command.toggle : !prev);
        } else if (command.command === 'focus') {
            setFocusMode(prev => command.toggle !== undefined ? command.toggle : !prev);
        } else if (command.command === 'scroll') {
            // Scroll dentro do slide atual - verificar qual ref usar
            const scrollContainer = presenterScrollRef.current || slideContentRef.current;
            if (scrollContainer) {
                const scrollAmount = 200;
                if (command.scrollDirection === 'down') {
                    scrollContainer.scrollTop += scrollAmount;
                } else if (command.scrollDirection === 'up') {
                    scrollContainer.scrollTop -= scrollAmount;
                }
            }
        }
    }, [slides.length, setCurrentSlide]);

    // Registrar o callback para receber comandos remotos
    useEffect(() => {
        onRemoteCommand(handleRemoteCommand);
    }, [onRemoteCommand, handleRemoteCommand]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.warn("Fullscreen failed:", e);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return {
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
    };
}
