// src/components/common/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      toast.error('You must be logged in to access this page.');
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button type="button" className="bg-indigo-500 text-white font-bold py-2 px-4 rounded flex items-center" disabled>
          <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Loading...
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
