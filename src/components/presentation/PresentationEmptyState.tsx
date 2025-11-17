import type { ChangeEvent } from "react";
import UploadArea from "../UploadArea";
import { Sparkles, AlertCircle } from "lucide-react";

type PresentationEmptyStateProps = {
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onFilesChange?: (
    e: ChangeEvent<HTMLInputElement> | null,
    options?: any,
  ) => void;
  onAIGenerate?: (prompt: string, slideCount: number, baseText?: string) => void;
  loading: boolean;
  error: string;
  warning: string;
};

export default function PresentationEmptyState({
  highContrast,
  onToggleHighContrast,
  onFilesChange,
  onAIGenerate,
  loading,
  error,
  warning,
}: PresentationEmptyStateProps) {
  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      <div className="absolute right-4 top-4">
        <button
          className="reload-btn"
          onClick={onToggleHighContrast}
          aria-pressed={highContrast}
          aria-label="Alternar alto contraste"
        >
          {highContrast ? "Contraste Padrão" : "Alto Contraste"}
        </button>
      </div>

      <UploadArea
        onFilesChange={onFilesChange}
        onAIGenerate={onAIGenerate}
        loading={loading}
      />

      {loading && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 px-4 py-2 text-white shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="message error">
          <AlertCircle /> {error}
        </div>
      )}

      {warning && (
        <div
          className="message"
          style={{
            color: "#a16207",
            background: "#fff7ed",
            padding: 8,
            borderRadius: 6,
          }}
        >
          {warning}
        </div>
      )}
    </div>
  );
}

