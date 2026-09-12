import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { SiteSettings, ContactSettings } from '../../types';

interface NavbarProps {
  settings?: SiteSettings;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  contact?: ContactSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection = 'home',
  onNavigate,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const setts = settings || {
    siteName: 'Josam Technologies',
    brandName: 'Josam Technologies',
    tagline: 'Building Digital Experiences. Creating Powerful Brands.',
    logoUrl: '/logo-icon.svg',
    iconUrl: '/logo-icon.svg',
  };

  const handleNav = onNavigate || ((sec: string) => {
    const el = document.getElementById(sec);
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'web-projects', label: 'Web Projects' },
    { id: 'graphic-projects', label: 'Graphic Design' },
    { id: 'cyber-services', label: 'Cyber & Digital Solutions' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    handleNav(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-zinc-800/80 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a
            id="brand-logo-link"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-orange-500 transition-colors">
              <img
                src={setts.iconUrl || '/logo-icon.svg'}
                alt="Josam Technologies"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Sparkles className="w-5 h-5 text-orange-500 hidden group-hover:inline-block" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-orange-500 font-['Outfit']">
                  JOSAM
                </span>
                <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-zinc-100 font-['Outfit']">
                  TECH
                </span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-500 dark:text-zinc-400">
                Digital &amp; Web
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 font-semibold'
                      : 'text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/90 dark:bg-zinc-900/90 hover:bg-stone-200 dark:hover:bg-zinc-800 transition-all border border-stone-200 dark:border-zinc-800 cursor-pointer shadow-xs active:scale-95"
              aria-label="Toggle light or dark theme"
              title={theme === 'dark' ? 'Switch to Light Mode (White)' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
                  <span className="hidden xl:inline text-zinc-300 font-medium">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-700 animate-in spin-in-180 duration-300" />
                  <span className="hidden xl:inline text-stone-700 font-medium">Dark Mode</span>
                </>
              )}
            </button>

            {/* Primary CTA */}
            <button
              id="navbar-cta-btn"
              onClick={() => handleLinkClick('inquiry')}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-md hover:shadow-orange-500/20 transition-all duration-200 active:scale-[0.98]"
            >
              <span>{setts.primaryCtaText || "Let's Work Together"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Actions and Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 dark:border-zinc-800 bg-stone-50/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                    : 'text-stone-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-stone-200 dark:border-zinc-800 flex flex-col gap-2">
              {/* Mobile theme toggle button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-stone-700" />
                  )}
                  <span>Appearance: {theme === 'dark' ? 'Dark Mode' : 'Light Mode (White)'}</span>
                </div>
                <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">Tap to Switch</span>
              </button>

              <button
                onClick={() => handleLinkClick('inquiry')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 text-white font-semibold text-sm shadow-md"
              >
                <span>{setts.primaryCtaText || "Let's Work Together"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
