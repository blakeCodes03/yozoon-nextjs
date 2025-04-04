// src/components/pages/StartNewCoin/MilestoneBanner.tsx

import React from 'react';
import { FaAward } from 'react-icons/fa';

const milestones = [
  { marketCap: '0.5 SOL', reward: 'For Developers' },
  { marketCap: '5 Million', reward: 'Reward 1' },
  { marketCap: '10 Million', reward: 'Reward 2' },
  { marketCap: '25 Million', reward: 'Reward 3' },
  { marketCap: '50 Million', reward: 'Reward 4' },
  { marketCap: '250 Million', reward: 'Reward 5' },
  { marketCap: '500 Million', reward: 'Reward 6' },
  { marketCap: '1 Billion', reward: 'Reward 7' },
];

const MilestoneBanner: React.FC = () => {
  return (
    <div className="my-8 p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaAward className="mr-2" /> Developer Milestones
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="p-4 bg-opacity-20 bg-black rounded-lg">
            <h3 className="text-xl font-semibold">{milestone.marketCap}</h3>
            <p>{milestone.reward}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneBanner;
