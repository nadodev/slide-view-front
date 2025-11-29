import { Trash2Icon, GripVertical } from "lucide-react";
import type { Slide } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../shared/components/ui/alert-dialog";
import { useState } from "react";
import { useTheme } from "../../stores/useThemeStore";

type SlideThumbItemProps = {
  index: number;
  slide: Slide;
  previewText: string;
  isActive: boolean;
  canRemove: boolean;
  onSelect: (index: number) => void;
  onRemove?: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
};

export default function SlideThumbItem({
  index,
  slide,
  previewText,
  isActive,
  canRemove,
  onSelect,
  onRemove,
  onReorder,
}: SlideThumbItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { isDark } = useTheme();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);

    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (fromIndex !== index && onReorder) {
      onReorder(fromIndex, index);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  return (
    <li
      className={`relative transition-all duration-150 ${isDragging ? 'opacity-50 scale-95' : ''} ${draggedOver ? '-translate-y-0.5' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {draggedOver && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full z-10" />
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(index)}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(index)}
        className={`group w-full text-left transition-all duration-150 rounded-lg overflow-hidden cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 ring-1 ring-cyan-500/50'
            : isDark 
              ? 'bg-slate-800/50 hover:bg-slate-800/80' 
              : 'bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <div className="flex items-start gap-2 p-2.5">
          <GripVertical
            size={14}
            className={`shrink-0 mt-0.5 cursor-grab active:cursor-grabbing ${
              isActive ? 'text-cyan-400' : isDark ? 'text-slate-600' : 'text-slate-400'
            }`}
          />

          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
              isActive
                ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20'
                : isDark 
                  ? 'bg-slate-700 text-slate-300' 
                  : 'bg-slate-200 text-slate-600'
            }`}
          >
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-semibold leading-tight ${
              isActive 
                ? isDark ? 'text-white' : 'text-slate-900'
                : isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {slide.name || `Slide ${index + 1}`}
            </p>
            <p className={`line-clamp-2 text-xs leading-relaxed mt-0.5 ${
              isActive
                ? isDark ? 'text-slate-400' : 'text-slate-600'
                : isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              {previewText || "Sem conteúdo"}
            </p>
          </div>

          {canRemove && onRemove && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleDeleteClick}
              onKeyDown={(e) => e.key === 'Enter' && handleDeleteClick(e as any)}
              className="h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded shrink-0 cursor-pointer"
              aria-label={`Excluir slide ${index + 1}`}
            >
              <Trash2Icon size={14} />
            </div>
          )}
        </div>

        {isActive && (
          <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500" />
        )}
      </div>

      {/* Dialog de confirmação fora do botão */}
      {canRemove && onRemove && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
            <AlertDialogHeader>
              <AlertDialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Excluir Slide {index + 1}?
              </AlertDialogTitle>
              <AlertDialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : ''}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onRemove(index)}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </li>
  );
}
