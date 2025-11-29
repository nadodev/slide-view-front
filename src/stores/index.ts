/**
 * @fileoverview Barrel file para stores Zustand
 */

export { useEditorStore } from './useEditorStore';
export { useFileStore } from './useFileStore';
export { useUIStore } from './useUIStore';
export { 
  usePresentationStore, 
  useSlideNavigation, 
  usePresentationModes 
} from './usePresentationStore';
export { 
  useThemeStore, 
  useTheme,
  type Theme,
  type ResolvedTheme,
} from './useThemeStore';
export {
  useAuthStore,
  useAuth,
  type User,
  type Plan,
} from './useAuthStore';
export {
  usePresentationsStore,
  usePresentations,
} from './usePresentationsStore';

