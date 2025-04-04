// src/components/ui/TopReferrersBanner.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';



interface Referrer {
  username: string;
  rewards: number;
}

const TopReferrersBanner: React.FC = () => {
  const [referrers, setReferrers] = useState<Referrer[]>([]);

  useEffect(() => {
    const fetchReferrers = async () => {
      try {
        const response = await axios.get('/api/referrals/top');
        setReferrers(response.data);

        // Mock data
        const referrerss = [
          { username: 'LaughingTom', rewards: 100 },
          { username: 'CryptoChef', rewards: 50 },
          { username: 'HistoryBuff', rewards: 25 },
        ];
        setReferrers(referrerss);
      } catch (error) {
        console.error('Error fetching top referrers:', error);
        toast.error('Failed to load top referrers.');
      }
    };

    fetchReferrers();
  }, []);

  return (
    <div className="bg-[#191919]  py-2">
      <div className="container mx-auto flex items-center overflow-x-auto space-x-6 animate-scroll px-4">
        {referrers.map((ref, index) => (
          <div key={index} className="flex items-center space-x-2">
            {/* <FaStar />
            <span className="font-semibold">{ref.username}</span>
            <span>Earned {ref.rewards} SOL</span> */}

            <div className="text-xs mx-4 flex items-center gap-4 ">
              <div className="flex-shrink-0 w-8 h-4 ">
                <img
                  className="border-r-2 border-[#3C3C3C] pr-3  w-[100%] h-[100%] object-cover"
                  src="/assets/images/send-rank.svg"
                  alt=""
                />
              </div>

              <h1 className="instrument-fonts font-medium text-[#FFB92D] border-r-2 border-[#3C3C3C] pr-3">
                {ref.username}
              </h1>
              <h1 className="instrument-fonts font-medium text-[#FFB92D]">
                {ref.rewards} SOL
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopReferrersBanner;
