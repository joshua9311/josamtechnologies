import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Link2,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
  FolderOpen,
  X,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api';
import { MediaItem } from '../../types';

export interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  placeholder?: string;
  helpText?: string;
  id?: string;
}

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  aspectRatio = 'video',
  placeholder = 'https://example.com/image.jpg',
  helpText,
  id,
}) => {
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read file from user device / gallery and upload
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image file (PNG, JPG, WebP, GIF, SVG).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB. Please choose a smaller photo.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadMedia(formData);
      if (res.success && res.media?.url) {
        onChange(res.media.url);
      } else {
        // Fallback to FileReader data URL if server returns non-success
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      // Fallback gracefully to base64 Data URL so user is never blocked
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
          setUploadError(null);
        } else {
          setUploadError(err.message || 'Failed to upload photo.');
        }
      };
      reader.onerror = () => {
        setUploadError(err.message || 'Failed to upload photo.');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
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

  const isAvatar = aspectRatio === 'square';
  const hasValue = Boolean(value && value.trim());

  return (
    <div className="space-y-2">
      {/* Header with Label and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>

        {/* Source Toggle Tabs */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-stone-200/70 dark:bg-zinc-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              mode === 'upload'
                ? 'bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload from Gallery</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              mode === 'link'
                ? 'bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Insert Link</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* MODE 1: UPLOAD FROM GALLERY / DEVICE */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-4 sm:p-5 transition-all text-center cursor-pointer ${
              isDragging
                ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-950/20'
                : 'border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-950 hover:border-orange-500/60 dark:hover:border-orange-500/60'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                <p className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                  Uploading image to database...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800 dark:text-zinc-200">
                    Click to choose photo from Gallery or File Manager
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    Drag and drop also supported &bull; PNG, JPG, WebP, SVG up to 15MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-stone-500 dark:text-zinc-400">
              Or use an existing media asset:
            </span>
            <button
              type="button"
              onClick={openMediaLibrary}
              className="inline-flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400 hover:underline"
            >
              <FolderOpen className="w-3 h-3" />
              <span>Browse Media Library</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: IMAGE LINK / URL */}
      {mode === 'link' && (
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              id={id}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm font-mono text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
            />
            {hasValue && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-stone-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-stone-500 dark:text-zinc-400">
              Paste direct image link, CDN URL, or local path
            </span>
            <button
              type="button"
              onClick={openMediaLibrary}
              className="inline-flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400 hover:underline"
            >
              <FolderOpen className="w-3 h-3" />
              <span>Choose from Library</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Active Image Visual Preview */}
      {hasValue && (
        <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Image Thumbnail */}
            <div
              className={`relative overflow-hidden shrink-0 border border-stone-300 dark:border-zinc-700 bg-stone-200 dark:bg-zinc-800 ${
                isAvatar
                  ? 'w-14 h-14 rounded-full'
                  : 'w-24 h-14 rounded-lg'
              }`}
            >
              <img
                src={value}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>

            {/* Info */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <Check className="w-2.5 h-2.5" />
                  Image Attached
                </span>
              </div>
              <p className="text-xs font-mono text-stone-600 dark:text-zinc-400 truncate max-w-[220px] sm:max-w-xs">
                {value.startsWith('data:') ? 'Local file (Base64 data)' : value}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!value.startsWith('data:') && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                title="View full image in new tab"
                className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Replace from device gallery"
              className="p-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              title="Remove image"
              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {helpText && (
        <p className="text-[11px] text-stone-500 dark:text-zinc-400">{helpText}</p>
      )}

      {/* Media Library Selection Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
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
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-white"
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
                  <p className="text-[11px] text-stone-500">
                    Use "Upload from Gallery" above to add new pictures.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {libraryItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onChange(item.url);
                        setShowMediaLibrary(false);
                      }}
                      className="group cursor-pointer rounded-xl border border-stone-200 dark:border-zinc-800 overflow-hidden hover:border-orange-500 hover:shadow-md transition-all relative aspect-square bg-stone-100 dark:bg-zinc-950 flex flex-col justify-between"
                    >
                      <img
                        src={item.url}
                        alt={item.originalName || item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.originalName || item.filename}
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
