import React, { useState } from 'react';
import { ContactSettings, LocationSettings } from '../../types';
import { api } from '../../lib/api';
import { Save, Phone, MapPin, Check, AlertCircle, Loader2 } from 'lucide-react';

interface AdminContactLocationViewProps {
  contact?: ContactSettings;
  location?: LocationSettings;
  onRefresh: () => void;
}

export const AdminContactLocationView: React.FC<AdminContactLocationViewProps> = ({
  contact,
  location,
  onRefresh,
}) => {
  const defaultContact: ContactSettings = {
    id: 'main',
    email: 'info@josamtech.com',
    phone: '+254 700 000 000',
    whatsapp: '+254 700 000 000',
    description: 'Direct inquiries and quotes',
    businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
    updatedAt: new Date().toISOString(),
  };

  const defaultLocation: LocationSettings = {
    id: 'main',
    locationName: 'Josam Technologies Hub',
    address: 'Commercial Business Centre, Nairobi, Kenya',
    mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
    coordinates: '-1.286389, 36.817223',
    description: 'In-person consultations and design review',
    updatedAt: new Date().toISOString(),
  };

  const [contactData, setContactData] = useState<ContactSettings>({
    ...defaultContact,
    ...(contact || {}),
  });
  const [locationData, setLocationData] = useState<LocationSettings>({
    ...defaultLocation,
    ...(location || {}),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await Promise.all([api.updateContact(contactData), api.updateLocation(locationData)]);
      setFeedback({ type: 'success', message: 'Contact channels & location coordinates updated!' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save contact/location.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
          Contact Channels &amp; Location Settings
        </h1>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Configure direct client communications, WhatsApp gateway number, physical address, and Google Map coordinates.
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

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
        
        {/* Contact section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white font-['Outfit'] flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-2">
            <Phone className="w-4 h-4 text-orange-500" />
            <span>Direct Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
                Official Email Address
              </label>
              <input
                type="email"
                required
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
                WhatsApp Hotline Number
              </label>
              <input
                type="text"
                required
                placeholder="+254 700 000 000"
                value={contactData.whatsapp}
                onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
                Business Working Hours
              </label>
              <input
                type="text"
                value={contactData.businessHours}
                onChange={(e) => setContactData({ ...contactData, businessHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white font-['Outfit'] flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>Physical Office &amp; Operations Hub</span>
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
              Location Name / Hub Title
            </label>
            <input
              type="text"
              value={locationData.locationName}
              onChange={(e) => setLocationData({ ...locationData, locationName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
              Full Physical Address
            </label>
            <input
              type="text"
              value={locationData.address}
              onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
              Hub Overview &amp; Consultation Information
            </label>
            <textarea
              rows={3}
              value={locationData.description}
              onChange={(e) => setLocationData({ ...locationData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-sm"
            />
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
                <span>Save Contact &amp; Location</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
