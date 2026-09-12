import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api, getAuthToken } from './lib/api';
import {
  PublicSiteData,
  AdminSiteData,
  AdminDashboardStats,
  Inquiry,
  MediaItem,
  WebProject,
  GraphicProject,
} from './types';
import { defaultPublicSiteData } from './data/defaultData';

// Common UI Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { LightboxModal } from './components/common/LightboxModal';
import { ProjectModal } from './components/common/ProjectModal';

// Public Landing Page Components
import { HeroSection } from './components/public/HeroSection';
import { ServicesSection } from './components/public/ServicesSection';
import { WebProjectsSection } from './components/public/WebProjectsSection';
import { GraphicProjectsSection } from './components/public/GraphicProjectsSection';
import { CyberServicesSection } from './components/public/CyberServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { WhyChooseUsSection } from './components/public/WhyChooseUsSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { InquirySection } from './components/public/InquirySection';
import { LocationSection } from './components/public/LocationSection';

// Admin CMS Components
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminHomepageView } from './components/admin/AdminHomepageView';
import { AdminAboutView } from './components/admin/AdminAboutView';
import { AdminServicesView } from './components/admin/AdminServicesView';
import { AdminWebProjectsView } from './components/admin/AdminWebProjectsView';
import { AdminGraphicProjectsView } from './components/admin/AdminGraphicProjectsView';
import { AdminTestimonialsView } from './components/admin/AdminTestimonialsView';
import { AdminInquiriesView } from './components/admin/AdminInquiriesView';
import { AdminContactLocationView } from './components/admin/AdminContactLocationView';
import { AdminSocialsView } from './components/admin/AdminSocialsView';
import { AdminSEOView } from './components/admin/AdminSEOView';
import { AdminMediaView } from './components/admin/AdminMediaView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { AdminSecurityActivityView } from './components/admin/AdminSecurityActivityView';

import { Loader2, AlertTriangle, RefreshCw, Lock } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Data States
  const [publicData, setPublicData] = useState<PublicSiteData>(defaultPublicSiteData);
  const [adminData, setAdminData] = useState<AdminSiteData | null>(null);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Modal States
  const [selectedWebProject, setSelectedWebProject] = useState<WebProject | null>(null);
  const [selectedGraphicImage, setSelectedGraphicImage] = useState<{
    imageUrl: string;
    title: string;
    category?: string;
  } | null>(null);
  const [prefilledService, setPrefilledService] = useState<string>('');

  const handleInquireService = (serviceName?: string) => {
    if (serviceName) {
      setPrefilledService(serviceName);
    }
    const el = document.getElementById('inquiry');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync route with URL Path and Hash (/admin or #admin)
  useEffect(() => {
    const handleRouteChange = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').replace('#', '').toLowerCase();

      if (path.startsWith('/admin') || hash.startsWith('admin')) {
        setCurrentView('admin');
        const pathSubTab = path.startsWith('/admin/') ? path.replace('/admin/', '').split('/')[0] : '';
        const hashSubTab = hash.startsWith('admin/') ? hash.replace('admin/', '').split('/')[0] : '';
        const subTab = hashSubTab || pathSubTab;
        if (subTab) setAdminTab(subTab);
      } else {
        setCurrentView('public');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Keyboard shortcut: Alt+A or Ctrl+Shift+A opens Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setCurrentView('admin');
        window.location.hash = 'admin/dashboard';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Public Data
  const fetchPublicData = useCallback(async () => {
    try {
      setLoadError(null);
      const data = await api.getPublicSiteData();
      setPublicData(data);
    } catch (err: any) {
      console.error('Failed to load public site data:', err);
      setLoadError(err.message || 'Unable to connect to Josam Technologies server.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Fetch Admin Data (when authenticated or token exists)
  const fetchAdminData = useCallback(async () => {
    const token = getAuthToken();
    if (!isAuthenticated && !token) return;

    setIsAdminLoading(true);
    setAdminError(null);

    try {
      const [fullSiteData, dashboardStats, allInquiries, allMedia] = await Promise.all([
        api.getAdminSiteData().catch((err) => {
          console.error('[Admin] Failed to load site data:', err);
          return null;
        }),
        api.getDashboardStats().catch((err) => {
          console.error('[Admin] Failed to load dashboard stats:', err);
          return null;
        }),
        api.getInquiries().catch(() => []),
        api.getMediaList().catch(() => []),
      ]);

      const activeInquiries = Array.isArray(allInquiries) ? allInquiries : [];
      setInquiries(activeInquiries);
      setMediaList(Array.isArray(allMedia) ? allMedia : []);

      if (fullSiteData) {
        setAdminData(fullSiteData);
        // Keep public data in sync with latest changes
        setPublicData({
          settings: fullSiteData.settings,
          about: fullSiteData.about,
          contact: fullSiteData.contact,
          location: fullSiteData.location,
          socials: fullSiteData.socials,
          seo: fullSiteData.seo,
          services: fullSiteData.services?.filter((s) => s.isPublished) || [],
          webProjects: fullSiteData.webProjects?.filter((p) => p.isPublished) || [],
          graphicProjects: fullSiteData.graphicProjects?.filter((p) => p.isPublished) || [],
          testimonials: fullSiteData.testimonials?.filter((t) => t.isPublished) || [],
        });
      }

      if (dashboardStats) {
        setStats(dashboardStats);
      } else {
        // Compute robust fallback stats from available data so overview is never blank
        const source = fullSiteData || (publicData as AdminSiteData) || (defaultPublicSiteData as unknown as AdminSiteData);
        setStats({
          totalWebProjects: source.webProjects?.length || 0,
          totalGraphicProjects: source.graphicProjects?.length || 0,
          totalServices: source.services?.length || 0,
          publishedServices: source.services?.filter((s) => s.isPublished)?.length || 0,
          publishedTestimonials: source.testimonials?.filter((t) => t.isPublished)?.length || 0,
          newInquiries: activeInquiries.filter((i) => i.status === 'new').length,
          totalInquiries: activeInquiries.length,
          recentProjects: [
            ...(source.webProjects || []).map((p) => ({ id: p.id, title: p.title, type: 'web' as const, createdAt: p.createdAt })),
            ...(source.graphicProjects || []).map((g) => ({ id: g.id, title: g.title, type: 'graphic' as const, createdAt: g.createdAt })),
          ].slice(0, 5),
          recentInquiries: activeInquiries.slice(0, 5),
        });
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setAdminError(err.message || 'Failed to connect to administrative database.');
    } finally {
      setIsAdminLoading(false);
    }
  }, [isAuthenticated, publicData]);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated, fetchAdminData]);

  const handleInquiryStatusChange = async (id: string, status: 'new' | 'read' | 'archived') => {
    try {
      await api.updateInquiryStatus(id, status);
      fetchAdminData();
    } catch (err: any) {
      console.error('Error updating inquiry status:', err);
    }
  };

  const handleNavigateToAdmin = (tab: string = 'dashboard') => {
    setAdminTab(tab);
    setCurrentView('admin');
    window.location.hash = `admin/${tab}`;
  };

  const handleNavigateToPublic = (sectionHash?: string) => {
    setCurrentView('public');
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/' + (sectionHash ? `#${sectionHash.replace('#', '')}` : ''));
    } else {
      window.location.hash = sectionHash || '';
    }
    if (sectionHash) {
      setTimeout(() => {
        const el = document.getElementById((sectionHash || '').replace('#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  if (isLoadingData || (authLoading && currentView === 'admin')) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-stone-900 dark:text-zinc-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg animate-pulse">
            J
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            <span className="font-bold text-sm tracking-wide">Loading Josam Technologies...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loadError && !publicData) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-stone-900 dark:text-zinc-100">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Outfit']">Failed to Load Website</h2>
          <p className="text-xs text-stone-600 dark:text-zinc-400">{loadError}</p>
          <button
            onClick={() => fetchPublicData()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLoginView
          onSuccess={() => {
            fetchAdminData();
            handleNavigateToAdmin('dashboard');
          }}
          onBackToSite={() => handleNavigateToPublic()}
        />
      );
    }

    const unreadCount = inquiries.filter((i) => i.status === 'new').length;
    const activeAdminData = adminData || (publicData as unknown as AdminSiteData) || (defaultPublicSiteData as unknown as AdminSiteData);

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => {
          setAdminTab(tab);
          window.location.hash = `admin/${tab}`;
        }}
        onViewLiveSite={() => handleNavigateToPublic()}
        unreadInquiriesCount={unreadCount}
      >
        {adminError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{adminError}</span>
            </div>
            <button
              onClick={() => fetchAdminData()}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {adminTab === 'dashboard' && (
          <AdminDashboardView
            stats={stats}
            isLoading={isAdminLoading}
            onRefresh={fetchAdminData}
            onNavigateTab={(tab) => {
              setAdminTab(tab);
              window.location.hash = `admin/${tab}`;
            }}
            onUpdateInquiryStatus={handleInquiryStatusChange}
          />
        )}

        {adminTab === 'security' && (
          <AdminSecurityActivityView />
        )}

        {adminTab === 'homepage' && (
          <AdminHomepageView settings={activeAdminData.settings} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'about' && (
          <AdminAboutView about={activeAdminData.about} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'services' && (
          <AdminServicesView services={activeAdminData.services} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'web-projects' && (
          <AdminWebProjectsView projects={activeAdminData.webProjects} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'graphic-projects' && (
          <AdminGraphicProjectsView projects={activeAdminData.graphicProjects} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'testimonials' && (
          <AdminTestimonialsView testimonials={activeAdminData.testimonials} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'inquiries' && (
          <AdminInquiriesView inquiries={inquiries} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'contact' && (
          <AdminContactLocationView
            contact={activeAdminData.contact}
            location={activeAdminData.location}
            onRefresh={fetchAdminData}
          />
        )}

        {adminTab === 'socials' && (
          <AdminSocialsView socials={activeAdminData.socials} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'seo' && (
          <AdminSEOView seo={activeAdminData.seo} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'media' && (
          <AdminMediaView mediaList={mediaList} onRefresh={fetchAdminData} />
        )}

        {adminTab === 'settings' && (
          <AdminSettingsView onRefreshAll={fetchAdminData} />
        )}
      </AdminLayout>
    );
  }

  // --- PUBLIC SHOWCASE LANDING VIEW ---
  if (!publicData) return null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-orange-500 selection:text-white">
      
      {/* Header & Navigation */}
      <Navbar
        settings={publicData.settings}
        contact={publicData.contact}
        onNavigate={handleNavigateToPublic}
      />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-0">
        
        {/* 1. Hero Section */}
        <HeroSection
          settings={publicData.settings}
          contact={publicData.contact}
          onExploreServices={() => handleNavigateToPublic('#services')}
          onStartInquiry={() => handleNavigateToPublic('#inquiry')}
        />

        {/* 2. Core Services (Web & Graphic Focus) */}
        <ServicesSection
          services={publicData.services}
          onSelectService={handleInquireService}
        />

        {/* 3. Full-Stack Web Development Portfolio */}
        <WebProjectsSection
          projects={publicData.webProjects}
          onViewProjectDetails={(project) => setSelectedWebProject(project)}
          onInquire={() => handleInquireService('Full-Stack Web Development')}
        />

        {/* 4. Graphic Design & Brand Identity Showcase */}
        <GraphicProjectsSection
          projects={publicData.graphicProjects}
          onImageZoom={(imageUrl, title, category) =>
            setSelectedGraphicImage({ imageUrl, title, category })
          }
        />

        {/* 5. Cyber & Online Digital Services */}
        <CyberServicesSection
          services={publicData.services}
          contact={publicData.contact}
          onInquire={handleInquireService}
          onInquirySubmitted={() => {
            if (isAuthenticated) fetchAdminData();
          }}
        />

        {/* 6. Company Story & Strategic Approach */}
        <AboutSection
          about={publicData.about}
          settings={publicData.settings}
          onCtaClick={() => handleInquireService()}
        />

        {/* 7. Why Partner With Josam */}
        <WhyChooseUsSection />

        {/* 8. Client Testimonials & Social Proof */}
        <TestimonialsSection
          testimonials={publicData.testimonials}
        />

        {/* 9. Direct Project Inquiry Form */}
        <InquirySection
          contact={publicData.contact}
          prefilledService={prefilledService}
          onClearPrefill={() => setPrefilledService('')}
          onInquirySubmitted={() => {
            if (isAuthenticated) fetchAdminData();
          }}
        />

        {/* 10. Physical Hub & Location Coordinates */}
        <LocationSection
          location={publicData.location}
          contact={publicData.contact}
        />

      </main>

      {/* Site Footer */}
      <Footer
        settings={publicData.settings}
        contact={publicData.contact}
        location={publicData.location}
        socials={publicData.socials}
        onNavigate={handleNavigateToPublic}
      />

      {/* Interactive Floating WhatsApp Quick Contact Button */}
      <WhatsAppFloatingButton
        phone={publicData?.contact?.whatsapp || publicData?.contact?.phone || '+254 700 000 000'}
        brandName={publicData?.settings?.brandName || 'Josam Technologies'}
      />

      {/* Lightbox Modal for Graphic Arts */}
      {selectedGraphicImage && (
        <LightboxModal
          isOpen={true}
          imageUrl={selectedGraphicImage.imageUrl}
          title={selectedGraphicImage.title}
          category={selectedGraphicImage.category}
          onClose={() => setSelectedGraphicImage(null)}
        />
      )}

      {/* Web Project Full Details Modal */}
      {selectedWebProject && (
        <ProjectModal
          isOpen={true}
          project={selectedWebProject}
          onClose={() => setSelectedWebProject(null)}
          onStartInquiry={(projectName) => {
            setSelectedWebProject(null);
            handleInquireService(projectName ? `Custom Web Project: ${projectName}` : 'Full-Stack Web Development');
          }}
          onInquire={(projectName) => {
            setSelectedWebProject(null);
            handleInquireService(projectName ? `Custom Web Project: ${projectName}` : 'Full-Stack Web Development');
          }}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
