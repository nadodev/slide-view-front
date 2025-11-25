import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSlidesManager } from "../../hooks/useSlidesManager";
import { useSocket } from "../../hooks/useSocket";
import { socketService } from "../../services/socket/SocketService";

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

    const { session, isSupported, platform, createPresentation, disconnect } = useSocket();

    useEffect(() => {
        localStorage.setItem("presentation-high-contrast", highContrast ? "1" : "0");
    }, [highContrast]);

    useEffect(() => {
        const handleCommand = (command: any) => {
            console.log('🎮 Command received:', command);
            if (command.command === 'next') {
                setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
            } else if (command.command === 'previous') {
                setCurrentSlide((prev) => Math.max(prev - 1, 0));
            } else if (command.command === 'goto' && command.slideIndex !== undefined) {
                setCurrentSlide(Math.max(0, Math.min(command.slideIndex, slides.length - 1)));
            } else if (command.command === 'presenter') {
                setPresenterMode(prev => command.toggle !== undefined ? command.toggle : !prev);
            } else if (command.command === 'focus') {
                setFocusMode(prev => command.toggle !== undefined ? command.toggle : !prev);
            }
        };

        socketService.on('remote-command', handleCommand);
        return () => {
            socketService.off('remote-command', handleCommand);
        };
    }, [slides.length, setCurrentSlide]);

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
