import React, { useState } from 'react';
import { GraphicProject } from '../../types';
import { Palette, Maximize2, Tag, Sparkles } from 'lucide-react';

interface GraphicProjectsSectionProps {
  projects?: GraphicProject[];
  onOpenLightbox?: (project: GraphicProject) => void;
  onImageZoom?: (imageUrl: string, title: string, category?: string) => void;
}

export const GraphicProjectsSection: React.FC<GraphicProjectsSectionProps> = ({
  projects = [],
  onOpenLightbox,
  onImageZoom,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = ['All', ...Array.from<string>(new Set(projects.map((p) => p.category)))];

  const handleItemClick = (project: GraphicProject) => {
    if (onImageZoom) {
      onImageZoom(project.mainImage, project.title, project.category);
    } else if (onOpenLightbox) {
      onOpenLightbox(project);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="graphic-projects" className="py-24 bg-white dark:bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 text-xs font-semibold">
              <Palette className="w-3.5 h-3.5" />
              <span>Visual Branding &amp; Graphic Arts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white font-['Outfit'] tracking-tight">
              Graphic Design &amp; Brand Portfolio
            </h2>
            <p className="text-stone-600 dark:text-zinc-400 text-base">
              Iconic logos, brand guidelines, promotional posters, and social media creative assets designed to leave an impression.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`graphic-cat-${(cat || '').toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-100 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`graphic-card-${project.id}`}
              onClick={() => handleItemClick(project)}
              className="group relative rounded-2xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Box */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md border border-white/10">
                  {project.category}
                </span>

                {project.isFeatured && (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-400 text-black flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              {/* Content on Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg font-['Outfit'] text-white group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center backdrop-blur-sm transition-colors shrink-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/15 text-zinc-200 backdrop-blur-xs flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 opacity-70" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
