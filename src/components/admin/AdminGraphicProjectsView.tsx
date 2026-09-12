import React, { useState } from 'react';
import { GraphicProject } from '../../types';
import { api } from '../../lib/api';
import { Plus, Edit2, Trash2, Palette, Sparkles, Check, AlertCircle, X, Save, Loader2, Tag } from 'lucide-react';
import { ImagePickerField } from './ImagePickerField';
import { MultiImagePickerField } from './MultiImagePickerField';

interface AdminGraphicProjectsViewProps {
  projects: GraphicProject[];
  onRefresh: () => void;
}

export const AdminGraphicProjectsView: React.FC<AdminGraphicProjectsViewProps> = ({
  projects,
  onRefresh,
}) => {
  const [editingProject, setEditingProject] = useState<GraphicProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const initialNewProject: Partial<GraphicProject> = {
    title: '',
    category: 'Logo & Brand Identity',
    description: '',
    tags: ['Vector', 'Illustrator', 'Branding'],
    mainImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    isFeatured: false,
    isPublished: true,
    order: projects.length + 1,
  };

  const [formData, setFormData] = useState<Partial<GraphicProject>>(initialNewProject);

  const handleOpenCreate = () => {
    setFormData({
      ...initialNewProject,
      order: projects.length + 1,
    });
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleOpenEdit = (proj: GraphicProject) => {
    setFormData({ ...proj });
    setEditingProject(proj);
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingProject(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      if (editingProject) {
        await api.updateGraphicProject(editingProject.id, formData);
        setFeedback({ type: 'success', message: 'Graphic project updated successfully!' });
      } else {
        await api.createGraphicProject(formData);
        setFeedback({ type: 'success', message: 'New graphic project added to portfolio!' });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save graphic project.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteGraphicProject(id);
      setFeedback({ type: 'success', message: 'Graphic project removed.' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete graphic project.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
            Graphic Design &amp; Artwork Showcase
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Manage logos, brand identity decks, event posters, flyers, packaging, and social media creative assets.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Graphic Artwork</span>
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

      {/* Grid of Graphic Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] w-full bg-zinc-950 relative overflow-hidden">
                <img src={proj.mainImage} alt={proj.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                    {proj.category}
                  </span>
                </div>
                {proj.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit']">
                  {proj.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {proj.tags?.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-stone-100 dark:border-zinc-800 pt-3">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  proj.isPublished ? 'text-emerald-500 bg-emerald-500/10' : 'text-stone-400 bg-stone-100 dark:bg-zinc-800'
                }`}
              >
                {proj.isPublished ? 'Published' : 'Draft'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-stone-700 dark:text-zinc-300"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
                {editingProject ? 'Edit Graphic Artwork' : 'Publish New Graphic Artwork'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Design Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Logo & Brand Identity, Posters, Packaging, Social Media"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <ImagePickerField
                label="Main Artwork Image"
                value={formData.mainImage || ''}
                onChange={(url) => setFormData({ ...formData, mainImage: url })}
                required
                aspectRatio="video"
                placeholder="https://... or choose from gallery"
                helpText="Choose a photo from your gallery or paste an image link."
              />

              <MultiImagePickerField
                label="Additional Showcase Pictures"
                values={formData.galleryImages || []}
                onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
                helpText="Upload multiple project angles from your gallery or add via link."
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Artwork Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Logo, Vector, Typography, Print Ready, 300DPI"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Design Brief &amp; Concept Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.isPublished ?? true}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span>Publish On Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span>Featured Artwork</span>
                </label>
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
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 text-stone-950 text-xs font-bold shadow-md transition-colors"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Artwork</span>
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
