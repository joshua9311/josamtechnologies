import React, { useState } from 'react';
import { LocationSettings, ContactSettings } from '../../types';
import { Building2, Clock, Phone, Mail, MessageCircle, Check, Copy, Sparkles, ShieldCheck } from 'lucide-react';

interface LocationSectionProps {
  location: LocationSettings;
  contact: ContactSettings;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ location, contact }) => {
  const [copied, setCopied] = useState(false);

  const loc = location || {
    id: 'main',
    locationName: 'Josam Technologies Physical & Digital Hub',
    address: 'Commercial Business Centre, Nairobi, Kenya',
    description: 'Conveniently located for in-person consultations, digital document processing, and project strategy sessions.',
    updatedAt: new Date().toISOString(),
  };

  const cont = contact || {
    id: 'main',
    email: 'info@josamtech.com',
    phone: '+254 700 000 000',
    whatsapp: '+254 700 000 000',
    description: 'Get in touch with our team for consultations, quotes, and project estimates.',
    businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
    updatedAt: new Date().toISOString(),
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(loc.address || 'Commercial Business Centre, Nairobi, Kenya');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 bg-stone-50 dark:bg-zinc-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-8 sm:p-12 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Physical Office &amp; Operations Hub</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white font-['Outfit']">
                {loc.locationName || 'Josam Technologies Headquarters'}
              </h2>

              <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed">
                {loc.description ||
                  'Our dedicated physical and digital operations centre is structured for client consultations, full-stack software strategy sessions, and prompt cyber compliance assistance.'}
              </p>

              {/* Detail Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                      <Building2 className="w-4 h-4" />
                      <span>Physical Address</span>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 rounded-md text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-zinc-200">
                    {loc.address || 'Commercial Business Centre, Nairobi, Kenya'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    <span>Working Hours</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-zinc-200">
                    {cont.businessHours || 'Monday - Saturday: 8:00 AM - 7:00 PM'}
                  </p>
                </div>

              </div>

              {/* Quick Communication Channels */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${cont.phone ? cont.phone.replace(/\s+/g, '') : ''}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-orange-400" />
                  <span>Call {cont.phone}</span>
                </a>

                <a
                  href={`mailto:${cont.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-900 dark:text-zinc-100 text-xs font-semibold border border-stone-200 dark:border-zinc-700 transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>{cont.email}</span>
                </a>

                <a
                  href={`https://wa.me/${(cont.whatsapp || cont.phone || '254700000000').replace(/\D/g, '')}?text=${encodeURIComponent('Hello Josam Technologies, I would like to make an inquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>

            </div>

            {/* Hub Features & Assurance Column */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-zinc-950 p-6 sm:p-7 text-white border border-stone-800 space-y-5 relative overflow-hidden shadow-xl">
                
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-zinc-300">Hub Status: Operational</span>
                  </div>
                  <span className="text-[11px] font-semibold text-orange-400 bg-orange-950/70 px-2.5 py-1 rounded-full border border-orange-900/80">
                    Nairobi &amp; Remote
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">In-Person &amp; Remote Consultations</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Meet with our software engineers and designers in Nairobi or via structured online sessions.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                    <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">Rapid Document Processing</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Walk-in and online turnaround for verified KRA, HELB, eCitizen, and business registration services.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white">Dedicated Technical Support</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">6-day active assistance via WhatsApp, direct phone line, and official email ticketing.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
