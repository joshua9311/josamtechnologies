import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  images?: string[];
  imageUrl?: string;
  currentIndex?: number;
  title?: string;
  category?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  images = [],
  imageUrl,
  currentIndex = 0,
  title,
  category,
  onClose,
  onPrev,
  onNext,
}) => {
  const allImages = images.length > 0 ? images : imageUrl ? [imageUrl] : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || allImages.length === 0) return null;

  const currentImage = allImages[currentIndex] || allImages[0];

  return (
    <div
      id="lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        id="lightbox-close-btn"
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors"
        aria-label="Close preview"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {allImages.length > 1 && onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {allImages.length > 1 && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage}
          alt={title || 'Josam Technologies Graphic Preview'}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-zinc-800"
        />

        {/* Caption Bar */}
        <div className="mt-4 text-center max-w-xl">
          {category && (
            <span className="inline-block px-2.5 py-0.5 mb-1.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {category}
            </span>
          )}
          {title && <h3 className="text-base font-bold text-white">{title}</h3>}
          {allImages.length > 1 && (
            <span className="text-xs text-zinc-400 block mt-1">
              Image {currentIndex + 1} of {allImages.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
