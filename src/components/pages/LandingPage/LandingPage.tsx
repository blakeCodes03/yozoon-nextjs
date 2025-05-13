// src/components/pages/LandingPage/LandingPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import FAQs from '@/components/ui/FAQs';
import BottomSignup from '@/components/ui/BottomSignup';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [baseUserCount] = useState<number>(50000); // Base count
  const [targetUserCount, setTargetUserCount] = useState<number>(50000); // Initial target

  // Animated counter for user count
  const animatedUserCount = useAnimatedCounter(baseUserCount, targetUserCount);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Fetch Coins and User Count
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinsResponse, userCountResponse] = await Promise.all([
          axios.get('/api/coins'),
          axios.get('/api/community/community-stats'),
        ]);

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
        const newUserCount = baseUserCount + userCountResponse.data.userCount;
        setTargetUserCount(newUserCount);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Fetch user count periodically
    const interval = setInterval(async () => {
      try {
        const userCountResponse = await axios.get(
          '/api/community/community-stats'
        );
        const newUserCount = baseUserCount + userCountResponse.data.userCount;
        setTargetUserCount(newUserCount);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [baseUserCount]);

  // Carousel Navigation
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === trendingCoins.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? trendingCoins.length - 1 : prev - 1
    );
  };

  // Auto-play Carousel
  useEffect(() => {
    const autoPlay = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(autoPlay);
  }, [trendingCoins.length]);

  // Features data
  const features = [
    {
      id: 1,
      icon: <FaShieldAlt className="text-accentGreen text-4xl mb-4" />,
      title: 'Secure Anti-Rug Protection',
      description:
        'Your investments are safe with our state-of-the-art anti-rug mechanisms.',
    },
    {
      id: 2,
      icon: <FaTrophy className="text-accentBlue text-4xl mb-4" />,
      title: 'Gamified Engagement',
      description: 'Earn badges, climb leaderboards, and make meme coins fun!',
    },
    {
      id: 3,
      icon: <FaLayerGroup className="text-accentBlue text-4xl mb-4" />,
      title: 'Multi-Chain Support',
      description: 'Launch your coin on Ethereum, BNB, Solana, and more!',
    },
  ];

  // Function to generate bar chart data (optional, can be customized)
  const getBarChartData = (coin: CoinData) => {
    const labels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
    const data = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 1000)
    );

    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data,
          backgroundColor: data.map((value) =>
            value >= data[data.length - 1] ? '#10A37F' : '#FF4D4D'
          ), // Green for up, red for down
        },
      ],
    };
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
      <section> 
      <KingoftheHill/>
      </section>
      {/* //next section is popular coins, quick buy */}
      <section>

      </section>

      <section>
        <TrendingSectionTable/>
      </section>
      <section>
        <FAQs/>
      </section>
      <section>
        <BottomSignup/>
      </section>







      {/* //old code */}

      {/* Hero Section */}
      {/* <section className="relative bg-bg1 p-8 rounded-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center text-center md:text-left z-10">
          Left Section: Users Trust Us
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="text-[#F0B90B] text-6xl font-bold mb-4">
              {animatedUserCount.toLocaleString()}
            </div>
            <div className="text-4xl font-bold text-textPrimary">
              USERS TRUST US
            </div>
          </div>
          Right Section: Memecoin Cards
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-textPrimary">
              Launch Your Meme Coin Securely and Creatively!
            </h1>
            <p className="body-text mb-6 text-textSecondary">
              The only platform designed for community-driven and scam-free meme
              coins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" href="/start-new-coin">
                <FaRocket className="mr-2" />
                Create Your Coin Now
              </Button>
              <Button variant="secondary" href="/coins">
                <FaBook className="mr-2" />
                View All Coins
              </Button>
            </div>
          </div>
        </div>
      </section> */}
      {/* Trending Coins Carousel */}
      {/* <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-textPrimary">
            Trending Meme Coins
          </h2>
          <div className="relative">
            Carousel Container
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {trendingCoins.map((coin) => (
                  <div key={coin.id} className="min-w-full flex-shrink-0 p-4">
                    <CoinCard
                      coin={coin}
                      onVote={(id, support) => {
                        // Implement your voting logic here
                        // For example:
                        console.log(
                          `Voted ${support ? 'Up' : 'Down'} on ${id}`
                        );
                        // You can also make an API call to record the vote
                        // axios.post(`/api/coins/${id}/vote`, { support })
                        //   .then(response => {
                        //     // Handle successful vote
                        //     toast.success('Your vote has been recorded!');
                        //   })
                        //   .catch(error => {
                        //     // Handle error
                        //     toast.error('Failed to record your vote.');
                        //   });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            Navigation Arrows
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-accentBlue transition-colors"
              aria-label="Previous Slide"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-accentBlue transition-colors"
              aria-label="Next Slide"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section> */}

      {/* Bonding Curve Coins */}
      {/* <section className="py-12 bg-bg3">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-textPrimary">
            Bonding Curve Coins
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bondingCurveCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} onVote={() => {}} /> // Assuming no voting for bonding curve coins
            ))}
          </div>
        </div>
      </section> */}

      {/* Voting Coins */}
      {/* <section className="py-12 bg-bg3">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-textPrimary">
            Voting Coins
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {votingCoins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                onVote={(id, support) => {
                  // Implement your voting logic here
                  // For example:
                  console.log(`Voted ${support ? 'Up' : 'Down'} on ${id}`);
                  // You can also make an API call to record the vote
                  // axios.post(`/api/coins/${id}/vote`, { support })
                  //   .then(response => {
                  //     // Handle successful vote
                  //     toast.success('Your vote has been recorded!');
                  //   })
                  //   .catch(error => {
                  //     // Handle error
                  //     toast.error('Failed to record your vote.');
                  //   });
                }}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Meme Ranking Section */}
      {/* <section className="py-12 bg-bg3">
        <MemeRanking />
      </section> */}

      {/* Feature Highlights as Cards */}
      {/* <section className="bg-bg3 py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-textPrimary">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center bg-bg1 p-6 rounded-lg shadow-shadow1 hover:shadow-shadow2 transition-shadow duration-300"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2 text-textPrimary">
                  {feature.title}
                </h3>
                <p className="body-text text-textSecondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Community Statistics */}
      {/* <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-textPrimary">
            Join Our Growing Community!
          </h2>
          <div className="flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FaUser className="text-accentGreen text-3xl" />
              <span className="text-xl md:text-2xl font-semibold text-textPrimary">
                {animatedUserCount.toLocaleString()} Users
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCoins className="text-accentBlue text-3xl" />
              <span className="text-xl md:text-2xl font-semibold text-textPrimary">
                1,000+ Coins Created
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaThumbsUp className="text-accentGreen text-3xl" />
              <span className="text-xl md:text-2xl font-semibold text-textPrimary">
                100+ Daily Votes
              </span>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      {/* <section className="bg-bg4 py-12 rounded-lg bg-opacity-90">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-textPrimary">
            Ready to Create Your Meme Coin?
          </h2>
          <p className="body-text mb-6 text-textSecondary">
            Join the platform that makes it easy, safe, and fun!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="secondary" href="/start-new-coin">
              <FaShieldAlt className="mr-2" />
              Get Started
            </Button>
            <Button variant="primary" href="/features">
              <FaTrophy className="mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default LandingPage;
