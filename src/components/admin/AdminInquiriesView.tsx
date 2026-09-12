import React, { useState } from 'react';
import { Inquiry } from '../../types';
import { api } from '../../lib/api';
import {
  Inbox,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  Eye,
  X,
  AlertCircle,
} from 'lucide-react';

interface AdminInquiriesViewProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

export const AdminInquiriesView: React.FC<AdminInquiriesViewProps> = ({ inquiries, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesTab = activeTab === 'all' || inq.status === activeTab;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleUpdateStatus = async (id: string, status: 'new' | 'read' | 'archived') => {
    try {
      await api.updateInquiryStatus(id, status);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update status.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete inquiry from "${name}"?`)) return;
    try {
      await api.deleteInquiry(id);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      setFeedback({ type: 'success', message: 'Inquiry deleted.' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete inquiry.' });
    }
  };

  const handleOpenDetail = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    if (inq.status === 'new') {
      handleUpdateStatus(inq.id, 'read');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
            Client Inquiries &amp; Project Leads
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            Review incoming project briefs, client contacts, preferred communication channels, and respond promptly.
          </p>
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
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-4 rounded-2xl">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'read', 'archived'] as const).map((tab) => {
            const count = tab === 'all' ? inquiries.length : inquiries.filter((i) => i.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span className="capitalize">{tab}</span>
                <span className="ml-1.5 text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs text-stone-900 dark:text-white placeholder-stone-400"
          />
        </div>

      </div>

      {/* Inquiries Table */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Inbox className="w-8 h-8 text-stone-400 mx-auto opacity-50" />
            <p className="text-xs font-semibold text-stone-600 dark:text-zinc-400">
              No inquiries found in this view.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-zinc-950 text-stone-500 dark:text-zinc-400 uppercase font-bold tracking-wider border-b border-stone-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5">Client &amp; Date</th>
                  <th className="px-6 py-3.5">Service Requested</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Pref. Method</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-stone-50/70 dark:hover:bg-zinc-800/50 cursor-pointer ${
                      inq.status === 'new' ? 'bg-orange-50/30 dark:bg-orange-950/10 font-medium' : ''
                    }`}
                    onClick={() => handleOpenDetail(inq)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-stone-900 dark:text-white block">
                        {inq.name}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-zinc-400">
                        {new Date(inq.createdAt).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-stone-800 dark:text-zinc-200">
                      {inq.service}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="block text-stone-900 dark:text-zinc-200">{inq.phone}</span>
                        <span className="block text-stone-500 dark:text-zinc-400">{inq.email}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 uppercase">
                        {inq.preferredContact}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'new'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                            : inq.status === 'read'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {inq.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                          title="WhatsApp reply"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(
                            'RE: Inquiry regarding ' + inq.service
                          )}`}
                          className="p-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-500"
                          title="Email reply"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(inq.id, inq.name)}
                          className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white text-red-500"
                          title="Delete inquiry"
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
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
                  Inquiry from {selectedInquiry.name}
                </h3>
                <span className="text-[11px] text-stone-500 dark:text-zinc-400">
                  Received {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-zinc-950">
                <div>
                  <span className="text-stone-500 dark:text-zinc-400 block text-[10px] uppercase font-bold">
                    Email
                  </span>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-semibold text-orange-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>

                <div>
                  <span className="text-stone-500 dark:text-zinc-400 block text-[10px] uppercase font-bold">
                    Phone / WhatsApp
                  </span>
                  <a
                    href={`https://wa.me/${(selectedInquiry.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>

                <div>
                  <span className="text-stone-500 dark:text-zinc-400 block text-[10px] uppercase font-bold">
                    Service Required
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {selectedInquiry.service}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 dark:text-zinc-400 block text-[10px] uppercase font-bold">
                    Preferred Contact
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-white uppercase">
                    {selectedInquiry.preferredContact}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 dark:text-zinc-400 block text-[10px] uppercase font-bold mb-1.5">
                  Project Description / Message
                </span>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.description}
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-stone-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  Change Status:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'new')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      selectedInquiry.status === 'new'
                        ? 'bg-amber-500 text-black'
                        : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'read')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      selectedInquiry.status === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                    }`}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'archived')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      selectedInquiry.status === 'archived'
                        ? 'bg-stone-700 text-white'
                        : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                    }`}
                  >
                    Archived
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA Bar */}
            <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name)}
                className="text-red-500 hover:underline text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${(selectedInquiry.phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reply on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
