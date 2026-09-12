import React, { useState } from 'react';
import { WebProject } from '../../types';
import { X, ExternalLink, Github, CheckCircle2, Globe, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: WebProject | null;
  isOpen: boolean;
  onClose: () => void;
  onInquire?: (projectName: string) => void;
  onStartInquiry?: (projectName?: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onInquire,
  onStartInquiry,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !project) return null;

  const handleInquiryAction = () => {
    onClose();
    if (onInquire) {
      onInquire(project.title);
    } else if (onStartInquiry) {
      onStartInquiry(project.title);
    } else {
      const el = document.getElementById('inquiry');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const allImages = [project.mainImage, ...(project.additionalImages || [])].filter(Boolean);
  const currentImg = allImages[activeImageIndex] || project.mainImage;

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="project-modal-container"
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Box */}
        <div className="relative bg-stone-950 aspect-video w-full overflow-hidden flex items-center justify-center">
          <img
            src={currentImg}
            alt={project.title}
            className="w-full h-full object-cover sm:object-contain"
          />

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-600/90 text-white shadow-sm backdrop-blur-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Gallery Thumbnails if multiple */}
        {allImages.length > 1 && (
          <div className="px-6 py-3 bg-stone-100 dark:bg-zinc-950 flex items-center gap-3 overflow-x-auto border-b border-stone-200 dark:border-zinc-800">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-orange-500 scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-['Outfit']">
              {project.title}
            </h2>
            <p className="mt-3 text-stone-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Technologies &amp; Architecture</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 border border-stone-200 dark:border-zinc-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
            </div>

            <button
              onClick={handleInquiryAction}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-900 dark:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Inquire Similar Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
