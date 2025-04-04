// src/components/pages/CoinPage/CoinChart.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import Spinner from '../../common/Spinner'; // Import Spinner

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

interface CoinChartProps {
  coinId: string;
}

interface PriceData {
  timestamp: string;
  price: number;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId }) => {
  const [data, setData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get(`/api/coins/${coinId}/price-data`);
        setData(response.data);
      } catch (error: any) {
        console.error('Error fetching price data:', error);
        setError('Failed to load price data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [coinId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (data.length === 0) {
    return <p>No price data available.</p>;
  }

  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: 'Price',
        data: data.map((d) => d.price),
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CoinChart;
