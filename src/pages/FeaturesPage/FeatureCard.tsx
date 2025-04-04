// src/components/pages/FeaturesPage/FeatureCard.tsx
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-bg6 text-textPrimary p-6 rounded-lg shadow-shadow1 hover:shadow-shadow2 transition-shadow duration-300">
      <div className="flex items-center justify-center w-16 h-16 bg-accentBlue text-white rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-textSecondary">{description}</p>
    </div>
  );
};

export default FeatureCard;
