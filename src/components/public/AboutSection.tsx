import React from 'react';
import { AboutContent, SiteSettings } from '../../types';
import { Target, Compass, Sparkles, CheckCircle2, ShieldCheck, Zap, Laptop, Award } from 'lucide-react';

interface AboutSectionProps {
  about?: AboutContent;
  settings?: SiteSettings;
  onCtaClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about, settings, onCtaClick }) => {
  const ab = about || {
    id: 'main',
    title: 'Engineering Digital Excellence & Visual Impact',
    intro: 'Josam Technologies is a hybrid digital agency and technology consultancy dedicated to providing full-stack web software, bespoke graphic design, and trusted online cyber services.',
    bio: 'Founded with a mission to bridge technical innovation with creative branding, Josam Technologies provides end-to-end digital solutions for startups, enterprises, and individual professionals.',
    mission: 'To deliver tailored, scalable digital software and visually stunning brand identities that accelerate business growth and credibility.',
    vision: 'To be the most reliable, creative, and transformative digital technology partner across Africa and globally.',
    approach: 'We blend modern design aesthetics with enterprise-grade engineering and dedicated customer care.',
    highlights: [
      'Engineered for 99.9% uptime and lightning speed',
      'Original vector brand graphics and print-ready designs',
      'Reliable cyber and government compliance assistance',
      'Ongoing post-launch technical support and consulting',
    ],
    updatedAt: new Date().toISOString(),
  };

  const handleCta = onCtaClick || (() => {
    const el = document.getElementById('inquiry');
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <section id="about" className="py-24 bg-stone-50 dark:bg-zinc-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About {settings?.brandName || 'Josam Technologies'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white font-['Outfit'] tracking-tight">
            {ab.title || 'Engineering Digital Excellence & Visual Impact'}
          </h2>
          <p className="text-stone-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
            {ab.intro}
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission, Vision, Approach */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-3">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white font-['Outfit'] flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </span>
                Our Background &amp; Philosophy
              </h3>
              <p className="text-stone-600 dark:text-zinc-300 text-sm leading-relaxed">
                {ab.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Mission */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit']">
                  Our Mission
                </h4>
                <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                  {ab.mission}
                </p>
              </div>

              {/* Vision */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit']">
                  Our Vision
                </h4>
                <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                  {ab.vision}
                </p>
              </div>

            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <h4 className="font-bold text-base text-stone-900 dark:text-white font-['Outfit']">
                  Our Approach
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed">
                {ab.approach}
              </p>
            </div>

          </div>

          {/* Right Column: Highlights Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-zinc-900 to-black text-white p-8 sm:p-10 border border-stone-800 shadow-2xl relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-orange-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>The Josam Standard</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] leading-tight">
                  Crafting Distinction in Every Pixel &amp; Line of Code
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  We don't settle for average. We combine modern technical stacks with artistic design and absolute compliance.
                </p>

                {/* Highlights list */}
                <div className="pt-2 space-y-3">
                  {ab.highlights?.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <button
                    onClick={handleCta}
                    className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-lg transition-colors cursor-pointer"
                  >
                    Let's Work Together
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
