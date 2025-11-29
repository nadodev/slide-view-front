/**
 * @fileoverview Tipos centralizados do domínio da aplicação
 * Todos os tipos principais devem ser definidos aqui para consistência
 */

// ============================================
// SLIDE TYPES
// ============================================

export interface Slide {
  id?: string;
  name?: string;
  content?: string;
  notes?: string[];
  html?: string;
  _fileHandle?: FileSystemFileHandle;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SlideCreateDTO {
  name: string;
  content: string;
  notes?: string[];
}

export interface SlideUpdateDTO {
  name?: string;
  content?: string;
  notes?: string[];
}

// ============================================
// FILE TYPES
// ============================================

export interface MarkdownFile {
  id: string;
  name: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FileUploadOptions {
  splitSingle?: boolean;
  delimiter?: string;
}

// ============================================
// PRESENTATION TYPES
// ============================================

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PresentationState {
  currentSlide: number;
  totalSlides: number;
  isPresenting: boolean;
  isFocusMode: boolean;
}

// ============================================
// REMOTE CONTROL TYPES
// ============================================

export type RemoteCommandType = 
  | 'next' 
  | 'previous' 
  | 'goto' 
  | 'scroll' 
  | 'scroll-sync' 
  | 'presenter' 
  | 'focus';

export interface RemoteCommand {
  command: RemoteCommandType;
  slideIndex?: number;
  scrollDirection?: 'up' | 'down';
  scrollPosition?: number;
  toggle?: boolean;
  fromClient?: string;
}

export interface SessionData {
  sessionId: string;
  qrUrl: string;
  remoteClients: string[];
  isConnected: boolean;
}

// ============================================
// EDITOR TYPES
// ============================================

export type EditorMode = 'edit' | 'create' | 'view';

export interface EditorState {
  content: string;
  mode: EditorMode;
  showPreview: boolean;
  focusMode: boolean;
}

export interface FormatAction {
  before: string;
  after: string;
  placeholder?: string;
}

// ============================================
// API TYPES (Preparação para Laravel)
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

// ============================================
// USER TYPES (Futuro)
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

