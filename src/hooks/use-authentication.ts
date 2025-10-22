import { useMemo } from 'react';

// Lightweight shim for authentication hook used across legacy UI.
// Returns a minimal API: isAuthenticated and fetchWithAuth.
export default function useAuthentication() {
  // For now assume the user is authenticated when a session exists elsewhere.
  const isAuthenticated = useMemo(() => false, []);
  return { isAuthenticated };
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  // Simple wrapper around fetch that forwards through. In the full app this
  // would add auth headers; here we just call fetch to satisfy callers.
  return fetch(input, init);
}
