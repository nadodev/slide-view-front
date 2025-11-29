/**
 * @fileoverview Utilitários para gerenciamento de storage
 * Abstração sobre localStorage/sessionStorage com type safety
 */

import { STORAGE_KEYS } from '../config';
import type { Slide, User } from '../types';

// ============================================
// TYPES
// ============================================

type StorageType = 'local' | 'session';

interface StorageOptions {
  type?: StorageType;
  expiry?: number; // em minutos
}

interface StorageItem<T> {
  value: T;
  expiry?: number;
}

// ============================================
// CORE STORAGE FUNCTIONS
// ============================================

function getStorage(type: StorageType): Storage {
  return type === 'session' ? sessionStorage : localStorage;
}

/**
 * Salva um item no storage com tipagem
 */
export function setItem<T>(
  key: string,
  value: T,
  options: StorageOptions = {}
): boolean {
  try {
    const storage = getStorage(options.type || 'local');
    
    const item: StorageItem<T> = {
      value,
      ...(options.expiry && {
        expiry: Date.now() + options.expiry * 60 * 1000,
      }),
    };
    
    storage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Error saving to storage [${key}]:`, error);
    return false;
  }
}

/**
 * Recupera um item do storage com tipagem
 */
export function getItem<T>(
  key: string,
  options: StorageOptions = {}
): T | null {
  try {
    const storage = getStorage(options.type || 'local');
    const itemStr = storage.getItem(key);
    
    if (!itemStr) return null;
    
    const item: StorageItem<T> = JSON.parse(itemStr);
    
    // Verifica expiração
    if (item.expiry && Date.now() > item.expiry) {
      storage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error(`Error reading from storage [${key}]:`, error);
    return null;
  }
}

/**
 * Remove um item do storage
 */
export function removeItem(
  key: string,
  options: StorageOptions = {}
): boolean {
  try {
    const storage = getStorage(options.type || 'local');
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage [${key}]:`, error);
    return false;
  }
}

/**
 * Limpa todo o storage
 */
export function clearStorage(options: StorageOptions = {}): boolean {
  try {
    const storage = getStorage(options.type || 'local');
    storage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

// ============================================
// DOMAIN-SPECIFIC STORAGE FUNCTIONS
// ============================================

/**
 * Salva slides no storage
 */
export function saveSlides(slides: Slide[]): boolean {
  return setItem(STORAGE_KEYS.SLIDES, slides);
}

/**
 * Carrega slides do storage
 */
export function loadSlides(): Slide[] {
  return getItem<Slide[]>(STORAGE_KEYS.SLIDES) || [];
}

/**
 * Limpa slides do storage
 */
export function clearSlides(): boolean {
  return removeItem(STORAGE_KEYS.SLIDES);
}

/**
 * Salva preferência de alto contraste
 */
export function saveHighContrast(enabled: boolean): boolean {
  return setItem(STORAGE_KEYS.HIGH_CONTRAST, enabled);
}

/**
 * Carrega preferência de alto contraste
 */
export function loadHighContrast(): boolean {
  return getItem<boolean>(STORAGE_KEYS.HIGH_CONTRAST) ?? false;
}

/**
 * Salva preferências do editor
 */
export function saveEditorPreferences(prefs: Record<string, unknown>): boolean {
  return setItem(STORAGE_KEYS.EDITOR_PREFERENCES, prefs);
}

/**
 * Carrega preferências do editor
 */
export function loadEditorPreferences(): Record<string, unknown> {
  return getItem<Record<string, unknown>>(STORAGE_KEYS.EDITOR_PREFERENCES) || {};
}

// ============================================
// AUTH STORAGE (Preparação para Laravel)
// ============================================

/**
 * Salva token de autenticação
 */
export function saveAuthToken(token: string): boolean {
  return setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Carrega token de autenticação
 */
export function loadAuthToken(): string | null {
  return getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Remove token de autenticação
 */
export function removeAuthToken(): boolean {
  return removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Salva dados do usuário
 */
export function saveUser(user: User): boolean {
  return setItem(STORAGE_KEYS.USER, user);
}

/**
 * Carrega dados do usuário
 */
export function loadUser(): User | null {
  return getItem<User>(STORAGE_KEYS.USER);
}

/**
 * Remove dados do usuário (logout)
 */
export function removeUser(): boolean {
  return removeItem(STORAGE_KEYS.USER);
}

/**
 * Limpa todos os dados de autenticação
 */
export function clearAuthData(): boolean {
  return removeAuthToken() && removeUser();
}

