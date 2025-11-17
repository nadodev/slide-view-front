import { Trash2 } from "lucide-react";
import type { Slide } from "./types";

type SlideThumbItemProps = {
  index: number;
  slide: Slide;
  previewText: string;
  isActive: boolean;
  canRemove: boolean;
  onSelect: (index: number) => void;
  onRemove?: (index: number) => void;
};

export default function SlideThumbItem({
  index,
  slide,
  previewText,
  isActive,
  canRemove,
  onSelect,
  onRemove,
}: SlideThumbItemProps) {
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!onRemove || !canRemove) return;
    const confirmed = confirm(
      `Tem certeza que deseja excluir o slide ${index + 1}?`,
    );
    if (confirmed) onRemove(index);
  };

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => onSelect(index)}
        className={`group w-full overflow-hidden rounded-xl border text-left transition ${
          isActive
            ? "border-white/20 bg-linear-to-br from-indigo-600/80 to-purple-600/80 shadow-lg shadow-indigo-900/30"
            : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-white/60 group-hover:bg-white/15"
              }`}
            >
              {index + 1}
            </div>

            <div className="min-w-0 flex-1 pr-6">
              {slide.name && (
                <p
                  className={`truncate text-sm font-semibold ${
                    isActive ? "text-white" : "text-white/80"
                  }`}
                >
                  {slide.name}
                </p>
              )}
              <p
                className={`line-clamp-2 text-xs leading-relaxed ${
                  isActive ? "text-white/80" : "text-white/60"
                }`}
              >
                {previewText || "Slide sem conteúdo"}
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <div className="h-1 w-full bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300" />
        )}
      </button>

      {canRemove && onRemove && (
        <button
          type="button"
          aria-label={`Excluir slide ${index + 1}`}
          title="Excluir slide"
          onClick={handleDelete}
          className={`absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-xs text-white/60 opacity-0 transition hover:border-red-400/40 hover:text-red-300 group-hover:opacity-100 ${
            isActive ? "bg-white/10" : "bg-black/30"
          }`}
        >
          <Trash2 size={14} />
        </button>
      )}
    </li>
  );
}

