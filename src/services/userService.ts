// src/services/userService.ts

import axios from 'axios';

export const getUserProfile = async (id: string) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};

export const updateUserProfile = async (id: string, profileData: any) => {
  const response = await axios.put(`/api/users/${id}`, profileData);
  return response.data;
};
