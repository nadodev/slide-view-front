/**
 * @fileoverview Página de embed para incorporar apresentações em outros sites
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { shareService } from '../../services/share/shareService';
import { parseMarkdown } from '../../core';
import './embed.css';

export default function EmbedPage() {
    const { token } = useParams<{ token: string }>();
    const [slides, setSlides] = useState<Array<{ id: number; content: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (token) {
            loadEmbed();
        }
    }, [token]);

    const loadEmbed = async () => {
        try {
            setLoading(true);
            const data = await shareService.getEmbed(token!);
            setSlides(data.slides);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const goToSlide = (index: number) => {
        if (index >= 0 && index < slides.length) {
            setCurrentSlide(index);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                goToSlide(currentSlide + 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToSlide(currentSlide - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, slides]);

    if (loading) {
        return (
            <div className="embed-page embed-loading">
                <div className="embed-spinner"></div>
            </div>
        );
    }

    if (error || slides.length === 0) {
        return (
            <div className="embed-page embed-error">
                <p>Apresentação não disponível</p>
            </div>
        );
    }

    const currentSlideData = slides[currentSlide];
    const { html } = parseMarkdown(currentSlideData?.content || '');

    return (
        <div className="embed-page">
            {/* Slide Content */}
            <div className="embed-slide">
                <div 
                    className="embed-markdown"
                    dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* Navigation */}
                {currentSlide > 0 && (
                    <button 
                        onClick={() => goToSlide(currentSlide - 1)}
                        className="embed-nav embed-nav-prev"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
                {currentSlide < slides.length - 1 && (
                    <button 
                        onClick={() => goToSlide(currentSlide + 1)}
                        className="embed-nav embed-nav-next"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="embed-footer">
                <div className="embed-dots">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`embed-dot ${idx === currentSlide ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <span className="embed-counter">{currentSlide + 1}/{slides.length}</span>
            </div>
        </div>
    );
}
