// src/components/pages/LandingPage/LandingPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
// import { useSession, getSession } from 'next-auth/react';
import { useSession, signIn, signOut } from 'next-auth/react';

import {
  FaShieldAlt,
  FaTrophy,
  FaLayerGroup,
  FaUser,
  FaCoins,
  FaThumbsUp,
  FaRocket,
  FaBook,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import Button from '../../common/Button';
import useAnimatedCounter from '../../../hooks/useAnimatedCounter';
import MemeRanking from '../MemeRanking/MemeRanking';
import { toast } from 'react-toastify';
import Spinner from '../../common/Spinner'; // Ensure correct import
import CoinCard from '../../ui/CoinCard'; // Ensure correct import
import { CarouselWithBigArrows } from '../../ui/HeroCarousel';
import { mockCoins } from '@/components/ui/mockData'; //mock data
import KingoftheHill from '../../ui/KingOfTheHill';
import TrendingSectionTable from '../../ui/TrendingSectionTable';

// Register Chart.js components

import FAQs from '@/components/ui/FAQs';
import BottomSignup from '@/components/ui/BottomSignup';
import SmallerLoaderSpin from '@/components/common/SmallerLoaderSpin';



interface CoinData {
  id: string;
  name: string;
  ticker: string;
  description: string;
  pictureUrl: string;
  votes: number;
  status: string; // "voting" or "bondingCurve"
}

const LandingPage: React.FC = () => {
  const [votingCoins, setVotingCoins] = useState<CoinData[]>([]);
  const [bondingCurveCoins, setBondingCurveCoins] = useState<CoinData[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [showConfirmEmailModal, setConfirmEmailModal] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Fetch Coins and User Count
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [coinsResponse] = await Promise.all([
          // const [coinsResponse, userCountResponse] = await Promise.all([
          // axios.get('/api/coins'),
          // axios.get('/api/community/community-stats'),
        // ]);

        // const allCoins: CoinData[] = coinsResponse.data;
        const allCoins: CoinData[] = mockCoins; //mock data

        // Categorize coins
        const voting = allCoins.filter((coin) => coin.status === 'voting');
        const bonding = allCoins.filter(
          (coin) => coin.status === 'bondingCurve'
        );

        setVotingCoins(voting);
        setBondingCurveCoins(bonding);

        // Set Trending Coins (Top 5 based on votes)
        const trending = allCoins.sort((a, b) => b.votes - a.votes).slice(0, 5);
        setTrendingCoins(trending);

        // Update user count
        // const newUserCount = baseUserCount + userCountResponse.data.userCount;
        // setTargetUserCount(newUserCount);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Fetch user count periodically
    // const interval = setInterval(async () => {
    //   try {
    //     const userCountResponse = await axios.get(
    //       '/api/community/community-stats'
    //     );
    //     const newUserCount = baseUserCount + userCountResponse.data.userCount;
    //     setTargetUserCount(newUserCount);
    //   } catch (error) {
    //     console.error('Error fetching user count:', error);
    //   }
    // }, 10000); // Update every 10 seconds

    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkSessionAndEmail = async () => {
      if (!session) return; // Wait until session is ready

      console.log('session:', session?.user.id);

      try {
        // Check if email confirmation is required
        const response = await fetch('/api/users/confirmEmail', {
          method: 'GET',
        });

        if (response.status === 400) {
          setConfirmEmailModal(true); // Show modal for email confirmation
        }
      } catch (error) {
        console.error('Error checking email confirmation:', error);
      }
    };

    checkSessionAndEmail();
  }, [session]); 


  const handleConfirmEmail = async () => {
    if (!email || !session) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/confirmEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'An error occurred.');
      } else {
        setConfirmEmailModal(false);
      }
    } catch (err) {
      setError('Failed to confirm email. Please try again.');
      console.log('Error confirming email:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <section>
        <CarouselWithBigArrows />
      </section>
      {/* <section>
        <KingoftheHill />
      </section> */}
      {/* //next section is popular coins, quick buy */}     

      <section>
        <TrendingSectionTable />
      </section>
      <section>
        <FAQs />
      </section>
      <section>
        <BottomSignup />
      </section>

      <AlertDialog open={showConfirmEmailModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Please confirm your email to continue
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error && (
                <p className=" text-red-500 mb-2 text-sm flex items-center justify-center">
                  {error}
                </p>
              )}
              <input
                className=" dark:bg-[#181A20] bg-bglight robboto-fonts placeholder:text-sm dark:placeholder:text-[#A6A6A6] placeholder:text-gray-700 dark:text-white text-black text-sm  inter-fonts relative w-full h-11 rounded-lg pl-9 pr-34 focus:outline-none "
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={checkingEmail}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleConfirmEmail}
              disabled={checkingEmail || !email}
            >
              Continue {checkingEmail && <SmallerLoaderSpin />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LandingPage;
