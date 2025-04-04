// src/components/pages/ProfilePage/NavigationCard.tsx

import React from 'react';
import Icon from '../../common/Icon';

interface NavigationCardProps {
  title: string;
  icon: string; // Icon name as defined in your Icon component
  onClick: () => void;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ title, icon, onClick }) => {
  return (
    <div
      className="bg-bg3 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 cursor-pointer hover:bg-bg4 transition-transform transform hover:scale-105"
      onClick={onClick}
    >
      <Icon name={icon} size={32} className="text-accentBlue" />
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
  );
};

export default NavigationCard;
