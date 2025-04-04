// src/components/pages/MemeRanking/MemeRanking.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  creativity: number;
  quality: number;
  hype: number;
  user: {
    username: string;
  };
}

const MemeRanking: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await axios.get('/api/memes');
        setMemes(response.data);
      } catch (error) {
        setError('Failed to load memes.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  if (loading) return <p className="text-center">Loading memes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-textPrimary text-center">Top Memes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <div key={meme.id} className="bg-bg6 rounded-lg shadow p-4">
            <Image src={meme.imageUrl} alt={meme.title} width={300} height={200} className="object-cover rounded" />
            <h2 className="text-xl font-semibold mt-4">{meme.title}</h2>
            <p className="text-textSecondary">By: {meme.user.username}</p>
            <div className="flex justify-between mt-2">
              <span>Creativity: {meme.creativity}</span>
              <span>Quality: {meme.quality}</span>
              <span>Hype: {meme.hype}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeRanking;
