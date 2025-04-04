// src/services/coinService.ts

import api from '../utils/api';

export const getAllCoins = async () => {
  const response = await api.get('/api/coins');
  return response.data;
};

export const getCoinById = async (id: string) => {
  const response = await api.get(`/api/coins/${id}`);
  return response.data;
};

export const createCoin = async (coinData: any) => {
  const response = await api.post('/api/coins', coinData);
  return response.data;
};

export const updateCoin = async (id: string, coinData: any) => {
  const response = await api.put(`/api/coins/${id}`, coinData);
  return response.data;
};

export const deleteCoin = async (id: string) => {
  const response = await api.delete(`/api/coins/${id}`);
  return response.data;
};
