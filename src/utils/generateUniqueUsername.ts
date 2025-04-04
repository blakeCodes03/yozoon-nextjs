// src/utils/generateUniqueUsername.ts

import prisma from '../lib/prisma';
import { nanoid } from 'nanoid';

/**
 * Generates a unique username prefixed with 'mlp'.
 * Example: 'mlpA1b2C3'
 */
export const generateUniqueUsername = async (): Promise<string> => {
  let username: string = '';
  let isUnique = false;

  while (!isUnique) {
    const uniqueId = nanoid(6); // Generates a 6-character unique ID
    username = `mlp${uniqueId}`;
    
    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return username;
};
