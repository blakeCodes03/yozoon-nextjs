// src/components/ui/CoinCard.tsx

import React from 'react';
import Image from 'next/image';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from './Card'; // Import the common Card component

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Coin {
  id: string;
  name: string;
  ticker: string;
  description: string;
  votes: number;
  pictureUrl: string;
  status: string; // "voting" or "bondingCurve"
}

interface CoinCardProps {
  coin: Coin;
  onVote: (id: string, support: boolean) => void;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onVote }) => {
  // Function to generate bar chart data
  const getBarChartData = () => {
    const labels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
    const data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000));

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

  return (
    <Card>
      {/* Navigational Link for Image and Name */}
      <Link href={`/coin/${coin.id}`} className="block">
        {/* Coin Image */}
        <div>
          <Image
            src={coin.pictureUrl}
            alt={`${coin.name} Icon`}
            width={300}
            height={200}
            className="token-image"
          />
        </div>
        {/* Coin Details */}
        <div className="token-details">
          <h3 className="token-name">
            {coin.name} ({coin.ticker})
          </h3>
          <p className="token-description">{coin.description}</p>
        </div>
      </Link>
      {/* Bar Chart */}
      <div className="mt-4">
        <Bar
          data={getBarChartData()}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#B7BDC6',
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#B7BDC6',
                },
              },
            },
          }}
        />
      </div>
      {/* Voting Information */}
      <div className="token-info">
        <span className="token-price">Votes: {coin.votes}</span>
        <span className="token-status">
          Status: {coin.status === 'voting' ? 'Voting' : 'Bonding Curve'}
        </span>
      </div>
      {/* Voting Buttons */}
      {coin.status === 'voting' && (
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className="upvote-button"
            onClick={() => onVote(coin.id, true)}
            aria-label={`Upvote ${coin.name}`}
          >
            <FaArrowUp className="inline mr-2" />
            Upvote
          </button>
          <button
            className="downvote-button"
            onClick={() => onVote(coin.id, false)}
            aria-label={`Downvote ${coin.name}`}
          >
            <FaArrowDown className="inline mr-2" />
            Downvote
          </button>
        </div>
      )}
    </Card>
  );
};

export default CoinCard;
