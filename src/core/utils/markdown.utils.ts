/**
 * @fileoverview Utilitários para manipulação de Markdown
 * Funções puras e reutilizáveis para processamento de markdown
 */

import { marked } from 'marked';
import hljs from 'highlight.js';
import { EDITOR_CONFIG } from '../config';
import type { Slide, MarkdownFile } from '../types';

// ============================================
// INTERFACES
// ============================================

interface ExtractedNotes {
  clean: string;
  notes: string[];
}

interface ParseResult {
  html: string;
  error?: string;
}

// ============================================
// CONFIGURAÇÃO DO MARKED
// ============================================

marked.setOptions({
  breaks: true,
  gfm: true,
});

const renderer = new marked.Renderer();

renderer.code = function(code: { text: string; lang?: string; escaped?: boolean }) {
  const { text, lang } = code;
  
  // Suporte para Mermaid
  if (lang === 'mermaid') {
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
    return `<div class="mermaid-container"><div class="mermaid" id="${id}">${text.trim()}</div></div>`;
  }
  
  // Highlight.js para outras linguagens
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<pre class="code-block"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    } catch {
      // Fallback para auto-detection
    }
  }
  
  const highlighted = hljs.highlightAuto(text).value;
  return `<pre class="code-block"><code class="hljs">${highlighted}</code></pre>`;
};

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Extrai notas do apresentador do conteúdo markdown
 * @example
 * const { clean, notes } = extractNotes('# Slide\n<!-- note: nota do apresentador -->');
 */
export function extractNotes(text: string): ExtractedNotes {
  const notes: string[] = [];
  
  if (!text) {
    return { clean: '', notes };
  }
  
  const cleaned = text.replace(
    /<!--\s*note:\s*([\s\S]*?)-->/gi,
    (_match, note) => {
      if (note?.trim()) {
        notes.push(note.trim());
      }
      return '';
    }
  );
  
  return { clean: cleaned.trim(), notes };
}

/**
 * Converte markdown para HTML com syntax highlighting
 */
export function parseMarkdown(markdown: string): ParseResult {
  try {
    let html = marked.parse(markdown || '', { renderer }) as string;
    
    // Normaliza classes de code blocks
    html = html
      .replace(/<pre><code class="language-(\w+)">/g, '<pre class="code-block"><code class="hljs language-$1">')
      .replace(/<pre><code>/g, '<pre class="code-block"><code class="hljs">');
    
    // Adiciona IDs aos headings para navegação
    html = html.replace(/<h([1-6])>(.*?)<\/h\1>/gi, (_, level, content) => {
      const textContent = content.replace(/<[^>]*>/g, '');
      const id = generateSlug(textContent);
      return `<h${level} id="${id}">${content}</h${level}>`;
    });
    
    return { html };
  } catch (error) {
    return { 
      html: '<p style="color:#f87171">Erro ao renderizar markdown.</p>',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Gera um slug a partir de texto (para IDs de headings)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Divide um arquivo markdown em múltiplos slides baseado em delimitador
 */
export function splitMarkdownByDelimiter(
  content: string,
  delimiter: string = EDITOR_CONFIG.DEFAULT_DELIMITER
): string[] {
  const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineRegex = new RegExp(`^\\s*${escapedDelimiter}\\s*$`, 'gm');
  
  let parts = content
    .split(lineRegex)
    .map(part => part.trim())
    .filter(Boolean);
  
  // Fallback para split inline
  if (parts.length <= 1) {
    const altRegex = new RegExp(`\\r?\\n\\s*${escapedDelimiter}\\s*\\r?\\n`);
    parts = content
      .split(altRegex)
      .map(part => part.trim())
      .filter(Boolean);
  }
  
  return parts;
}

/**
 * Cria um objeto Slide a partir de conteúdo markdown
 */
export function createSlideFromContent(
  content: string,
  name: string,
  index?: number
): Slide {
  const { clean, notes } = extractNotes(content);
  const { html } = parseMarkdown(clean);
  
  return {
    name: name.replace('.md', '') + (index !== undefined ? `-${index + 1}` : ''),
    content: clean,
    notes,
    html,
  };
}

/**
 * Cria slides a partir de arquivos markdown
 */
export async function createSlidesFromFiles(files: File[]): Promise<Slide[]> {
  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
  
  return Promise.all(
    sortedFiles.map(async (file) => {
      const content = await file.text();
      return createSlideFromContent(content, file.name);
    })
  );
}

/**
 * Cria slides a partir de MarkdownFiles
 */
export function createSlidesFromMarkdownFiles(files: MarkdownFile[]): Slide[] {
  return files
    .filter(file => file.content.trim())
    .map(file => createSlideFromContent(file.content, file.name));
}

/**
 * Combina múltiplos slides em um único markdown
 */
export function combineSlidesToMarkdown(
  slides: Slide[],
  delimiter: string = EDITOR_CONFIG.DEFAULT_DELIMITER
): string {
  return slides
    .map(slide => slide.content || '')
    .join(`\n\n${delimiter}\n\n`);
}

// ============================================
// FORMAT HELPERS
// ============================================

/**
 * Aplica formatação markdown ao texto selecionado
 */
export function applyMarkdownFormat(
  content: string,
  start: number,
  end: number,
  before: string,
  after: string = '',
  placeholder: string = 'texto'
): { newContent: string; newCursorPos: number } {
  const selectedText = content.substring(start, end);
  
  if (selectedText) {
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    return {
      newContent,
      newCursorPos: start + before.length + selectedText.length + after.length,
    };
  }
  
  const newContent = 
    content.substring(0, start) + 
    before + placeholder + after + 
    content.substring(end);
  
  return {
    newContent,
    newCursorPos: start + before.length + placeholder.length,
  };
}

/**
 * Verifica se deve mostrar o menu de comandos slash
 */
export function shouldShowSlashMenu(
  content: string,
  cursorPos: number
): { show: boolean; query: string } {
  const textBeforeCursor = content.substring(0, cursorPos);
  const lastLine = textBeforeCursor.split('\n').pop() || '';
  
  if (lastLine === '/') {
    return { show: true, query: '' };
  }
  
  if (lastLine.startsWith('/') && !lastLine.includes(' ')) {
    return { show: true, query: lastLine.substring(1) };
  }
  
  return { show: false, query: '' };
}

/**
 * Insere comando slash no conteúdo
 */
export function insertSlashCommand(
  content: string,
  cursorPos: number,
  commandContent: string
): { newContent: string; newCursorPos: number } {
  let slashPos = cursorPos - 1;
  
  while (slashPos >= 0 && content[slashPos] !== '/' && content[slashPos] !== '\n') {
    slashPos--;
  }
  
  if (slashPos < 0 || content[slashPos] !== '/') {
    return { newContent: content, newCursorPos: cursorPos };
  }
  
  const beforeSlash = content.substring(0, slashPos);
  const afterCursor = content.substring(cursorPos);
  const newContent = beforeSlash + commandContent + afterCursor;
  
  return {
    newContent,
    newCursorPos: slashPos + commandContent.length,
  };
}

