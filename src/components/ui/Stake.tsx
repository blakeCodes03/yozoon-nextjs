// src/components/ui/Stake.tsx

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';

interface StakeProps {
  coinId: string;
}

const Stake: React.FC<StakeProps> = ({ coinId }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleStake = async () => {
    if (amount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/stakes', { coinId, amount });
      setMessage('Staking successful!');
      setAmount(0);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error staking tokens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-dark bg-opacity-80 shadow-md rounded-lg p-4">
      <h3 className="text-h3 heading mb-2 text-primary">Stake Tokens</h3>
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
        placeholder="Amount to stake"
        className="input mb-4"
      />
      {message && <p className="text-sm text-green-500 mb-2">{message}</p>}
      <Button variant="primary" onClick={handleStake} disabled={loading}>
        {loading ? 'Staking...' : 'Stake'}
      </Button>
    </div>
  );
};

export default Stake;
