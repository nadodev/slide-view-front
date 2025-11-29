/**
 * @fileoverview Serviço de exportação de apresentações
 * Suporta: PDF, PowerPoint (PPTX), Imagens (JPG/PNG)
 */

import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { parseMarkdown } from '../../core';

export interface SlideData {
    id?: number;
    title?: string;
    content: string;
    notes?: string;
}

export interface ExportOptions {
    title: string;
    author?: string;
    slides: SlideData[];
    format: 'pdf' | 'pptx' | 'jpg' | 'png';
    quality?: number; // 0-1 para imagens
    includeNotes?: boolean;
}

export interface ExportProgress {
    current: number;
    total: number;
    status: string;
}

type ProgressCallback = (progress: ExportProgress) => void;

class ExportService {
    /**
     * Exportar apresentação
     */
    async export(
        options: ExportOptions,
        onProgress?: ProgressCallback
    ): Promise<Blob | Blob[]> {
        switch (options.format) {
            case 'pdf':
                return this.exportToPDF(options, onProgress);
            case 'pptx':
                return this.exportToPPTX(options, onProgress);
            case 'jpg':
            case 'png':
                return this.exportToImages(options, onProgress);
            default:
                throw new Error(`Formato não suportado: ${options.format}`);
        }
    }

    /**
     * Exportar para PDF
     */
    private async exportToPDF(
        options: ExportOptions,
        onProgress?: ProgressCallback
    ): Promise<Blob> {
        const { title, author, slides } = options;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [1920, 1080],
        });

        const total = slides.length;

        for (let i = 0; i < slides.length; i++) {
            onProgress?.({
                current: i + 1,
                total,
                status: `Processando slide ${i + 1} de ${total}...`,
            });

            if (i > 0) {
                pdf.addPage([1920, 1080], 'landscape');
            }

            // Criar elemento temporário para renderizar o slide
            const slideElement = await this.createSlideElement(slides[i]);
            
            // Capturar como imagem
            const canvas = await html2canvas(slideElement, {
                width: 1920,
                height: 1080,
                scale: 1,
                backgroundColor: '#0f172a',
                logging: false,
            });

            // Adicionar ao PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 0, 0, 1920, 1080);

            // Remover elemento temporário
            slideElement.remove();
        }

        // Adicionar metadados
        pdf.setProperties({
            title: title,
            author: author || 'SlideMD',
            creator: 'SlideMD',
        });

        onProgress?.({
            current: total,
            total,
            status: 'Finalizando PDF...',
        });

        return pdf.output('blob');
    }

    /**
     * Exportar para PowerPoint
     */
    private async exportToPPTX(
        options: ExportOptions,
        onProgress?: ProgressCallback
    ): Promise<Blob> {
        const { title, author, slides, includeNotes } = options;
        
        const pptx = new pptxgen();
        pptx.title = title;
        pptx.author = author || 'SlideMD';
        pptx.company = 'SlideMD';
        pptx.layout = 'LAYOUT_WIDE'; // 16:9

        const total = slides.length;

        for (let i = 0; i < slides.length; i++) {
            onProgress?.({
                current: i + 1,
                total,
                status: `Processando slide ${i + 1} de ${total}...`,
            });

            const slideData = slides[i];
            const slide = pptx.addSlide();

            // Background escuro
            slide.background = { color: '0f172a' };

            // Criar elemento para captura
            const slideElement = await this.createSlideElement(slideData);
            
            // Capturar como imagem
            const canvas = await html2canvas(slideElement, {
                width: 1920,
                height: 1080,
                scale: 1,
                backgroundColor: '#0f172a',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            
            // Adicionar imagem do slide
            slide.addImage({
                data: imgData,
                x: 0,
                y: 0,
                w: '100%',
                h: '100%',
            });

            // Adicionar notas se existirem
            if (includeNotes && slideData.notes) {
                slide.addNotes(slideData.notes);
            }

            slideElement.remove();
        }

        onProgress?.({
            current: total,
            total,
            status: 'Gerando arquivo PowerPoint...',
        });

        const pptxBlob = await pptx.write({ outputType: 'blob' });
        return pptxBlob as Blob;
    }

    /**
     * Exportar para Imagens (JPG/PNG)
     */
    private async exportToImages(
        options: ExportOptions,
        onProgress?: ProgressCallback
    ): Promise<Blob[]> {
        const { slides, format, quality = 0.95 } = options;
        const images: Blob[] = [];
        const total = slides.length;

        for (let i = 0; i < slides.length; i++) {
            onProgress?.({
                current: i + 1,
                total,
                status: `Gerando imagem ${i + 1} de ${total}...`,
            });

            const slideElement = await this.createSlideElement(slides[i]);
            
            const canvas = await html2canvas(slideElement, {
                width: 1920,
                height: 1080,
                scale: 2, // Alta resolução
                backgroundColor: '#0f172a',
                logging: false,
            });

            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob(
                    (b) => resolve(b!),
                    mimeType,
                    quality
                );
            });

            images.push(blob);
            slideElement.remove();
        }

        return images;
    }

    /**
     * Criar elemento DOM temporário para o slide
     */
    private async createSlideElement(slide: SlideData): Promise<HTMLElement> {
        const { html } = parseMarkdown(slide.content);

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 1920px;
            height: 1080px;
            background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
            padding: 80px;
            box-sizing: border-box;
            font-family: system-ui, -apple-system, sans-serif;
            overflow: hidden;
        `;

        // Estilos para o conteúdo Markdown
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = html;
        contentDiv.style.cssText = `
            color: #e2e8f0;
            font-size: 32px;
            line-height: 1.6;
        `;

        // Aplicar estilos inline para elementos
        this.applyInlineStyles(contentDiv);

        container.appendChild(contentDiv);
        document.body.appendChild(container);

        // Aguardar renderização
        await new Promise((r) => setTimeout(r, 100));

        return container;
    }

    /**
     * Aplicar estilos inline aos elementos do markdown
     */
    private applyInlineStyles(element: HTMLElement): void {
        // H1
        element.querySelectorAll('h1').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                font-size: 72px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 40px;
                border-bottom: 4px solid rgba(59, 130, 246, 0.3);
                padding-bottom: 20px;
            `;
        });

        // H2
        element.querySelectorAll('h2').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                font-size: 56px;
                font-weight: 600;
                color: #60a5fa;
                margin-top: 50px;
                margin-bottom: 30px;
            `;
        });

        // H3
        element.querySelectorAll('h3').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                font-size: 44px;
                font-weight: 600;
                color: #93c5fd;
                margin-top: 40px;
                margin-bottom: 20px;
            `;
        });

        // Parágrafos
        element.querySelectorAll('p').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                font-size: 32px;
                color: #cbd5e1;
                margin-bottom: 24px;
                line-height: 1.7;
            `;
        });

        // Listas
        element.querySelectorAll('ul, ol').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                font-size: 32px;
                color: #cbd5e1;
                padding-left: 50px;
                margin: 24px 0;
            `;
        });

        element.querySelectorAll('li').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                margin-bottom: 16px;
                color: #cbd5e1;
            `;
        });

        // Código inline
        element.querySelectorAll('code').forEach((el) => {
            if (el.parentElement?.tagName !== 'PRE') {
                (el as HTMLElement).style.cssText = `
                    background: rgba(30, 41, 59, 0.8);
                    color: #93c5fd;
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-family: 'Fira Code', monospace;
                    font-size: 28px;
                `;
            }
        });

        // Blocos de código
        element.querySelectorAll('pre').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                background: rgba(15, 23, 42, 0.8);
                border: 2px solid rgba(59, 130, 246, 0.2);
                border-radius: 16px;
                padding: 24px 32px;
                overflow: hidden;
                margin: 32px 0;
            `;
            const code = el.querySelector('code');
            if (code) {
                (code as HTMLElement).style.cssText = `
                    font-family: 'Fira Code', monospace;
                    font-size: 24px;
                    color: #e2e8f0;
                `;
            }
        });

        // Citações
        element.querySelectorAll('blockquote').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                border-left: 6px solid #3b82f6;
                background: rgba(59, 130, 246, 0.1);
                padding: 24px 32px;
                border-radius: 0 16px 16px 0;
                margin: 32px 0;
            `;
        });

        // Tabelas
        element.querySelectorAll('table').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                width: 100%;
                border-collapse: collapse;
                margin: 32px 0;
            `;
        });

        element.querySelectorAll('th').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                background: rgba(30, 41, 59, 0.8);
                color: #ffffff;
                font-weight: 600;
                text-align: left;
                padding: 16px 24px;
                border: 2px solid rgba(59, 130, 246, 0.2);
                font-size: 28px;
            `;
        });

        element.querySelectorAll('td').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                padding: 16px 24px;
                border: 2px solid rgba(59, 130, 246, 0.15);
                color: #cbd5e1;
                font-size: 28px;
            `;
        });

        // Strong
        element.querySelectorAll('strong').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                color: #ffffff;
                font-weight: 600;
            `;
        });

        // Em
        element.querySelectorAll('em').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                color: #93c5fd;
            `;
        });

        // Links
        element.querySelectorAll('a').forEach((el) => {
            (el as HTMLElement).style.cssText = `
                color: #60a5fa;
                text-decoration: none;
            `;
        });
    }

    /**
     * Download de um blob
     */
    downloadBlob(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Download de múltiplos blobs como ZIP
     */
    async downloadAsZip(blobs: Blob[], baseName: string, extension: string): Promise<void> {
        // Para simplificar, vamos baixar individualmente
        // Em produção, usaríamos JSZip
        for (let i = 0; i < blobs.length; i++) {
            this.downloadBlob(blobs[i], `${baseName}_slide_${i + 1}.${extension}`);
            await new Promise((r) => setTimeout(r, 500)); // Delay entre downloads
        }
    }
}

export const exportService = new ExportService();

