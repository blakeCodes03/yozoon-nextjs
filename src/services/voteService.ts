// src/services/voteService.ts

import axios from 'axios';

export const castVote = async (coinId: string, value: number) => {
  const response = await axios.post('/api/votes', { coinId, value });
  return response.data;
};

export const getVoteById = async (id: string) => {
  const response = await axios.get(`/api/votes/${id}`);
  return response.data;
};
