// src/components/pages/CoinPage/BondingCurvePage.tsx

import React from 'react';
import Image from 'next/image';
import { FaGlobe, FaTwitter, FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Import arrow icons
import { Coin } from './CoinDetails';
import BlockchainIcon from '../../common/BlockchainIcon';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import TradingViewWidget from '../../common/TradingViewWidget';
import ChatRoom from '../../ui/ChatRoom';

interface BondingCurvePageProps {
  coin: Coin;
}

const BondingCurvePage: React.FC<BondingCurvePageProps> = ({ coin }) => {
  const { data: session } = useSession();
  const [buyAmount, setBuyAmount] = React.useState<number>(0);
  const [sellAmount, setSellAmount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleBuy = async () => {
    if (!session) {
      toast.error('You must be logged in to buy.');
      return;
    }

    if (buyAmount <= 0) {
      toast.error('Please enter a valid amount to buy.');
      return;
    }

    setLoading(true);

    try {
      // Implement buy logic, e.g., call an API endpoint to handle the purchase
      // Replace the URL and payload as per your backend API
      const response = await axios.post(`/api/coins/${coin.id}/buy`, { amount: buyAmount });

      // Update marketCap or other relevant fields based on response
      // Example:
      // setCoinData(prev => ({ ...prev, marketCap: response.data.newMarketCap }));

      toast.success('Purchase successful.');
      setBuyAmount(0);
    } catch (error: any) {
      console.error('Error purchasing coin:', error);
      toast.error(error.response?.data?.message || 'Failed to purchase coin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (!session) {
      toast.error('You must be logged in to sell.');
      return;
    }

    if (sellAmount <= 0) {
      toast.error('Please enter a valid amount to sell.');
      return;
    }

    setLoading(true);

    try {
      // Implement sell logic
      const response = await axios.post(`/api/coins/${coin.id}/sell`, { amount: sellAmount });

      // Update marketCap or other relevant fields based on response

      toast.success('Sell successful.');
      setSellAmount(0);
    } catch (error: any) {
      console.error('Error selling coin:', error);
      toast.error(error.response?.data?.message || 'Failed to sell coin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      {/* Coin Header */}
      <header className="flex flex-col items-center">
        <Image
          src={coin.pictureUrl}
          alt={coin.name}
          width={100}
          height={100}
          className="rounded-full mb-4"
        />
        <h1 className="text-3xl font-bold">
          {coin.name} ({coin.ticker})
        </h1>
        <p className="text-gray-400 flex items-center">
          Blockchain: <BlockchainIcon blockchain={coin.blockchain} size={24} className="ml-2" />
        </p>
      </header>

      {/* Social Links */}
      <section className="mt-6 flex justify-center space-x-6">
        {coin.socialLinks.website && (
          <a href={coin.socialLinks.website} target="_blank" rel="noopener noreferrer">
            <FaGlobe className="text-2xl hover:text-blue-400" />
          </a>
        )}
        {coin.socialLinks.twitter && (
          <a href={coin.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl hover:text-blue-400" />
          </a>
        )}
        {coin.socialLinks.instagram && (
          <a href={coin.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl hover:text-blue-400" />
          </a>
        )}
        {coin.socialLinks.telegram && (
          <a href={coin.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
            <FaTelegramPlane className="text-2xl hover:text-blue-400" />
          </a>
        )}
      </section>

      {/* Bonding Curve Information */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Bonding Curve</h2>
        {/* Bonding Curve Progress */}
        <div className="mb-6">
          <p>Bonding Curve Progress</p>
          <div className="w-full bg-gray-700 h-4 rounded">
            {/* Replace with actual progress percentage */}
            <div
              className="bg-blue-500 h-4 rounded"
              style={{ width: `${Math.min((coin.marketCap / coin.totalSupply) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Buy/Sell Form */}
        <div className="mb-6 flex flex-col md:flex-row justify-between">
          {/* Buy Form */}
          <div className="mb-4 md:mb-0 md:w-1/2 md:mr-2 p-4 bg-gray-800 rounded">
            <h3 className="text-xl font-bold mb-2">Buy {coin.ticker}</h3>
            <input
              type="number"
              min="0"
              value={buyAmount}
              onChange={(e) => setBuyAmount(parseFloat(e.target.value))}
              className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded"
              placeholder="Amount to buy"
            />
            <button
              className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center"
              onClick={handleBuy}
              disabled={loading}
            >
              Buy <FaArrowUp className="ml-2" />
            </button>
          </div>

          {/* Sell Form */}
          <div className="md:w-1/2 md:ml-2 p-4 bg-gray-800 rounded">
            <h3 className="text-xl font-bold mb-2">Sell {coin.ticker}</h3>
            <input
              type="number"
              min="0"
              value={sellAmount}
              onChange={(e) => setSellAmount(parseFloat(e.target.value))}
              className="w-full px-3 py-2 mb-2 bg-gray-700 text-white rounded"
              placeholder="Amount to sell"
            />
            <button
              className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center"
              onClick={handleSell}
              disabled={loading}
            >
              Sell <FaArrowDown className="ml-2" />
            </button>
          </div>
        </div>

        {/* TradingView Chart */}
        <div className="mb-6">
          <TradingViewWidget symbol={`${coin.ticker}USD`} />
        </div>
      </section>

      {/* Coin Description */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">About {coin.name}</h2>
        <p className="text-gray-300">{coin.description}</p>
      </section>

      {/* Airdrop Amount */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Airdrop Details</h2>
        <p className="text-gray-300">Airdrop Amount: {coin.airdropAmount} {coin.ticker}</p>
      </section>

      {/* Vesting Details */}
      {coin.vestingDetails && (
        <section className="mt-8 p-4 bg-gray-800 rounded">
          <h2 className="text-2xl font-bold mb-2">Vesting Details</h2>
          <p className="text-gray-300">Who: {coin.vestingDetails.who}</p>
          <p className="text-gray-300">Release Date: {coin.vestingDetails.releaseDate}</p>
          <p className="text-gray-300">Release Percentage: {coin.vestingDetails.releasePercentage}%</p>
          {coin.vestingDetails.staggered && (
            <>
              <p className="text-gray-300">Stagger Interval: {coin.vestingDetails.staggerIntervalDays} days</p>
              <p className="text-gray-300">Stagger Percentage: {coin.vestingDetails.staggerPercentage}%</p>
            </>
          )}
        </section>
      )}

      {/* Team Members */}
      {coin.teamMembers && coin.teamMembers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Team Members</h2>
          <div className="flex flex-wrap">
            {coin.teamMembers.map((member) => (
              <div key={member.id} className="w-1/2 md:w-1/4 p-2">
                <div className="bg-gray-800 p-4 rounded">
                  <Image
                    src={member.avatarUrl || '/default-avatar.png'}
                    alt={member.displayName || member.username}
                    width={80}
                    height={80}
                    className="rounded-full mb-2"
                  />
                  <p className="text-center">{member.displayName || member.username}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Chat Room */}
      <section className="mt-8">
        <ChatRoom coinId={coin.id} />
      </section>
    </div>
  );
};

export default BondingCurvePage;
