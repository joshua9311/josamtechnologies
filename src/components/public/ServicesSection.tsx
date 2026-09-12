import React, { useState } from 'react';
import { ServiceItem, ServiceCategory } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { CheckCircle, ArrowRight, ArrowDown, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  services?: ServiceItem[];
  onSelectServiceForInquiry?: (serviceTitle: string) => void;
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = [],
  onSelectServiceForInquiry,
  onSelectService,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const scrollToCyberSection = () => {
    const el = document.getElementById('cyber-services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'cyber') {
      scrollToCyberSection();
    }
  };

  const handleSelectService = (title: string) => {
    if (onSelectServiceForInquiry) {
      onSelectServiceForInquiry(title);
    } else if (onSelectService) {
      onSelectService(title);
    } else {
      const el = document.getElementById('inquiry');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'web', label: 'Web Development' },
    { id: 'graphic', label: 'Graphic Design' },
    { id: 'cyber', label: 'Cyber Services & Digital Solutions' },
  ];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <section id="services" className="py-24 bg-white dark:bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white font-['Outfit'] tracking-tight">
            Our Core Digital Capabilities
          </h2>
          <p className="text-stone-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
            From modern responsive software engineering and expressive brand graphics to mission-critical cyber compliance.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`services-filter-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                }`}
              >
                <span>{cat.label}</span>
                {cat.id === 'cyber' && (
                  <ArrowDown className="w-3.5 h-3.5 opacity-80" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group relative rounded-2xl bg-stone-50 dark:bg-zinc-900 border border-stone-200/90 dark:border-zinc-800 p-7 flex flex-col justify-between hover:border-orange-500/60 dark:hover:border-orange-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                
                {/* Icon & Category Badge */}
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => {
                      if (service.category === 'cyber') scrollToCyberSection();
                    }}
                    className={`w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform ${
                      service.category === 'cyber' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <DynamicIcon name={service.iconName} className="w-6 h-6" />
                  </div>
                  <span
                    onClick={() => {
                      if (service.category === 'cyber') scrollToCyberSection();
                    }}
                    className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md transition-colors ${
                      service.category === 'cyber'
                        ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900'
                        : 'bg-stone-200/70 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                    }`}
                  >
                    {service.category === 'web'
                      ? 'Web Dev'
                      : service.category === 'graphic'
                      ? 'Design'
                      : service.category === 'cyber'
                      ? 'Cyber & Digital'
                      : 'Digital'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    onClick={() => {
                      if (service.category === 'cyber') scrollToCyberSection();
                    }}
                    className={`text-xl font-bold text-stone-900 dark:text-white font-['Outfit'] group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${
                      service.category === 'cyber' ? 'cursor-pointer' : ''
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Feature Bullet List */}
                {service.features && service.features.length > 0 && (
                  <div className="pt-2 border-t border-stone-200 dark:border-zinc-800">
                    <ul className="space-y-2">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-zinc-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-stone-200/80 dark:border-zinc-800/80">
                {service.category === 'cyber' ? (
                  <button
                    id={`service-cyber-btn-${service.id}`}
                    onClick={() => scrollToCyberSection()}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer group-hover:shadow-md"
                  >
                    <span>Explore Cyber &amp; Digital Solutions</span>
                    <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  </button>
                ) : (
                  <button
                    id={`service-request-btn-${service.id}`}
                    onClick={() => handleSelectService(service.title)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-900 dark:text-zinc-100 text-xs font-semibold border border-stone-200 dark:border-zinc-700 transition-all duration-200 group-hover:border-orange-500/40 cursor-pointer"
                  >
                    <span>Request This Service</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
