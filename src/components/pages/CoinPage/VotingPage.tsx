// src/components/pages/CoinPage/VotingPage.tsx

import React from 'react';
import Image from 'next/image';
import { FaGlobe, FaTwitter, FaTelegramPlane, FaInstagram, FaTimes } from 'react-icons/fa';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Import arrow icons
import { Coin } from './CoinDetails';
import BlockchainIcon from '../../common/BlockchainIcon';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import ChatRoom from '../../ui/ChatRoom';
import { formatDistanceToNow } from 'date-fns';

interface VotingPageProps {
  coin: Coin;
}

const VotingPage: React.FC<VotingPageProps> = ({ coin }) => {
  const { data: session } = useSession();
  const [voteCount, setVoteCount] = React.useState<number>(0);
  const [userVote, setUserVote] = React.useState<number>(0); // 1 for upvote, -1 for downvote, 0 for no vote
  const [loading, setLoading] = React.useState<boolean>(false);

  // Define fetchVotes using useCallback to avoid unnecessary re-renders
  const fetchVotes = React.useCallback(async () => {
    try {
      const response = await axios.get(`/api/coins/${coin.id}/votes`);
      setVoteCount(response.data.voteCount);
      setUserVote(response.data.userVote);
    } catch (error) {
      console.error('Error fetching votes:', error);
      toast.error('Failed to fetch vote data.');
    }
  }, [coin.id]);

  // Fetch votes on component mount and when coin.id changes
  React.useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const handleVote = async (value: number) => {
    if (!session) {
      toast.error('You must be logged in to vote.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/coins/${coin.id}/vote`,
        { value },
        { withCredentials: true }
      );

      // Update state based on API response
      setVoteCount(response.data.voteCount);
      setUserVote(response.data.userVote);

      // Calculate reputation points earned (assuming 1 point per vote)
      const reputationEarned = 1; // Modify as per your logic

      toast.success(
        `🎉 Thank you for your vote! Your vote has made the community safer. +${reputationEarned} Reputation Points earned! 🚀`
      );
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      toast.error(error.response?.data?.message || 'Failed to submit vote.');
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
          style={{ objectFit: 'cover' }} // Updated to use style prop
        />
        <h1 className="text-3xl font-bold">
          {coin.name} ({coin.ticker})
        </h1>
        <p className="text-gray-400 flex items-center">
          Blockchain: <BlockchainIcon blockchain={coin.blockchain} size={24} className="ml-2" />
        </p>
        {/* Created X Ago */}
        <p className="text-gray-400 mt-2">
          Created {formatDistanceToNow(new Date(coin.createdAt), { addSuffix: true })}
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

      {/* Coin Description */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">About {coin.name}</h2>
        <p className="text-gray-300">{coin.description}</p>
      </section>

      {/* Voting Section */}
      <section className="mt-8 flex justify-center items-center gap-4">
        <button
          className={`vote-btn upvote ${userVote === 1 ? 'text-green-500' : ''}`}
          onClick={() => handleVote(1)}
          disabled={loading}
          aria-label="Upvote"
        >
          <FaArrowUp size={24} />
        </button>
        <span className="vote-count text-2xl font-bold">{voteCount}</span>
        <button
          className={`vote-btn downvote ${userVote === -1 ? 'text-red-500' : ''}`}
          onClick={() => handleVote(-1)}
          disabled={loading}
          aria-label="Downvote"
        >
          <FaArrowDown size={24} />
        </button>
      </section>

      {/* Voting Progress Bar */}
      <section className="mt-8">
        <p>Voting Progress</p>
        <div className="w-full bg-gray-700 h-4 rounded">
          <div
            className="bg-blue-500 h-4 rounded transition-width duration-300"
            style={{ width: `${Math.min((voteCount / 100) * 100, 100)}%` }}
          ></div>
        </div>
        <p>{voteCount}/100 votes needed to enter bonding curve phase.</p>
      </section>

      {/* Airdrop Amount */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Airdrop Details</h2>
        <p className="text-gray-300">Airdrop Amount: 10% {coin.ticker}</p>
      </section>

      {/* Vesting Details */}
      {coin.vestingDetails ? (
        <section className="mt-8 p-4 bg-gray-800 rounded">
          <h2 className="text-2xl font-bold mb-2">Vesting Details</h2>
          <p className="text-gray-300">Who: {coin.vestingDetails.who}</p>
          <p className="text-gray-300">Release Date: {coin.vestingDetails.releaseDate}</p>
          <p className="text-gray-300">Release Percentage: {coin.vestingDetails.releasePercentage}%</p>
          {coin.vestingDetails.staggered && (
            <>
              <p className="text-gray-300">
                Stagger Interval: {coin.vestingDetails.staggerIntervalDays} days
              </p>
              <p className="text-gray-300">
                Stagger Percentage: {coin.vestingDetails.staggerPercentage}%
              </p>
            </>
          )}
        </section>
      ) : (
        <section className="mt-8 flex items-center">
          <FaTimes className="text-red-500 mr-2" />
          <p className="text-red-500">Vesting details not set.</p>
        </section>
      )}

      {/* Team Members */}
      {coin.teamMembers && coin.teamMembers.length > 0 ? (
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
                    style={{ objectFit: 'cover' }} // Updated to use style prop
                  />
                  <p className="text-center">{member.displayName || member.username}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8 flex items-center">
          <FaTimes className="text-red-500 mr-2" />
          <p className="text-red-500">No team members added.</p>
        </section>
      )}

      {/* Chat Room */}
      <section className="mt-8">
        <ChatRoom coinId={coin.id} />
      </section>
    </div>
  );
};

export default VotingPage;
