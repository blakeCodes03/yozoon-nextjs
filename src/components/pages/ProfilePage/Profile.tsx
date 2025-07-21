// src/components/pages/ProfilePage/Profile.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BadgeComponent from '../../ui/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';
// import { toast, ToastContainer } from 'react-toastify';
import { Toaster, toast } from 'sonner'

import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../common/Spinner';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import EditProfileModal from './EditProfileModal';
import HistoryModal from './HistoryModal';
import InviteFriendModal from './InviteFriendModal';
import NavigationCard from './NavigationCard';
import ReferralCard from './ReferralCard';
import Icon from '../../common/Icon';

interface Coin {
  id: string;
  name: string;
  ticker: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
}

interface Reputation {
  score: number;
}

interface VoteHistory {
  proposalId: string;
  support: boolean;
  createdAt: string;
}

interface Referral {
  id: string;
  username: string;
}

interface UserProfile {
  user: {
    id: string;
    username: string;
    email: string;
    pictureUrl?: string;
    inviteLink: string; // Ensure this field exists in your API response
  };
  badges: Badge[];
  reputation: Reputation;
  ownedCoins: Coin[];
  // voteHistory: VoteHistory[];
  referrals: Referral[];
}

interface ProfilePageProps {
  userId: string;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // const response = await axios.get(`/api/users/${userId}`);
  // const data = response.data;

  // Example mock data for the "data" variable in Profile.tsx

const data = {
  user: {
    id: 'user123',
    username: 'yozoonuser',
    email: 'yozoonuser@example.com',
    pictureUrl: '/assets/avatar/default-avatar.png',
    referralCode: 'REF12345',
    inviteLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/signup?ref=REF12345`,
  },
  badges: [
    {
      id: 'badge1',
      name: 'Early Adopter',
      description: 'Joined Yozoon in the first month!',
    },
    {
      id: 'badge2',
      name: 'Voter',
      description: 'Voted on 10+ proposals.',
    },
  ],
  reputation: {
    score: 4200,
  },
  ownedCoins: [
    {
      id: 'coin1',
      name: 'Solana',
      ticker: 'SOL',
    },
    {
      id: 'coin2',
      name: 'Yozoon',
      ticker: 'YOZ',
    },
  ],
  voteHistory: [
    {
      proposalId: 'prop1',
      support: true,
      createdAt: '2024-06-01T12:00:00Z',
    },
    {
      proposalId: 'prop2',
      support: false,
      createdAt: '2024-06-15T15:30:00Z',
    },
  ],
  referrals: [
    {
      id: 'ref1',
      username: 'friend1',
    },
    {
      id: 'ref2',
      username: 'friend2',
    },
  ],
};

  // Ensure referralCode is included in the invite link
  if (data.user.referralCode) {
    data.user.inviteLink = `${window.location.origin}/signup?ref=${data.user.referralCode}`;
  } else {
    console.warn('Referral code missing for user:', userId);
    data.user.inviteLink = `${window.location.origin}/signup`; // Fallback
  }

  return data;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('History');
  const queryClient = useQueryClient();

  const { data: profile, error, isLoading } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (profile && !profile.user.username) {
      setIsEditModalOpen(true);
    }
  }, [profile]);

  const handleUsernameUpdate = async (newUsername: string, newPictureUrl?: string) => {
    try {
      const formData = new FormData();
      formData.append('username', newUsername);
      if (newPictureUrl) {
        const response = await fetch(newPictureUrl);
        const blob = await response.blob();
        formData.append('picture', new Blob([blob]));
      }
  
      const response = await fetch(`/api/users/update-profile`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        toast('Profile updated');
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        setIsEditModalOpen(false);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating your profile.');
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error loading profile: {error.message}</p>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center text-body">No profile found.</div>;
  }

  return (
    <div className="dashboard p-4">
      {/* <ToastContainer /> */}
      <Toaster richColors position='top-right'  />

      {/* User Profile Section */}
      <div className="profile-section mb-6 text-center">
        <div className="relative inline-block">
          <Image
            src={profile.user.pictureUrl?.startsWith('http') ? profile.user.pictureUrl : '/assets/avatar/default-avatar.png'}
            alt={`${profile.user.username || 'User'} Avatar`}
            width={100}
            height={100}
            className="rounded-full border-4 border-[#FFB92D]"
            onError={(e) => (e.currentTarget.src = '/assets/avatar/default-avatar.png')} // Fallback to local image
          />

          {/* Pencil Icon for Avatar */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute bottom-0 right-0 bg-[#FFB92D] text-white rounded-full p-1 hover:bg-[#c28407] transition-colors"
          >
            <Icon name="pencil" size={16} />
          </button>
        </div>
        <div className="mt-4 flex justify-center items-center">
          <h1 className="username text-2xl font-bold">{profile.user.username || 'Not Set'}</h1>
          {/* Pencil Icon for Username */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="ml-2 bg-[#FFB92D] text-white rounded-full p-1 hover:bg-[#c28407] transition-colors"
          >
            <Icon name="pencil" size={16} />
          </button>
        </div>
        {/* Balance Removed */}
        <p className="reputation text-lg mt-2">
          Reputation Score:{' '}
          <span className="relative inline-block">
            {profile.reputation.score.toLocaleString()}
            {/* Spinning Coins Animation */}
            <div className="absolute -top-2 -right-6 animate-spin">
              <Image src="/assets/icons/coin.png" alt="Spinning Coins" width={24} height={24} />
            </div>
          </span>
        </p>
        <div className="badges flex justify-center mt-2 space-x-2">
          {profile.badges.length > 0 ? (
            profile.badges.map((badge) => <BadgeComponent key={badge.id} badge={badge} />)
          ) : (
            <span>No Badges</span>
          )}
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <NavigationCard
          title="Agents"
          icon="agents"
          onClick={() => {
            setActiveTab('Agents');
            setIsHistoryModalOpen(true);
          }}
        />
        {/* <NavigationCard
          title="Settings"
          icon="settings"
          onClick={() => {
            setActiveTab('Settings');
            setIsHistoryModalOpen(true); // Replace with appropriate modal
          }}
        /> */}
        {/* <NavigationCard
          title="Favorites"
          icon="star"
          onClick={() => {
            setActiveTab('Favorites');
            setIsHistoryModalOpen(true); // Replace with appropriate modal
          }}
        />
        <NavigationCard
          title="Reputation History"
          icon="reputation"
          onClick={() => {
            setActiveTab('ReputationHistory');
            setIsHistoryModalOpen(true); // Replace with appropriate modal
          }}
        /> */}
      </div>

      <ReferralCard
        inviteLink={profile.user.inviteLink}
        onInviteClick={() => setIsInviteModalOpen(true)}
      />
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUsername={profile.user.username || ''}
          currentPictureUrl={profile.user.pictureUrl || ''}
          onSave={handleUsernameUpdate}
        />
      )}

      {/* History Modal */}
      {isHistoryModalOpen && (
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          activeTab={activeTab}
          // voteHistory={profile.voteHistory}
        />
      )}

      {/* Invite Friend Modal */}
      {isInviteModalOpen && (
        <InviteFriendModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          inviteLink={profile.user.inviteLink}
        />
      )}
    </div>
  );
};

export default ProfilePage;
