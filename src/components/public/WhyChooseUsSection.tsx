import React from 'react';
import { ShieldCheck, Cpu, Sparkles, Clock, Lock, Users, Headphones, Check } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Modern Architecture',
      desc: 'We engineer with TypeScript, React, Express, PostgreSQL, and clean APIs—avoiding fragile drag-and-drop website builders.',
    },
    {
      icon: Sparkles,
      title: 'Bespoke Brand Artistry',
      desc: 'Every graphic, logo mark, and vector artwork is custom-crafted to elevate your market presence and brand recall.',
    },
    {
      icon: ShieldCheck,
      title: 'Legitimate Cyber Compliance',
      desc: 'Direct, accurate handling of KRA iTax returns, PIN setups, HELB student loans, and official government portal filings.',
    },
    {
      icon: Lock,
      title: 'Security & Data Privacy',
      desc: 'Encrypted zero-trust data protection, rate-limited public forms, secure password hashing, and clean relational database integrity.',
    },
    {
      icon: Clock,
      title: 'Speed & Timely Execution',
      desc: 'We adhere strictly to project deadlines with clear milestones, regular updates, and zero unnecessary delays.',
    },
    {
      icon: Headphones,
      title: 'Dedicated Client Support',
      desc: 'Continuous post-launch maintenance, portal assistance, and transparent communication via WhatsApp and direct email.',
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>The Competitive Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white font-['Outfit'] tracking-tight">
            Why Partner With Josam Technologies?
          </h2>
          <p className="text-stone-600 dark:text-zinc-400 text-base sm:text-lg">
            We deliver the ideal blend of technical rigor, creative flair, and dependable digital services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-3 hover:border-orange-500/50 dark:hover:border-orange-500/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white font-['Outfit']">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
