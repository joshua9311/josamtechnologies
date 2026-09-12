import React from 'react';
import { SiteSettings, ContactSettings, LocationSettings, SocialLink } from '../../types';
import { DynamicIcon } from './DynamicIcon';
import { Shield, Mail, Phone, MapPin, Clock, ArrowUp, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  settings?: SiteSettings;
  contact?: ContactSettings;
  location?: LocationSettings;
  socials?: SocialLink[];
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  contact,
  location,
  socials = [],
  onNavigate,
}) => {
  const setts = settings || {
    siteName: 'Josam Technologies',
    brandName: 'Josam Technologies',
    tagline: 'Building Digital Experiences. Creating Powerful Brands.',
    logoUrl: '/logo-icon.svg',
    iconUrl: '/logo-icon.svg',
  };

  const cont = contact || {
    email: 'info@josamtech.com',
    phone: '+254 700 000 000',
    businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
  };

  const loc = location || {
    address: 'Commercial Business Centre, Nairobi, Kenya',
    mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
  };

  const handleNav = onNavigate || ((sec: string) => {
    const el = document.getElementById(sec);
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-stone-900 dark:bg-black text-stone-300 dark:text-zinc-400 border-t border-stone-800 dark:border-zinc-900 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800 dark:border-zinc-800">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center overflow-hidden">
                <img
                  src={setts.iconUrl || '/logo-icon.svg'}
                  alt="Josam Technologies"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex items-center gap-1 font-['Outfit']">
                <span className="font-extrabold text-2xl text-orange-500">JOSAM</span>
                <span className="font-bold text-2xl text-white">TECHNOLOGIES</span>
              </div>
            </div>

            <p className="text-sm text-stone-400 dark:text-zinc-400 leading-relaxed max-w-sm">
              {setts.tagline || 'Building Digital Experiences. Creating Powerful Brands.'}
            </p>
            <p className="text-xs text-stone-500 dark:text-zinc-500">
              Modern full-stack web platforms, brand graphic design, and trusted digital compliance services.
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-3">
                Connect With Us
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    id={`footer-social-${social.platform}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-stone-800 dark:bg-zinc-900 hover:bg-orange-600 dark:hover:bg-orange-600 text-stone-300 hover:text-white transition-all duration-200 border border-stone-700 dark:border-zinc-800"
                    title={social.platformName}
                  >
                    <DynamicIcon name={social.icon} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              {['home', 'about', 'services', 'web-projects', 'graphic-projects', 'cyber-services', 'testimonials'].map((sec) => (
                <li key={sec}>
                  <button
                    onClick={() => handleNav(sec)}
                    className="hover:text-orange-400 transition-colors text-left capitalize"
                  >
                    {sec.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Capabilities */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-stone-400 dark:text-zinc-400">
              <li>Full-Stack Websites</li>
              <li>E-Commerce Solutions</li>
              <li>Brand Identity &amp; Logos</li>
              <li>Marketing Collateral</li>
              <li>KRA iTax &amp; Compliance</li>
              <li>HELB Student Loans</li>
              <li>eCitizen &amp; Digital Filings</li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs text-stone-300 dark:text-zinc-400">
              <li>
                <a
                  href={`mailto:${cont.email}`}
                  className="flex items-start gap-2.5 hover:text-orange-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="break-all">{cont.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${cont.phone ? cont.phone.replace(/\s+/g, '') : ''}`}
                  className="flex items-center gap-2.5 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{cont.phone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-stone-300 dark:text-zinc-400">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{loc.address || 'Nairobi, Kenya'}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-stone-400 dark:text-zinc-500">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{cont.businessHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-zinc-500">
          
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Josam Technologies. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-orange-400 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
