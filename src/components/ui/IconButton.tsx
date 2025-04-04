// src/components/ui/IconButton.tsx

import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, ariaLabel, className = '' }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center p-2 rounded-full bg-neutralDarkGray hover:bg-accentBlue transition-colors ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
