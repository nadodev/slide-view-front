import React from 'react';

export const EditorStyles: React.FC = () => {
    return (
        <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }

      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
      }

      .custom-scrollbar::-webkit-scrollbar {
        width: 10px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(100, 116, 139, 0.4);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(100, 116, 139, 0.6);
      }

      /* Estilos do Markdown Preview */
      .markdown-preview {
        color: #e2e8f0;
        line-height: 1.75;
        max-width: none;
      }

      /* Headings */
      .markdown-preview h1,
      .markdown-preview h2,
      .markdown-preview h3,
      .markdown-preview h4,
      .markdown-preview h5,
      .markdown-preview h6 {
        font-weight: 700;
        color: #ffffff;
        margin-top: 1.5em;
        margin-bottom: 0.75em;
        line-height: 1.25;
      }

      .markdown-preview h1 {
        font-size: 2.5rem;
        background: linear-gradient(to right, #60a5fa, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        padding-bottom: 0.5em;
        border-bottom: 2px solid rgba(100, 116, 139, 0.3);
      }

      .markdown-preview h2 {
        font-size: 2rem;
        color: #f1f5f9;
        padding-bottom: 0.3em;
        border-bottom: 1px solid rgba(100, 116, 139, 0.3);
      }

      .markdown-preview h3 {
        font-size: 1.5rem;
        color: #e2e8f0;
      }

      .markdown-preview h4 {
        font-size: 1.25rem;
        color: #cbd5e1;
      }

      .markdown-preview h5 {
        font-size: 1.125rem;
        color: #cbd5e1;
      }

      .markdown-preview h6 {
        font-size: 1rem;
        color: #94a3b8;
      }

      /* Paragraphs */
      .markdown-preview p {
        margin-top: 1em;
        margin-bottom: 1em;
        color: #cbd5e1;
      }

      /* Links */
      .markdown-preview a {
        color: #60a5fa;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s;
      }

      .markdown-preview a:hover {
        color: #93c5fd;
        border-bottom-color: #60a5fa;
      }

      /* Strong & Em */
      .markdown-preview strong {
        font-weight: 700;
        color: #ffffff;
      }

      .markdown-preview em {
        font-style: italic;
        color: #e2e8f0;
      }

      /* Lists */
      .markdown-preview ul,
      .markdown-preview ol {
        margin-top: 1em;
        margin-bottom: 1em;
        padding-left: 1.5em;
        color: #cbd5e1;
      }

      .markdown-preview li {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }

      .markdown-preview ul > li {
        list-style-type: disc;
      }

      .markdown-preview ul > li::marker {
        color: #60a5fa;
      }

      .markdown-preview ol > li {
        list-style-type: decimal;
      }

      .markdown-preview ol > li::marker {
        color: #a78bfa;
        font-weight: 600;
      }

      /* Code */
      .markdown-preview code {
        background: #1e293b;
        color: #c084fc;
        padding: 0.2em 0.4em;
        border-radius: 0.25rem;
        font-family: 'Fira Code', 'Courier New', monospace;
        font-size: 0.875em;
        border: 1px solid rgba(100, 116, 139, 0.3);
      }

      .markdown-preview pre {
        background: #0f172a;
        border: 1px solid rgba(100, 116, 139, 0.3);
        border-radius: 0.75rem;
        padding: 1.5rem;
        overflow-x: auto;
        margin: 1.5em 0;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      .markdown-preview pre code {
        background: transparent;
        padding: 0;
        border: none;
        color: #e2e8f0;
        font-size: 0.9rem;
      }

      /* Blockquotes */
      .markdown-preview blockquote {
        border-left: 4px solid #3b82f6;
        background: rgba(30, 41, 59, 0.5);
        padding: 1rem 1.5rem;
        margin: 1.5em 0;
        border-radius: 0 0.5rem 0.5rem 0;
        color: #cbd5e1;
      }

      .markdown-preview blockquote p {
        margin: 0.5em 0;
      }

      /* Tables */
      .markdown-preview table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        background: rgba(30, 41, 59, 0.3);
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .markdown-preview th {
        background: rgba(51, 65, 85, 0.8);
        color: #f1f5f9;
        font-weight: 600;
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 2px solid rgba(100, 116, 139, 0.5);
      }

      .markdown-preview td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(100, 116, 139, 0.2);
        color: #cbd5e1;
      }

      .markdown-preview tr:last-child td {
        border-bottom: none;
      }

      .markdown-preview tr:hover {
        background: rgba(51, 65, 85, 0.3);
      }

      /* Horizontal Rule */
      .markdown-preview hr {
        border: none;
        height: 2px;
        background: linear-gradient(to right, transparent, rgba(100, 116, 139, 0.5), transparent);
        margin: 2em 0;
      }

      /* Images */
      .markdown-preview img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        margin: 1.5em 0;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      /* Checkbox Lists */
      .markdown-preview input[type="checkbox"] {
        margin-right: 0.5em;
        accent-color: #3b82f6;
      }

      /* Estilos para Mermaid */
      .markdown-preview .mermaid-container {
        margin: 2rem 0;
        padding: 1.5rem;
        background-color: #1e293b;
        border-radius: 0.75rem;
        border: 1px solid #334155;
        overflow-x: auto;
      }

      .markdown-preview .mermaid {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .markdown-preview .mermaid svg {
        max-width: 100%;
        height: auto;
      }
    `}</style>
    );
};
