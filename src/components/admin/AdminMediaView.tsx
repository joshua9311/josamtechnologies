import React, { useState, useRef } from 'react';
import { MediaItem } from '../../types';
import { api } from '../../lib/api';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
  Loader2,
  HardDrive,
  Sparkles,
} from 'lucide-react';

interface AdminMediaViewProps {
  mediaList: MediaItem[];
  onRefresh: () => void;
}

export const AdminMediaView: React.FC<AdminMediaViewProps> = ({ mediaList, onRefresh }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadMedia(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: `Uploaded "${file.name}" successfully!` });
        onRefresh();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'File upload failed.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete media item "${name}"?`)) return;
    try {
      await api.deleteMedia(id);
      setFeedback({ type: 'success', message: 'Media item deleted.' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete file.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
            Media &amp; Asset Library
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Upload and manage portfolio artwork, client avatars, branding logos, and marketing images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
            <HardDrive className="w-3.5 h-3.5 text-orange-500" />
            <span>Storage: Cloud SQL PostgreSQL (No Buckets Needed)</span>
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-8 sm:p-12 text-center hover:border-orange-500 transition-colors cursor-pointer space-y-3"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e.target.files)}
          accept="image/*"
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
          {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
        </div>

        <div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            {isUploading ? 'Uploading file to storage...' : 'Click or Drag & Drop image files here'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Supports PNG, JPG, SVG, WebP, GIF (Max 15MB)
          </p>
        </div>
      </div>

      {/* Media Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
          Stored Files ({mediaList.length})
        </h3>

        {mediaList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-center text-xs text-stone-500 dark:text-zinc-400">
            No media uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="aspect-square bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <ImageIcon className="w-8 h-8 text-zinc-700 absolute" />
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-[11px] font-bold text-stone-900 dark:text-white truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {Math.round(item.size / 1024)} KB
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-zinc-800">
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-stone-700 dark:text-zinc-300 text-[10px] flex items-center gap-1"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.filename)}
                      className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white text-stone-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
