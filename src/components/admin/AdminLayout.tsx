import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Home,
  Info,
  Layers,
  Code2,
  Palette,
  MessageSquareQuote,
  Inbox,
  Phone,
  Share2,
  Search,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onViewLiveSite: () => void;
  unreadInquiriesCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewLiveSite,
  unreadInquiriesCount,
  children,
}) => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'security', label: 'Activity & Security', icon: ShieldAlert },
    { id: 'homepage', label: 'Hero & Homepage', icon: Home },
    { id: 'about', label: 'About & Mission', icon: Info },
    { id: 'services', label: 'Services Manager', icon: Layers },
    { id: 'web-projects', label: 'Web Portfolio', icon: Code2 },
    { id: 'graphic-projects', label: 'Graphic Arts', icon: Palette },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    {
      id: 'inquiries',
      label: 'Inquiries & Leads',
      icon: Inbox,
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : null,
    },
    { id: 'contact', label: 'Contact & Location', icon: Phone },
    { id: 'socials', label: 'Social Channels', icon: Share2 },
    { id: 'seo', label: 'SEO & Meta Tags', icon: Search },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'System & Backup', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 flex flex-col lg:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden h-16 bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-sm">
            J
          </div>
          <span className="font-bold text-sm font-['Outfit']">Josam CMS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-lg text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-stone-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-16 px-6 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                J
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm font-['Outfit'] text-stone-900 dark:text-white">
                  Josam CMS
                </span>
                <span className="text-[10px] text-stone-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  Control Center
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Bar */}
        <div className="p-4 border-t border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs shrink-0">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-zinc-500 truncate">
                  {admin?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-stone-500 hover:text-red-500 hover:bg-stone-200 dark:hover:bg-zinc-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onViewLiveSite}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex h-16 bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800 px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-base font-['Outfit'] capitalize">
              {(currentTab || '').replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 border border-stone-200 dark:border-zinc-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onViewLiveSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 text-xs font-semibold border border-orange-200 dark:border-orange-900 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>

      </main>

    </div>
  );
};
