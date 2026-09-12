import React, { useState } from 'react';
import { Testimonial } from '../../types';
import { api } from '../../lib/api';
import { Plus, Edit2, Trash2, Star, Check, AlertCircle, X, Save, Loader2 } from 'lucide-react';
import { ImagePickerField } from './ImagePickerField';

interface AdminTestimonialsViewProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export const AdminTestimonialsView: React.FC<AdminTestimonialsViewProps> = ({
  testimonials,
  onRefresh,
}) => {
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const initialNewTestimonial: Partial<Testimonial> = {
    clientName: '',
    clientRole: 'CEO / Founder',
    clientCompany: 'Tech Ventures Ltd',
    clientImage: '',
    message: '',
    rating: 5,
    isPublished: true,
  };

  const [formData, setFormData] = useState<Partial<Testimonial>>(initialNewTestimonial);

  const handleOpenCreate = () => {
    setFormData({ ...initialNewTestimonial });
    setIsCreating(true);
    setEditingTestimonial(null);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setFormData({ ...item });
    setEditingTestimonial(item);
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingTestimonial(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      if (editingTestimonial) {
        await api.updateTestimonial(editingTestimonial.id, formData);
        setFeedback({ type: 'success', message: 'Testimonial updated successfully!' });
      } else {
        await api.createTestimonial(formData);
        setFeedback({ type: 'success', message: 'New testimonial added!' });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save testimonial.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete testimonial by "${name}"?`)) return;
    try {
      await api.deleteTestimonial(id);
      setFeedback({ type: 'success', message: 'Testimonial deleted.' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete testimonial.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
            Client Testimonials &amp; Reviews
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Publish client feedback, star ratings, and endorsements to build social proof.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
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

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.isPublished ? 'text-emerald-500 bg-emerald-500/10' : 'text-stone-400 bg-stone-100 dark:bg-zinc-800'
                  }`}
                >
                  {item.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-stone-700 dark:text-zinc-300 italic line-clamp-4">
                "{item.message}"
              </p>

              <div className="pt-2 flex items-center gap-3">
                {item.clientImage ? (
                  <img src={item.clientImage} alt={item.clientName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-600/10 text-orange-600 font-bold flex items-center justify-center text-xs">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white font-['Outfit']">
                    {item.clientName}
                  </h4>
                  <p className="text-[10px] text-stone-500 dark:text-zinc-400">
                    {item.clientRole}, {item.clientCompany}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-stone-700 dark:text-zinc-300"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.clientName)}
                className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-red-500"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isCreating || editingTestimonial) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName || ''}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Client Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientRole || ''}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientCompany || ''}
                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating ?? 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) || 5 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
              </div>

              <ImagePickerField
                label="Client Avatar Photo"
                value={formData.clientImage || ''}
                onChange={(url) => setFormData({ ...formData, clientImage: url })}
                aspectRatio="square"
                placeholder="https://... or choose from gallery"
                helpText="Choose an avatar picture from your gallery or paste an image link."
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Testimonial Quote / Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.isPublished ?? true}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span>Publish On Website</span>
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
                      <span>Save Testimonial</span>
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
