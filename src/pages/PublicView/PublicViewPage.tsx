/**
 * @fileoverview Página pública para visualizar apresentações compartilhadas
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Minimize2,
    Eye,
    User,
    Layers,
    Play,
    Pause,
} from 'lucide-react';
import { shareService } from '../../services/share/shareService';
import { parseMarkdown } from '../../core';
import './public-view.css';

interface PublicPresentation {
    id: number;
    title: string;
    description: string;
    author: string;
    slide_count: number;
    slides: Array<{
        id: number;
        content: string;
        title: string;
    }>;
    settings: Record<string, unknown>;
    view_count: number;
}

export default function PublicViewPage() {
    const { token } = useParams<{ token: string }>();
    const [presentation, setPresentation] = useState<PublicPresentation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    useEffect(() => {
        if (token) {
            loadPresentation();
        }
    }, [token]);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlay || !presentation) return;
        
        const timer = setInterval(() => {
            setCurrentSlide(prev => {
                if (prev >= presentation.slides.length - 1) {
                    setIsAutoPlay(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlay, presentation]);

    const loadPresentation = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await shareService.viewPublic(token!);
            setPresentation(data.presentation);
        } catch (err) {
            setError('Apresentação não encontrada ou não está mais disponível.');
        } finally {
            setLoading(false);
        }
    };

    const goToSlide = (index: number) => {
        if (presentation && index >= 0 && index < presentation.slides.length) {
            setCurrentSlide(index);
        }
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (e) {
            console.error('Fullscreen error:', e);
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                goToSlide(currentSlide + 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToSlide(currentSlide - 1);
            } else if (e.key === 'Escape') {
                if (isFullscreen) {
                    document.exitFullscreen();
                }
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, isFullscreen, presentation]);

    if (loading) {
        return (
            <div className="public-view-page loading-state">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring spin"></div>
                </div>
                <p>Carregando apresentação...</p>
            </div>
        );
    }

    if (error || !presentation) {
        return (
            <div className="public-view-page error-state">
                <div className="error-icon">
                    <Layers size={48} />
                </div>
                <h1>Apresentação não encontrada</h1>
                <p>{error || 'Esta apresentação não existe ou não está mais disponível.'}</p>
                <Link to="/" className="error-btn">
                    Ir para o início
                </Link>
            </div>
        );
    }

    const currentSlideData = presentation.slides[currentSlide];
    const { html } = parseMarkdown(currentSlideData?.content || '');

    return (
        <div className={`public-view-page ${isFullscreen ? 'fullscreen' : ''}`}>
            {/* Header */}
            {!isFullscreen && (
                <header className="public-header">
                    <div className="header-content">
                        <div className="header-left">
                            <Link to="/" className="logo">
                                <div className="logo-icon">▲</div>
                                <span className="logo-text">SlideMD</span>
                            </Link>
                            <div className="header-divider"></div>
                            <div className="presentation-info">
                                <h1>{presentation.title}</h1>
                                <div className="meta">
                                    <span><User size={12} /> {presentation.author}</span>
                                    <span><Eye size={12} /> {presentation.view_count} views</span>
                                </div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button 
                                onClick={() => setIsAutoPlay(!isAutoPlay)}
                                className={`action-btn ${isAutoPlay ? 'active' : ''}`}
                                title={isAutoPlay ? 'Pausar' : 'Auto-play'}
                            >
                                {isAutoPlay ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                            <button 
                                onClick={toggleFullscreen}
                                className="action-btn"
                                title="Tela cheia (F)"
                            >
                                <Maximize2 size={18} />
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Slide Area */}
            <main className="slide-container">
                <div className="slide-wrapper">
                    <div className="slide-content">
                        <div 
                            className="markdown-content"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </div>

                    {/* Navigation */}
                    {currentSlide > 0 && (
                        <button 
                            onClick={() => goToSlide(currentSlide - 1)}
                            className="nav-btn nav-prev"
                        >
                            <ChevronLeft size={isFullscreen ? 32 : 24} />
                        </button>
                    )}
                    {currentSlide < presentation.slides.length - 1 && (
                        <button 
                            onClick={() => goToSlide(currentSlide + 1)}
                            className="nav-btn nav-next"
                        >
                            <ChevronRight size={isFullscreen ? 32 : 24} />
                        </button>
                    )}

                    {/* Fullscreen Controls */}
                    {isFullscreen && (
                        <>
                            <div className="fullscreen-controls">
                                <button 
                                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                                    className={`fs-btn ${isAutoPlay ? 'active' : ''}`}
                                >
                                    {isAutoPlay ? <Pause size={20} /> : <Play size={20} />}
                                </button>
                                <button onClick={toggleFullscreen} className="fs-btn">
                                    <Minimize2 size={20} />
                                </button>
                            </div>
                            <div className="fullscreen-indicator">
                                {currentSlide + 1} / {presentation.slides.length}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            {!isFullscreen && (
                <footer className="public-footer">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${((currentSlide + 1) / presentation.slides.length) * 100}%` }}
                        />
                    </div>
                    <div className="slide-dots">
                        {presentation.slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                    <p className="slide-counter">
                        Slide {currentSlide + 1} de {presentation.slides.length}
                        <span className="hint"> • Use ← → para navegar</span>
                    </p>
                </footer>
            )}
        </div>
    );
}
