// src/pages/profile.tsx

import React from 'react';
import { useSession } from 'next-auth/react';
import ProfilePage from '../components/pages/ProfilePage/Profile';
import { useRouter } from 'next/router';
import Spinner from '../components/common/Spinner';

const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    router.push('/login'); // Redirect to login if not authenticated
    return null;
  }

  return <ProfilePage userId={session.user.id} />;
};

export default Profile;
