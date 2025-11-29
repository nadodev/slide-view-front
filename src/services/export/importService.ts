/**
 * @fileoverview Serviço de importação de PDFs para slides
 * Permite carregar PDF e marcar quebras para criar slides
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker do PDF.js
// O arquivo pdf.worker.min.mjs está na pasta public e será servido automaticamente
// Em desenvolvimento: servido pelo Vite da pasta public
// Em produção: copiado para dist e servido pelo Express
const workerUrl = import.meta.env.DEV 
  ? '/pdf.worker.min.mjs'  // Desenvolvimento: Vite serve da pasta public
  : '/pdf.worker.min.mjs';  // Produção: Express serve da pasta dist

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PDFPageInfo {
    pageNumber: number;
    width: number;
    height: number;
    imageData?: string;
}

export interface SlideBreak {
    id: string;
    pageNumber: number;
    startY: number;
    endY: number;
    title?: string;
}

export interface ImportedSlide {
    title: string;
    content: string;
    imageData?: string;
    sourcePages: number[];
}

export interface ImportProgress {
    current: number;
    total: number;
    status: string;
}

type ProgressCallback = (progress: ImportProgress) => void;

class ImportService {
    private pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
    private pages: PDFPageInfo[] = [];

    async loadPDF(
        file: File,
        onProgress?: ProgressCallback
    ): Promise<PDFPageInfo[]> {
        onProgress?.({
            current: 0,
            total: 1,
            status: 'Carregando PDF...',
        });

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

        this.pdfDocument = await loadingTask.promise;
        const numPages = this.pdfDocument.numPages;
        this.pages = [];

        for (let i = 1; i <= numPages; i++) {
            onProgress?.({
                current: i,
                total: numPages,
                status: `Processando página ${i} de ${numPages}...`,
            });

            const page = await this.pdfDocument.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport,
            }).promise;

            const imageData = canvas.toDataURL('image/jpeg', 0.8);

            this.pages.push({
                pageNumber: i,
                width: viewport.width,
                height: viewport.height,
                imageData,
            });
        }

        return this.pages;
    }

    getPages(): PDFPageInfo[] {
        return this.pages;
    }

    async extractTextFromPage(pageNumber: number): Promise<string> {
        if (!this.pdfDocument) {
            throw new Error('Nenhum PDF carregado');
        }

        const page = await this.pdfDocument.getPage(pageNumber);
        const textContent = await page.getTextContent();
        
        return textContent.items
            .map((item) => {
                if ('str' in item) {
                    return item.str;
                }
                return '';
            })
            .join(' ');
    }

    async extractAllText(onProgress?: ProgressCallback): Promise<string[]> {
        if (!this.pdfDocument) {
            throw new Error('Nenhum PDF carregado');
        }

        const texts: string[] = [];
        const numPages = this.pdfDocument.numPages;

        for (let i = 1; i <= numPages; i++) {
            onProgress?.({
                current: i,
                total: numPages,
                status: `Extraindo texto da página ${i}...`,
            });

            const text = await this.extractTextFromPage(i);
            texts.push(text);
        }

        return texts;
    }

    async convertBreaksToSlides(
        breaks: SlideBreak[],
        onProgress?: ProgressCallback
    ): Promise<ImportedSlide[]> {
        if (!this.pdfDocument || this.pages.length === 0) {
            throw new Error('Nenhum PDF carregado');
        }

        const slides: ImportedSlide[] = [];
        const total = breaks.length;

        const sortedBreaks = [...breaks].sort((a, b) => {
            if (a.pageNumber !== b.pageNumber) {
                return a.pageNumber - b.pageNumber;
            }
            return a.startY - b.startY;
        });

        for (let i = 0; i < sortedBreaks.length; i++) {
            const breakInfo = sortedBreaks[i];
            
            onProgress?.({
                current: i + 1,
                total,
                status: `Criando slide ${i + 1} de ${total}...`,
            });

            const text = await this.extractTextFromPage(breakInfo.pageNumber);
            
            const slideContent = this.createSlideContent(
                breakInfo.title || `Slide ${i + 1}`,
                text
            );

            slides.push({
                title: breakInfo.title || `Slide ${i + 1}`,
                content: slideContent,
                sourcePages: [breakInfo.pageNumber],
            });
        }

        return slides;
    }

    async createSlidesFromPages(
        onProgress?: ProgressCallback
    ): Promise<ImportedSlide[]> {
        if (!this.pdfDocument || this.pages.length === 0) {
            throw new Error('Nenhum PDF carregado');
        }

        const slides: ImportedSlide[] = [];
        const numPages = this.pages.length;

        for (let i = 0; i < numPages; i++) {
            onProgress?.({
                current: i + 1,
                total: numPages,
                status: `Criando slide ${i + 1} de ${numPages}...`,
            });

            const text = await this.extractTextFromPage(i + 1);
            
            const lines = text.split(/\n|\s{3,}/).filter(l => l.trim());
            const title = lines[0]?.trim().substring(0, 50) || `Slide ${i + 1}`;
            const body = lines.slice(1).join('\n');

            const content = `# ${title}\n\n${body}`;

            slides.push({
                title,
                content,
                imageData: this.pages[i].imageData,
                sourcePages: [i + 1],
            });
        }

        return slides;
    }

    private createSlideContent(title: string, text: string): string {
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
        
        let content = `# ${title}\n\n`;

        if (sentences.length <= 3) {
            content += sentences.join('\n\n');
        } else {
            content += sentences.map(s => `- ${s.trim()}`).join('\n');
        }

        return content;
    }

    async detectTitles(): Promise<{ pageNumber: number; title: string; y: number }[]> {
        if (!this.pdfDocument) {
            throw new Error('Nenhum PDF carregado');
        }

        const titles: { pageNumber: number; title: string; y: number }[] = [];

        for (let i = 1; i <= this.pdfDocument.numPages; i++) {
            const page = await this.pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            
            let largestFontSize = 0;
            let possibleTitle = '';
            let titleY = 0;

            for (const item of textContent.items) {
                if ('str' in item && 'height' in item) {
                    const fontSize = item.height;
                    if (fontSize > largestFontSize && item.str.trim().length > 3) {
                        largestFontSize = fontSize;
                        possibleTitle = item.str.trim();
                        if ('transform' in item) {
                            titleY = item.transform[5];
                        }
                    }
                }
            }

            if (possibleTitle) {
                titles.push({
                    pageNumber: i,
                    title: possibleTitle.substring(0, 50),
                    y: titleY,
                });
            }
        }

        return titles;
    }

    cleanup(): void {
        if (this.pdfDocument) {
            this.pdfDocument.destroy();
            this.pdfDocument = null;
        }
        this.pages = [];
    }
}

export const importService = new ImportService();

