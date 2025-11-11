import React from 'react';

export default function SlideViewer({ html, slideContainerRef, slideContentRef }) {
  return (
    <div className="slide-container" ref={slideContainerRef}>
      <div ref={slideContentRef} className="slide-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
