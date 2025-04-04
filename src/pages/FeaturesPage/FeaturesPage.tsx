// src/components/pages/FeaturesPage/FeaturesPage.tsx
import React from 'react';
import FeatureCard from './FeatureCard';
import { FaShieldAlt, FaTrophy, FaLayerGroup } from 'react-icons/fa';

const FeaturesPage: React.FC = () => {
  // Features data
  const features = [
    {
      id: 1,
      icon: <FaShieldAlt />,
      title: 'Secure Anti-Rug Protection',
      description: 'Your investments are safe with our state-of-the-art anti-rug mechanisms.',
    },
    {
      id: 2,
      icon: <FaTrophy />,
      title: 'Gamified Engagement',
      description: 'Earn badges, climb leaderboards, and make meme coins fun!',
    },
    {
      id: 3,
      icon: <FaLayerGroup />,
      title: 'Multi-Chain Support',
      description: 'Launch your coin on Ethereum, BNB, Solana, and more!',
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-textPrimary text-center">Our Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
