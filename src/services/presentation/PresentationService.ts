/**
 * @fileoverview Presentation Service
 * @deprecated Este service está sendo substituído pelo core/api/repositories
 * Mantido para compatibilidade retroativa, use presentationRepository de core
 */

import { 
  Slide, 
  extractNotes, 
  parseMarkdown, 
  saveSlides as coreSaveSlides, 
  loadSlides as coreLoadSlides,
  createSlidesFromFiles as coreCreateSlidesFromFiles,
} from '../../core';

export const presentationService = {
  /**
   * @deprecated Use `loadSlides` de @core/utils/storage.utils
   */
  loadSlides(): Slide[] {
    return coreLoadSlides();
  },

  /**
   * @deprecated Use `saveSlides` de @core/utils/storage.utils
   */
  saveSlides(slides: Slide[]): void {
    coreSaveSlides(slides);
  },

  /**
   * @deprecated Use `parseMarkdown` de @core/utils/markdown.utils
   */
  parseMarkdown(content: string): string {
    const { html } = parseMarkdown(content);
    return html;
  },

  /**
   * @deprecated Use `extractNotes` de @core/utils/markdown.utils
   */
  extractNotes,

  /**
   * @deprecated Use `createSlidesFromFiles` de @core/utils/markdown.utils
   */
  async createSlidesFromFiles(files: File[]): Promise<Slide[]> {
    return coreCreateSlidesFromFiles(files);
  }
};
