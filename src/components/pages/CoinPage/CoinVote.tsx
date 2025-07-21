// src/components/pages/CoinPage/VotingPage.tsx

import React from 'react';
import Image from 'next/image';
import {
  FaGlobe,
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
  FaTimes,
} from 'react-icons/fa';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Import arrow icons
import { Coin } from './CoinDetails';
import BlockchainIcon from '../../common/BlockchainIcon';
import axios from 'axios';
import { useSession } from 'next-auth/react';
// import { toast } from 'react-toastify';
import { Toaster, toast } from 'sonner';

interface CoinVoteId {
  coinId: string;
}

const CoinVote: React.FC<CoinVoteId> = ({ coinId }) => {
  const { data: session } = useSession();
  const [voteCount, setVoteCount] = React.useState<number>(0);
  const [userVote, setUserVote] = React.useState<number>(0); // 1 for upvote, -1 for downvote, 0 for no vote
  const [upvoteCount, setUpvoteCount] = React.useState<number>(0);
  const [downvoteCount, setDownvoteCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Define fetchVotes using useCallback to avoid unnecessary re-renders
  const fetchVotes = React.useCallback(async () => {
    try {
      const response = await axios.get(`/api/coins/${coinId}/votes`);
      setUpvoteCount(response.data.upvoteCount);
      setDownvoteCount(response.data.downvoteCount);
      setVoteCount(response.data.voteCount);
      setUserVote(response.data.userVote);
    } catch (error) {
      console.error('Error fetching votes:', error);
      toast.error('Failed to fetch vote data.');
    }
  }, [coinId]);

  // Fetch votes on component mount and when coin.id changes
  React.useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const handleVote = async (value: number) => {
    if (!session) {
      toast.warning('You must be logged in to vote.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/coins/${coinId}/vote`,
        { value },
        { withCredentials: true }
      );

      // Update state based on API response
      setVoteCount(response.data.voteCount);
      setUserVote(response.data.userVote);

      toast.success('Thank you for your vote!');
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      toast.error(error.response?.data?.message || 'Failed to submit vote.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181A20] border-1 border-[#4B4B4B] px-4 py-3 rounded-[10px] my-5">
      <Toaster richColors position="top-right" />

      <div className="block md:flex justify-between items-center">
        <h2 className="sofia-fonts font-[700] text-[16px] sm:text-[18px] text-white">
          How do you feel about the token?
        </h2>
        <div className="flex flex-wrap gap-3 my-5 ms:my-0">
          <button
            onClick={() => handleVote(1)}
            disabled={loading}
            className="bg-[#2EBD85] inter-fonts font-[700] text-white px-4 py-2 rounded-md flex items-center gap-3 text-[14px]"
          >
            Good
            <i className="fas fa-thumbs-up"></i>
          </button>
          <button
            onClick={() => handleVote(-1)}
            disabled={loading}
            className="bg-[#F6465D] inter-fonts font-[700] text-white px-4 py-2 rounded-lg flex items-center gap-3 text-[14px]"
          >
            Bad
            <i className="fas fa-thumbs-down"></i>
          </button>
          <button className="bg-[#FFB92D] inter-fonts font-[700] text-black px-4 py-2 rounded-lg flex items-center gap-3 text-[14px]">
            Share
            <i className="fas fa-share"></i>
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <span className="sofia-fonts font-[700] text-md text-white mr-0 sm:mr-3 flex item-center gap-1 sm:gap-3">
          Good
          <span className="sofia-fonts font-[700] text-md text-[#2EBD85]">
            3
          </span>
          <i className="fas fa-thumbs-up mt-1"></i>
        </span>
        <div className="flex-grow bg-[#D9D9D9] h-3 rounded-lg mx-2"></div>
        <span className="sofia-fonts font-[700] text-md text-white ml-0 sm:ml-3 flex item-center gap-1 sm:gap-3">
          Bad
          <span className="sofia-fonts font-[700] text-md text-[#F6465D]">
            0
          </span>
          <i className="fas fa-thumbs-down mt-2"></i>
        </span>
      </div>
    </div>
  );
};

export default CoinVote;
