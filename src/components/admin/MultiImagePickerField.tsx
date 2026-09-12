import React, { useState, useRef } from 'react';
import {
  Upload,
  Link2,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  FolderOpen,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../../lib/api';
import { MediaItem } from '../../types';

export interface MultiImagePickerFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  helpText?: string;
}

export const MultiImagePickerField: React.FC<MultiImagePickerFieldProps> = ({
  label,
  values = [],
  onChange,
  helpText,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await api.uploadMedia(formData);
        if (res.success && res.media?.url) {
          newUrls.push(res.media.url);
        } else {
          // Fallback to data URL
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newUrls.push(dataUrl);
        }
      } catch {
        // Fallback to data URL on error
        try {
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newUrls.push(dataUrl);
        } catch (err: any) {
          setUploadError(`Error loading ${file.name}`);
        }
      }
    }

    if (newUrls.length > 0) {
      onChange([...values, ...newUrls]);
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    onChange([...values, linkInput.trim()]);
    setLinkInput('');
    setShowAddLink(false);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  const openMediaLibrary = async () => {
    setShowMediaLibrary(true);
    setIsLoadingLibrary(true);
    try {
      const items = await api.getAdminMedia();
      setLibraryItems(items || []);
    } catch {
      // Silently handle
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300">
          {label} ({values.length})
        </label>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 text-xs font-semibold transition-colors"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>Add from Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddLink(!showAddLink)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-300 dark:hover:bg-zinc-700 text-xs font-semibold transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Add by Link</span>
          </button>

          <button
            type="button"
            onClick={openMediaLibrary}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-300 dark:hover:bg-zinc-700 text-xs font-semibold transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Library</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleUploadFiles(e.target.files)}
        className="hidden"
      />

      {/* Add Link Input Field */}
      {showAddLink && (
        <div className="p-3 rounded-xl bg-stone-100 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 space-y-2 animate-in fade-in">
          <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-zinc-400">
            Paste Direct Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/gallery-photo.jpg"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs font-mono text-stone-900 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLink();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddLink(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}

      {/* Images Grid */}
      {values.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {values.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-video rounded-xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-zinc-950 shadow-xs"
            >
              <img
                src={url}
                alt={`Gallery item ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!url.startsWith('data:') && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors"
                    title="Open image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500/50 bg-stone-50/50 dark:bg-zinc-950/50 transition-colors"
        >
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            No gallery images added yet. Click to choose pictures from gallery or use the buttons above.
          </p>
        </div>
      )}

      {helpText && (
        <p className="text-[11px] text-stone-500 dark:text-zinc-400">{helpText}</p>
      )}

      {/* Media Library Selector */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-white font-['Outfit']">
                  Choose from Media Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingLibrary ? (
                <div className="py-12 flex flex-col items-center justify-center text-stone-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                  <p className="text-xs">Loading media library...</p>
                </div>
              ) : libraryItems.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-xs">No media files found in library yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {libraryItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onChange([...values, item.url]);
                        setShowMediaLibrary(false);
                      }}
                      className="group cursor-pointer rounded-xl border border-stone-200 dark:border-zinc-800 overflow-hidden hover:border-orange-500 hover:shadow-md transition-all relative aspect-square bg-stone-100 dark:bg-zinc-950 flex flex-col justify-between"
                    >
                      <img
                        src={item.url}
                        alt={item.originalName || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-2 py-1 rounded bg-black/80 text-white text-[10px] font-bold">
                          + Select
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
