// src/utils/auth.ts

import { signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';

export const signIn = (credentials: { email: string; password: string }) => {
  return nextSignIn('credentials', {
    redirect: false,
    email: credentials.email,
    password: credentials.password,
  });
};

export const signOut = () => {
  return nextSignOut({ redirect: false });
};
