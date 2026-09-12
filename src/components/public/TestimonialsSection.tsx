import React from 'react';
import { Testimonial } from '../../types';
import { Star, MessageSquareQuote, Sparkles } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = [] }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-stone-50 dark:bg-zinc-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Feedback &amp; Partnerships</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white font-['Outfit'] tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-stone-600 dark:text-zinc-400 text-base sm:text-lg">
            Real feedback from business leaders, startup founders, and organizations that trust Josam Technologies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              id={`testimonial-card-${item.id}`}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
            >
              <div className="space-y-4">
                
                {/* Star rating & quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-orange-500/30" />
                </div>

                {/* Message */}
                <p className="text-stone-700 dark:text-zinc-300 text-sm leading-relaxed italic">
                  "{item.message}"
                </p>

              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-stone-100 dark:border-zinc-800 flex items-center gap-3.5">
                {item.clientImage ? (
                  <img
                    src={item.clientImage}
                    alt={item.clientName}
                    className="w-11 h-11 rounded-full object-cover border border-stone-200 dark:border-zinc-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-orange-600/10 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-sm border border-orange-500/20">
                    {item.clientName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white font-['Outfit']">
                    {item.clientName}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    {item.clientRole}, {item.clientCompany}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
