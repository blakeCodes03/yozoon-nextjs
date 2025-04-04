// src/components/pages/CoinsList/CoinsList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CoinCard from '../../ui/CoinCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../common/Spinner';
import Link from 'next/link';

interface Coin {
  id: string;
  name: string;
  ticker: string;
  description: string;
  votes: number;
  pictureUrl: string;
  status: string; // "voting" or "bondingCurve"
}

const CoinsList: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<{ blockchain: string; rating: string; createdAt: string }>({
    blockchain: 'blockchain',
    rating: 'rating',
    createdAt: 'created',
  });

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get('/api/coins', { params: filters });
        setCoins(response.data);
      } catch (error) {
        console.error('Error fetching coins:', error);
        toast.error('Failed to fetch coins.');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCoins();
  }, [filters]);

  const handleVote = async (coinId: string, support: boolean) => {
    try {
      const response = await axios.post(`/api/coins/${coinId}/vote`, {
        support,
      });

      if (response.status === 200) {
        // Update the specific coin's vote count
        setCoins((prevCoins) =>
          prevCoins.map((coin) =>
            coin.id === coinId ? { ...coin, votes: response.data.voteCount } : coin
          )
        );
        toast.success('🎉 Your vote has been recorded!');
      } else {
        toast.error(response.data.message || 'Failed to submit vote.');
      }
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      toast.error(error.response?.data?.message || 'Failed to submit vote.');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="all-coins-container relative">
      {/* Floating particles */}
      <div className="floating-particles"></div>
      <div className="floating-particles" style={{ animationDelay: '0.5s', left: '20%' }}></div>
      <div className="floating-particles" style={{ animationDelay: '1s', left: '40%' }}></div>
      <div className="floating-particles" style={{ animationDelay: '1.5s', left: '60%' }}></div>
      <div className="floating-particles" style={{ animationDelay: '2s', left: '80%' }}></div>

      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-neonBlue">Cryptowny Voting</h1>
        <div className="flex space-x-4">
          {/* Filters */}
          <select
            name="blockchain"
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
            value={filters.blockchain}
            onChange={handleFilterChange}
          >
            <option value="blockchain">Blockchain</option>
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
            <option value="bnb">BNB</option>
          </select>
          <select
            name="rating"
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
            value={filters.rating}
            onChange={handleFilterChange}
          >
            <option value="rating">Rating</option>
            <option value="high-to-low">High to Low</option>
            <option value="low-to-high">Low to High</option>
          </select>
          <select
            name="createdAt"
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
            value={filters.createdAt}
            onChange={handleFilterChange}
          >
            <option value="created">Created At</option>
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>
        </div>
      </header>

      <main className="px-8 py-12">
        {coins.length === 0 ? (
          <div className="text-center text-textSecondary">
            No coins found based on the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} onVote={handleVote} />
            ))}
          </div>
        )}
      </main>

      {/* Live Actions Div */}
      <aside className="live-actions absolute bottom-4 right-4 bg-neutralDarkGray shadow-lg rounded-lg p-4">
        <h3 className="text-neonBlue mb-2">Live Actions</h3>
        <ul className="activity-list">
          <li className="flex justify-between items-center mb-2">
            <span className="action-type">Buy</span> 10 PrimeCoin
            <Link href="/primecoin" className="text-neonBlue hover:underline">
              Open
            </Link>
          </li>
          <li className="flex justify-between items-center mb-2">
            <span className="action-type">Vote</span> Upvote EpicCoin
            <Link href="/epiccoin" className="text-neonBlue hover:underline">
              Open
            </Link>
          </li>
          {/* Add more live actions as needed */}
        </ul>
      </aside>
    </div>
  );
};

export default CoinsList;
