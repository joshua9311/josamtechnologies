import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  whatsappNumber?: string;
  phone?: string;
  brandName?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  whatsappNumber,
  phone,
  brandName = 'Josam Technologies',
}) => {
  // Format WhatsApp number to digits only (e.g. "+254 792 000 111" -> "254792000111")
  const rawNumber = whatsappNumber || phone || '+254 700 000 000';
  const sanitizedNumber = (rawNumber || '').replace(/[^0-9]/g, '');
  const message = encodeURIComponent(`Hello ${brandName}, I'm interested in your services and would like to discuss a project.`);
  const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip */}
      <span className="mr-3 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-zinc-800 text-white text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block whitespace-nowrap border border-stone-700 dark:border-zinc-700">
        Chat with us on WhatsApp
      </span>

      {/* Floating CTA */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
