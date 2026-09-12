import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // Normalize lookup (case-insensitive fallback)
  const iconKey = Object.keys(Icons).find(
    k => k.toLowerCase() === (name || '').toLowerCase().replace(/[-_]/g, '')
  );

  const IconComponent = (iconKey ? (Icons as any)[iconKey] : null) || (Icons as any)[name] || Icons.Sparkles;

  return <IconComponent className={className} size={size} />;
};
