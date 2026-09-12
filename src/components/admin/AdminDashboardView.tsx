import React from 'react';
import { AdminDashboardStats, Inquiry } from '../../types';
import {
  Code2,
  Palette,
  Layers,
  Inbox,
  MessageSquareQuote,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Plus,
  Sparkles,
  HardDrive,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardViewProps {
  stats: AdminDashboardStats | null;
  onNavigateTab: (tab: string) => void;
  onUpdateInquiryStatus: (id: string, status: 'new' | 'read' | 'archived') => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stats,
  onNavigateTab,
  onUpdateInquiryStatus,
  onRefresh,
  isLoading = false,
}) => {
  if (!stats) {
    return (
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm animate-in fade-in duration-200">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
        <h3 className="text-lg font-bold font-['Outfit'] text-stone-900 dark:text-white">
          Loading Josam CMS Overview...
        </h3>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Gathering live project counts, security metrics, and inquiries.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-colors mt-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Overview</span>
          </button>
        )}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Web Projects',
      value: stats.totalWebProjects ?? 0,
      tab: 'web-projects',
      icon: Code2,
      color: 'text-orange-500 bg-orange-500/10',
    },
    {
      title: 'Graphic Designs',
      value: stats.totalGraphicProjects ?? 0,
      tab: 'graphic-projects',
      icon: Palette,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Active Services',
      value: stats.publishedServices ?? stats.totalServices ?? 0,
      tab: 'services',
      icon: Layers,
      color: 'text-yellow-500 bg-yellow-500/10',
    },
    {
      title: 'Inquiries Received',
      value: stats.totalInquiries ?? 0,
      highlight: (stats.newInquiries ?? 0) > 0 ? `${stats.newInquiries} New` : 'All Read',
      tab: 'inquiries',
      icon: Inbox,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8 shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Josam Technologies CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            Platform Overview &amp; Control
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
            Manage your web portfolio, graphic artwork showcase, cyber services, client testimonials, and incoming customer leads in real-time.
          </p>
        </div>

        {onRefresh && (
          <div className="relative z-10 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all backdrop-blur-sm cursor-pointer disabled:opacity-50"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Refresh Data'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm hover:border-orange-500/60 dark:hover:border-orange-500/60 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {card.highlight && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {card.highlight}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-['Outfit']">
                  {card.value}
                </span>
                <p className="text-xs font-semibold text-stone-500 dark:text-zinc-400 mt-1">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Bar */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('web-projects')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Web Project</span>
          </button>

          <button
            onClick={() => onNavigateTab('graphic-projects')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Graphic Art</span>
          </button>

          <button
            onClick={() => onNavigateTab('services')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>

          <button
            onClick={() => onNavigateTab('media')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Upload Media Files</span>
          </button>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-sm font-['Outfit'] text-stone-900 dark:text-white">
              Recent Inquiries &amp; Leads
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('inquiries')}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
          >
            <span>View All Inquiries</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {(!stats.recentInquiries || stats.recentInquiries.length === 0) ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-zinc-400">
            No inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-zinc-950 text-stone-500 dark:text-zinc-400 uppercase font-bold tracking-wider border-b border-stone-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Service Requested</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                {(stats.recentInquiries || []).map((inq) => (
                  <tr key={inq.id} className="hover:bg-stone-50/60 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-semibold text-stone-900 dark:text-white">
                      {inq.name}
                      <span className="block text-[11px] font-normal text-stone-500 dark:text-zinc-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-700 dark:text-zinc-300">
                      {inq.service}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="block text-stone-800 dark:text-zinc-200">{inq.phone}</span>
                        <span className="block text-stone-500 dark:text-zinc-400">{inq.email}</span>
                      </div>
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inq.status === 'new' && (
                          <button
                            onClick={() => onUpdateInquiryStatus(inq.id, 'read')}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-[11px] font-medium"
                          >
                            Mark Read
                          </button>
                        )}
                        <a
                          href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                          title="Reply on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
