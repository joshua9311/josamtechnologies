import React, { useState } from 'react';
import { SEOSettings } from '../../types';
import { api } from '../../lib/api';
import { Save, Search, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ImagePickerField } from './ImagePickerField';

interface AdminSEOViewProps {
  seo: SEOSettings;
  onRefresh: () => void;
}

export const AdminSEOView: React.FC<AdminSEOViewProps> = ({ seo, onRefresh }) => {
  const [formData, setFormData] = useState<SEOSettings>({ ...seo });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await api.updateSEO(formData);
      setFeedback({ type: 'success', message: 'SEO & meta configuration saved successfully!' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save SEO settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
          SEO &amp; Open Graph Configuration
        </h1>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Optimize search engine discovery, preview cards on WhatsApp / Twitter / LinkedIn, and indexing directives.
        </p>
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

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
            Meta Title (Recommended 50-60 characters)
          </label>
          <input
            type="text"
            required
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
            Meta Description (Recommended 120-160 characters)
          </label>
          <textarea
            rows={3}
            required
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
            Keywords (Comma separated)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImagePickerField
            label="Open Graph (OG) Social Banner Image"
            value={formData.ogImage}
            onChange={(url) => setFormData({ ...formData, ogImage: url })}
            aspectRatio="wide"
            placeholder="https://... or choose from gallery"
            helpText="Recommended: 1200x630px high-resolution preview banner."
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
              Canonical URL
            </label>
            <input
              type="url"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
            />
          </div>
        </div>

        {/* Search Result Live Google Preview Mock */}
        <div className="p-5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 space-y-2">
          <span className="text-[11px] uppercase font-bold text-stone-400 dark:text-zinc-500 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            <span>Search Engine Live Snippet Preview</span>
          </span>
          <div className="pt-1">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-mono">
              {formData.canonicalUrl || 'https://josamtech.co.ke'}
            </span>
            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline">
              {formData.metaTitle}
            </h4>
            <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 line-clamp-2">
              {formData.metaDescription}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-orange-400 text-white text-xs font-bold shadow-md transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save SEO Config</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
