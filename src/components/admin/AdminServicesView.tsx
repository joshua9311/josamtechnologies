import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import { api } from '../../lib/api';
import { DynamicIcon } from '../common/DynamicIcon';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, Check, AlertCircle, X, Save, Loader2 } from 'lucide-react';

interface AdminServicesViewProps {
  services: ServiceItem[];
  onRefresh: () => void;
}

export const AdminServicesView: React.FC<AdminServicesViewProps> = ({ services, onRefresh }) => {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const initialNewService: Partial<ServiceItem> = {
    title: '',
    category: 'web',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Code2',
    features: ['Custom Tailored Architecture', 'Fast Delivery', 'Continuous Maintenance'],
    isFeatured: false,
    isPublished: true,
    order: services.length + 1,
  };

  const [formData, setFormData] = useState<Partial<ServiceItem>>(initialNewService);

  const handleOpenCreate = () => {
    setFormData({
      ...initialNewService,
      order: services.length + 1,
    });
    setIsCreating(true);
    setEditingService(null);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setFormData({ ...service });
    setEditingService(service);
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setIsCreating(false);
    setEditingService(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      if (editingService) {
        await api.updateService(editingService.id, formData);
        setFeedback({ type: 'success', message: 'Service updated successfully!' });
      } else {
        await api.createService(formData);
        setFeedback({ type: 'success', message: 'New service created successfully!' });
      }
      handleCloseModal();
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save service.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteService(id);
      setFeedback({ type: 'success', message: 'Service deleted.' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete service.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
            Services Management
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Create, modify, reorder, and publish offerings across Web, Graphic Design, and Cyber Services.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
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

      {/* Services Table */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-zinc-950 text-stone-500 dark:text-zinc-400 uppercase font-bold tracking-wider border-b border-stone-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Service</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Icon</th>
                <th className="px-6 py-3.5">Features</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-stone-50/60 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4 font-bold text-stone-900 dark:text-white">
                    {service.title}
                    <span className="block text-[11px] font-normal text-stone-500 dark:text-zinc-400 line-clamp-1">
                      {service.shortDescription}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 uppercase">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <DynamicIcon name={service.iconName} className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600 dark:text-zinc-400">
                    {service.features?.length || 0} bullets
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        service.isPublished
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {service.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(service)}
                        className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-red-500"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create / Edit */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Service Title *
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
                  <select
                    value={formData.category || 'web'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  >
                    <option value="web">Web Development</option>
                    <option value="graphic">Graphic Design</option>
                    <option value="cyber">Cyber &amp; Digital Services</option>
                    <option value="other">Other Digital Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Lucide Icon Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Code2, Palette, ShieldCheck, Globe"
                    value={formData.iconName || ''}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order ?? 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  value={(formData.features || []).join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: e.target.value
                        .split('\n')
                        .map((f) => f.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.isPublished ?? true}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span>Publish On Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span>Featured Service</span>
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
                      <span>Save Service</span>
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
