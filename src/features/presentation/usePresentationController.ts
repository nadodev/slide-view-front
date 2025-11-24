import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Slide } from "../../components/slides/types";
import { presentationService } from "../../services/presentation/PresentationService";
import { socketService } from "../../services/socket/SocketService";
import { useSlidesManager } from "../../hooks/useSlidesManager";
import { useSocket } from "../../hooks/useSocket"; // We will refactor this later to use the service directly if needed, or keep as adapter

export function usePresentationController() {
    const location = useLocation();
    const navigate = useNavigate();

    // Use existing hooks for now, but we will gradually replace logic with services
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

    const slideContentRef = useRef<HTMLElement | null>(null);
    const slideContainerRef = useRef<HTMLElement | null>(null);
    const presenterScrollRef = useRef<HTMLDivElement | null>(null);
    const thumbsRailRef = useRef<HTMLElement | null>(null);

    // Socket integration
    const { session, isSupported, platform, createPresentation, disconnect } = useSocket();

    // Persist high contrast
    useEffect(() => {
        localStorage.setItem("presentation-high-contrast", highContrast ? "1" : "0");
    }, [highContrast]);

    // Handle remote commands (This logic should ideally move to a specialized hook or the service)
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

    return {
        // State
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

        // Actions
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

        // Refs
        slideContentRef,
        slideContainerRef,
        presenterScrollRef,
        thumbsRailRef,
    };
}
