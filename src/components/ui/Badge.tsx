// src/components/ui/Badge.tsx

import React from 'react';

interface BadgeProps {
  badge: {
    id: string;
    name: string;
    description: string;
  };
}

const Badge: React.FC<BadgeProps> = ({ badge }) => {
  return (
    <div className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
      {badge.name}
    </div>
  );
};

export default Badge;
