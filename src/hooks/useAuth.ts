// src/hooks/useAuth.ts

import { useSession, signIn, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const login = () => signIn();
  const logout = () => signOut();

  return {
    session,
    status,
    login,
    logout,
  };
};
