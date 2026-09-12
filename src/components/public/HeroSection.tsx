import React from 'react';
import { SiteSettings, ContactSettings } from '../../types';
import { ArrowRight, Code2, Palette, ShieldCheck, Sparkles, CheckCircle, Terminal, Layers } from 'lucide-react';

interface HeroSectionProps {
  settings?: SiteSettings;
  contact?: ContactSettings;
  onCtaClick?: () => void;
  onExploreProjects?: () => void;
  onExploreServices?: () => void;
  onStartInquiry?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onCtaClick,
  onExploreProjects,
  onExploreServices,
  onStartInquiry,
}) => {
  const setts = settings || {
    siteName: 'Josam Technologies',
    heroBadgeText: 'Empowering Modern Enterprises & Creators',
    heroHeadline: 'Building Digital Experiences. Creating Powerful Brands.',
    heroSubheadline: 'We engineer high-performance websites, bespoke graphic identities, and seamless cyber digital services tailored for ambitious businesses.',
    primaryCtaText: "Let's Work Together",
    secondaryCtaText: 'Explore Projects',
  };

  const handlePrimary = onStartInquiry || onCtaClick || (() => {
    const el = document.getElementById('inquiry');
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleSecondary = onExploreServices || onExploreProjects || (() => {
    const el = document.getElementById('services') || document.getElementById('web-projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <section
      id="home"
      className="relative min-h-[90vh] pt-28 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-50 via-stone-100/50 to-stone-50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950"
    >
      {/* Background radial spotlights & grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-tr from-orange-500/5 to-yellow-500/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 text-orange-700 dark:text-orange-400 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{setts.heroBadgeText || 'Empowering Modern Enterprises & Creators'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 dark:text-white font-['Outfit'] leading-[1.1] text-balance">
            Building Digital Experiences.{' '}
            <span className="text-gradient">Creating Powerful Brands.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed text-pretty font-normal">
            {setts.heroSubheadline ||
              'We engineer high-performance websites, bespoke graphic identities, and seamless cyber digital services tailored for ambitious businesses.'}
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-primary-cta"
              onClick={handlePrimary}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-base shadow-lg hover:shadow-orange-500/25 transition-all duration-200 active:scale-[0.98] group"
            >
              <span>{setts.primaryCtaText || "Let's Work Together"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={handleSecondary}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-stone-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-semibold text-base border border-stone-200 dark:border-zinc-800 shadow-xs transition-all duration-200"
            >
              <span>{setts.secondaryCtaText || 'Explore Projects'}</span>
            </button>
          </div>

          {/* Value Highlights Pill Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-stone-600 dark:text-zinc-400 font-medium">
            <div
              onClick={() => {
                const el = document.getElementById('web-projects');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-orange-500 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full-Stack Web Engineering</span>
            </div>
            <div
              onClick={() => {
                const el = document.getElementById('graphic-projects');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-amber-500 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Vector Graphic Design</span>
            </div>
            <div
              onClick={() => {
                const el = document.getElementById('cyber-services');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-orange-500 transition-colors font-semibold"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>KRA &amp; HELB Cyber Services</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No Template Clones</span>
            </div>
          </div>

        </div>

        {/* Hero Interactive Terminal / Product Feature Graphic Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl overflow-hidden border-brand-glow">
          
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-stone-100 dark:bg-zinc-950 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-stone-500 dark:text-zinc-500 hidden sm:inline">
                josam-tech-ecosystem ~ architecture &amp; creative studio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live &amp; Operational
              </span>
            </div>
          </div>

          {/* Window Interior Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-50/50 dark:bg-zinc-900/50">
            
            {/* Feature 1 */}
            <div
              onClick={() => {
                const el = document.getElementById('web-projects');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800/80 space-y-3 cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit'] group-hover:text-orange-500 transition-colors">
                Web Development
              </h3>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                Modern full-stack websites, e-commerce suites, APIs, and high-performance business web platforms.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => {
                const el = document.getElementById('graphic-projects');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800/80 space-y-3 cursor-pointer hover:border-amber-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit'] group-hover:text-amber-500 transition-colors">
                Graphic Design
              </h3>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                Brand identities, logos, marketing posters, event flyers, and visual style guides that captivate audiences.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => {
                const el = document.getElementById('cyber-services');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800/80 space-y-3 cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit'] group-hover:text-orange-500 transition-colors">
                  Cyber &amp; Digital Services
                </h3>
                <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Jump to desk &darr;
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                Accurate KRA tax returns, HELB smart portal processing, eCitizen filings, and official digital document workflows.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
