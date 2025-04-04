// src/components/ui/Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LeaderboardEntry {
  user: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p className="text-center body-text">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="bg-primary-dark bg-opacity-80 shadow-md rounded-lg p-6">
      <h2 className="text-h2 heading mb-4 text-primary">Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index} className="flex justify-between py-2 border-b last:border-none">
            <span>{index + 1}. {entry.user}</span>
            <span>{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
