// Simple fix: Check if we have incoming slides BEFORE any redirect logic
// This prevents the race condition where redirect happens before slides are processed

import { useLocation, useNavigate } from "react-router-dom";

export function useSlideRedirect(slides: any[], location: any) {
    const navigate = useNavigate();

    // Check if we have slides coming from navigation
    const hasIncomingSlides = location.state?.slides &&
        Array.isArray(location.state.slides) &&
        location.state.slides.length > 0;

    // Only redirect if we truly have no slides AND no incoming slides
    if (!hasIncomingSlides && slides.length === 0) {
        setTimeout(() => navigate('/create'), 100);
        return true; // Should redirect
    }

    return false; // Don't redirect
}
