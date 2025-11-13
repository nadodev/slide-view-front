import React from 'react';
import type { RefObject } from 'react';

type SlideViewerProps = {
  html?: string;
  slideContainerRef?: RefObject<HTMLElement | null>;
  slideContentRef?: RefObject<HTMLElement | null>;
};

export default function SlideViewer({ html = '', slideContainerRef, slideContentRef }: SlideViewerProps) {
  return (
    <div
      ref={slideContainerRef as any}
      className="slide-container bg-gradient-to-br from-white to-gray-50 w-[90%] max-w-[1400px] h-[76vh] rounded-2xl shadow-2xl p-12 overflow-y-auto"
    >
      <div ref={slideContentRef as any} className="slide-content max-w-full" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
