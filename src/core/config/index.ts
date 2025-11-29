/**
 * @fileoverview Configurações centralizadas da aplicação
 * Todas as constantes, URLs e configurações devem vir daqui
 */

// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || window.location.origin,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  SLIDES: 'presentation-slides',
  HIGH_CONTRAST: 'presentation-high-contrast',
  EDITOR_PREFERENCES: 'editor-preferences',
  AUTH_TOKEN: 'auth-token',
  USER: 'user-data',
} as const;

// ============================================
// EDITOR CONFIGURATION
// ============================================

export const EDITOR_CONFIG = {
  DEFAULT_DELIMITER: "----'----",
  AUTO_SAVE_DELAY: 2000, // ms
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_EXTENSIONS: ['.md', '.markdown', '.txt'],
} as const;

// ============================================
// PRESENTATION CONFIGURATION
// ============================================

export const PRESENTATION_CONFIG = {
  TRANSITIONS: ['fade', 'slide', 'zoom', 'none'] as const,
  DEFAULT_TRANSITION: 'fade',
  SCROLL_AMOUNT: 200,
  ANIMATION_DURATION: 300, // ms
} as const;

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

export const KEYBOARD_SHORTCUTS = {
  NEXT_SLIDE: ['ArrowRight', 'Space', 'PageDown'],
  PREV_SLIDE: ['ArrowLeft', 'PageUp'],
  FIRST_SLIDE: ['Home'],
  LAST_SLIDE: ['End'],
  EDIT: ['e', 'E'],
  DUPLICATE: ['d', 'D'], // with Ctrl
  FOCUS_MODE: ['h', 'H'],
  PRESENTER_MODE: ['p', 'P'],
  FULLSCREEN: ['f', 'F'],
  HELP: ['?'],
  SAVE: ['s', 'S'], // with Ctrl
  ESCAPE: ['Escape'],
} as const;

// ============================================
// MARKDOWN FORMATS
// ============================================

export const MARKDOWN_FORMATS = {
  BOLD: { before: '**', after: '**', placeholder: 'texto em negrito' },
  ITALIC: { before: '_', after: '_', placeholder: 'texto em itálico' },
  CODE: { before: '`', after: '`', placeholder: 'código' },
  LINK: { before: '[', after: '](url)', placeholder: 'texto do link' },
  HEADING1: { before: '# ', after: '', placeholder: 'Título' },
  HEADING2: { before: '## ', after: '', placeholder: 'Subtítulo' },
  HEADING3: { before: '### ', after: '', placeholder: 'Seção' },
  QUOTE: { before: '> ', after: '', placeholder: 'citação' },
  LIST: { before: '- ', after: '', placeholder: 'item da lista' },
  NUMBERED_LIST: { before: '1. ', after: '', placeholder: 'item numerado' },
  CODE_BLOCK: { before: '```\n', after: '\n```', placeholder: 'código aqui' },
} as const;

// ============================================
// THEME CONFIGURATION
// ============================================

export const THEME_CONFIG = {
  COLORS: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textMuted: '#9ca3af',
  },
  FONT_FAMILIES: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro inesperado. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  FILE_TOO_LARGE: 'O arquivo é muito grande. Máximo: 10MB.',
  INVALID_FILE_TYPE: 'Tipo de arquivo não suportado.',
  DELIMITER_NOT_FOUND: 'Marcador não encontrado — nenhum slide foi carregado.',
  SAVE_FAILED: 'Não foi possível salvar. Seu navegador pode não suportar.',
  AI_GENERATION_FAILED: 'Erro ao gerar slides com IA.',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  SLIDES_LOADED: (count: number) => `${count} slide(s) carregado(s) com sucesso!`,
  SLIDES_SAVED: 'Apresentação salva com sucesso!',
  AI_GENERATED: (count: number) => `✨ ${count} slides gerados com sucesso usando IA!`,
  FILE_EXPORTED: 'Arquivo exportado com sucesso!',
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURE_FLAGS = {
  AI_GENERATION: true,
  GITHUB_INTEGRATION: true,
  REMOTE_CONTROL: true,
  EXPORT_PDF: true,
  COLLABORATIVE_EDITING: false, // futuro
  CLOUD_SYNC: false, // futuro com Laravel
} as const;

