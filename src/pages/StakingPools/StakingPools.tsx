// src/components/pages/StakingPools/StakingPools.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/common/Button';

interface MiningPool {
  id: string;
  coinId: string;
  poolName: string;
  stakeAmount: string;
  createdAt: string;
  user: {
    username: string;
  };
}

const MiningPools: React.FC = () => {
  const [miningPools, setMiningPools] = useState<MiningPool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<{ coinId: string; poolName: string; stakeAmount: number }>({
    coinId: '',
    poolName: '',
    stakeAmount: 0,
  });

  useEffect(() => {
    const fetchMiningPools = async () => {
      try {
        const response = await axios.get('/api/mining-pools');
        setMiningPools(response.data);
      } catch (error) {
        setError('Failed to load mining pools.');
      } finally {
        setLoading(false);
      }
    };

    fetchMiningPools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/mining-pools', formData);
      setMiningPools([...miningPools, response.data]);
      setFormData({ coinId: '', poolName: '', stakeAmount: 0 });
    } catch (error) {
      setError('Error creating mining pool.');
    }
  };

  if (loading) return <p className="text-center">Loading mining pools...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-textPrimary text-center">Memecoin Mining Pools</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-bg6 text-textPrimary rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Create a New Mining Pool</h2>
        <div className="mb-4">
          <label htmlFor="coinId" className="block text-textPrimary font-bold mb-2">
            Coin ID
          </label>
          <input
            type="text"
            name="coinId"
            id="coinId"
            value={formData.coinId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-accentBlue"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="poolName" className="block text-textPrimary font-bold mb-2">
            Pool Name
          </label>
          <input
            type="text"
            name="poolName"
            id="poolName"
            value={formData.poolName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-accentBlue"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stakeAmount" className="block text-textPrimary font-bold mb-2">
            Stake Amount
          </label>
          <input
            type="number"
            name="stakeAmount"
            id="stakeAmount"
            value={formData.stakeAmount}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-accentBlue"
          />
        </div>
        <Button type="submit" variant="primary">
          Create Mining Pool
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-textPrimary">Available Mining Pools</h2>
        {miningPools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {miningPools.map((pool) => (
              <div key={pool.id} className="bg-bg6 rounded-lg shadow p-4">
                <h3 className="text-xl font-semibold">{pool.poolName}</h3>
                <p className="text-textSecondary">Coin ID: {pool.coinId}</p>
                <p className="text-textSecondary">Stake Amount: {pool.stakeAmount}</p>
                <p className="text-textSecondary">Created By: {pool.user.username}</p>
                <p className="text-textSecondary">Created At: {new Date(pool.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-textSecondary">No mining pools available.</p>
        )}
      </div>
    </div>
  );
};

export default MiningPools;
