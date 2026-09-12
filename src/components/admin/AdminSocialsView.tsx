import React, { useState } from 'react';
import { SocialLink } from '../../types';
import { api } from '../../lib/api';
import { DynamicIcon } from '../common/DynamicIcon';
import { Plus, Edit2, Trash2, Check, AlertCircle, X, Save, Loader2, ExternalLink } from 'lucide-react';

interface AdminSocialsViewProps {
  socials: SocialLink[];
  onRefresh: () => void;
}

export const AdminSocialsView: React.FC<AdminSocialsViewProps> = ({ socials, onRefresh }) => {
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const initialNewSocial: Partial<SocialLink> = {
    platform: 'facebook',
    platformName: 'Facebook',
    url: 'https://facebook.com',
    icon: 'Facebook',
    order: socials.length + 1,
    isEnabled: true,
  };

  const [formData, setFormData] = useState<Partial<SocialLink>>(initialNewSocial);

  const handleOpenCreate = () => {
    setFormData({ ...initialNewSocial, order: socials.length + 1 });
    setIsCreating(true);
    setEditingSocial(null);
  };

  const handleOpenEdit = (social: SocialLink) => {
    setFormData({ ...social });
    setEditingSocial(social);
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingSocial(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      if (editingSocial) {
        await api.updateSocial(editingSocial.id, formData);
        setFeedback({ type: 'success', message: 'Social link updated!' });
      } else {
        await api.createSocial(formData);
        setFeedback({ type: 'success', message: 'New social link created!' });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save social link.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete social channel "${name}"?`)) return;
    try {
      await api.deleteSocial(id);
      setFeedback({ type: 'success', message: 'Social channel removed.' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
            Social Media Channels
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Connect Facebook, TikTok, LinkedIn, GitHub, Instagram, and other digital handles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Channel</span>
        </button>
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

      {/* Socials List */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-stone-100 dark:divide-zinc-800">
          {socials.map((s) => (
            <div key={s.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-zinc-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-700 dark:text-zinc-300">
                  <DynamicIcon name={s.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    {s.platformName}
                  </h4>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                  >
                    <span className="truncate max-w-[200px] sm:max-w-sm">{s.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-stone-700 dark:text-zinc-300"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.platformName)}
                  className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {(isCreating || editingSocial) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
                {editingSocial ? 'Edit Social Channel' : 'Add Social Channel'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Facebook, TikTok, LinkedIn, GitHub, Instagram"
                  value={formData.platformName || ''}
                  onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Profile / Channel URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Lucide Icon Name
                </label>
                <input
                  type="text"
                  placeholder="Facebook, Linkedin, Github, Instagram, Video, Share2"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-orange-400 text-white text-xs font-bold shadow-md transition-colors"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Channel</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
