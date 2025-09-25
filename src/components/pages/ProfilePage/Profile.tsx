// src/components/pages/ProfilePage/Profile.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings } from 'lucide-react';
import BadgeComponent from '../../ui/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import { Toaster, toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import Spinner from '../../common/Spinner';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import EditProfileModal from './EditProfileModal';
import HistoryModal from './HistoryModal';
import InviteFriendModal from './InviteFriendModal';
import NavigationCard from './NavigationCard';
import ReferralCard from './ReferralCard';
import Icon from '../../common/Icon';
import { formatDistanceToNow } from 'date-fns';


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

// Mock data for transactions
const mockTransactions = [
  {
    holder: '9LmaU...0Kp',
    owned: '94%',
    solBalance: '15.74',
    sourceTFTime: '0x1234...5678',
    inflowAmount: '+753.64',
    holdingDuration: '21h',
    avgCostSold: '$0.0,18615/$',
    buySell: '0/1',
    bondingCurve: true,
  },
  {
    holder: 'Raydium Authority...',
    owned: '94%',
    solBalance: '15.74',
    sourceTFTime: '0x1234...5678',
    inflowAmount: '+753.64',
    holdingDuration: '21h',
    avgCostSold: '$0.0,18615/$',
    buySell: '0/1',
    bondingCurve: false,
  },
  {
    holder: '9LmaU...0Kp',
    owned: '94%',
    solBalance: '15.74',
    sourceTFTime: '0x1234...5678',
    inflowAmount: '+753.64',
    holdingDuration: '21h',
    avgCostSold: '$0.0,18615/$',
    buySell: '0/1',
    bondingCurve: true,
  },
];

// Mock data for created tokens
const mockCreatedTokens = [
  {
    id: 'agent-1',
    name: 'Yozoon Token',
    ticker: 'YOZ',
    totalSupply: '1,000,000',
    marketCap: '$500,000',
    createdAt: '2025-08-01',
    telegramLink: 'https://t.me/YozoonBot?start=agent-1',
    discordLink:
      'https://discord.com/oauth2/authorize?client_id=123&scope=bot&permissions=8',
  },
  {
    id: 'agent-2',
    name: 'Solana Token',
    ticker: 'SOL',
    totalSupply: '10,000,000',
    marketCap: '$1,000,000',
    createdAt: '2025-07-15',
    telegramLink: 'https://t.me/YozoonBot?start=agent-1',
    discordLink:
      'https://discord.com/oauth2/authorize?client_id=123&scope=bot&permissions=8',
  },
  {
    id: 'agent-3',
    name: 'Test Token',
    ticker: 'TST',
    totalSupply: '500,000',
    marketCap: '$250,000',
    createdAt: '2025-06-20',
    telegramLink: 'https://t.me/YozoonBot?start=agent-1',
    discordLink:
      'https://discord.com/oauth2/authorize?client_id=123&scope=bot&permissions=8',
  },
];

// Fetch transactions for the user
const fetchUserTransactions = async (userId: string) => {
  const response = await axios.get(`/api/users/${userId}/transactions`);
  return response.data; 
};

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axios.get(`/api/users/${userId}`);
  const data = response.data;

  // Example mock data for the "data" variable in Profile.tsx

  const dataa = {
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();


  // Fetch user profile data
  const {
    data: profile,
    error,
    isLoading,
  } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  // Fetch user transactions
  const {
    data: transactions,
    error: transactionsError,
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ['userTransactions', userId],
    queryFn: () => fetchUserTransactions(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (profile && !profile.user.username) {
      setIsEditModalOpen(true);
    }
  }, [profile]);

  const handleUsernameUpdate = async (
    newUsername: string,
    newPictureUrl?: string
  ) => {
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
  const handleViewDetails = () => {
    setDialogOpen(true);
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
      <Toaster richColors position="top-right" />

      {/* User Profile Section */}
      <div className="profile-section mb-6 text-center">
        <div className="relative inline-block">
          <Image
            src={
              profile.user.pictureUrl?.startsWith('http')
                ? profile.user.pictureUrl
                : '/assets/avatar/default-avatar.png'
            }
            alt={`${profile.user.username || 'User'} Avatar`}
            width={100}
            height={100}
            className="rounded-full border-4 border-[#FFB92D]"
            onError={(e) =>
              (e.currentTarget.src = '/assets/avatar/default-avatar.png')
            } // Fallback to local image
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
          <h1 className="username text-2xl font-bold">
            {profile.user.username || 'Not Set'}
          </h1>
          {/* Pencil Icon for Username */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="ml-2 bg-[#FFB92D] text-white rounded-full p-1 hover:bg-[#c28407] transition-colors"
          >
            <Icon name="pencil" size={16} />
          </button>
        </div>
        {/* Balance Removed */}
        <div className="reputation text-lg mt-2">
          Reputation Score:{' '}
          <span className="relative inline-block">
            {profile.reputation.score.toLocaleString()}
            {/* Spinning Coins Animation */}
            <div className="absolute -top-2 -right-6 animate-spin">
              <Image
                src="/assets/icons/coin.png"
                alt="Spinning Coins"
                width={24}
                height={24}
              />
            </div>
          </span>
        </div>
        <div className="badges flex justify-center mt-2 space-x-2">
          {profile.badges?.length > 0 ? (
            profile.badges.map((badge) => (
              <BadgeComponent key={badge.id} badge={badge} />
            ))
          ) : (
            <span>No Badges</span>
          )}
        </div>
      </div>

      {/* Navigation Cards */}

      <Tabs defaultValue="Activity" className="w-full ">
        <TabsList className="grid w-full grid-cols-2 h-16  mb-4 bg-[#1E1F23] rounded-[10px] border-[2px] border-[#37393E] shadow-lg">
          <TabsTrigger className="h-12 text-xl font-bold" value="Activity">
            Activity
          </TabsTrigger>
          <TabsTrigger className="h-12 text-xl font-bold" value="Wallet">
            Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Wallet">
          <div className="border-[2px] border-[#37393E] shadow-lg rounded-[10px] p-2 relative mb-2">
            <div className="flex items-center justify-between"></div>
          </div>
        </TabsContent>
        <TabsContent value="Activity">
          <div className="border-[2px] border-[#37393E] shadow-lg rounded-[10px] p-2 relative mb-2">
            <div className="flex items-center justify-between">
              <Tabs defaultValue="Transactions" className="w-full ">
                <TabsList className="grid w-1/2 grid-cols-2 h-8  mb-4 bg-[#1E1F23] rounded-[10px] border-[2px] border-[#37393E] shadow-lg">
                  <TabsTrigger
                    className="h-6 text-sm font-bold"
                    value="Transactions"
                  >
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger
                    className="h-6 text-sm font-bold"
                    value="Created Tokens"
                  >
                    Created Tokens
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="Transactions">
                  <div className="overflow-x-auto">
                    {transactionsLoading && (
                      <div className="flex justify-center items-center h-screen">
                        <Spinner />
                      </div>
                    )}
                    {transactionsError && (
                      <div className="text-center text-red-500 uppercase font-bold">
                        <p>
                          Error loading transactions
                        </p>
                      </div>
                    )}

                    {/* {transactions && transactions.length > 0 ? ( */}
                    {mockTransactions.length > 0 ? (
                      <table className="min-w-full bg-gray-800 whitespace-nowrap crollbar-hide">
                        <thead>
                          <tr className="bg-[#000000] text-white">
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Holder
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Owned
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              SOL\Bal
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Source TF Time
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Inflow Amount
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Holding Duration
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Avg Cost Sold
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Buy\Sell
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockTransactions.map((transaction, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                              }
                            >
                              <td className="py-4 px-3 sm:px-7 block">
                                {transaction.holder}
                                {transaction.bondingCurve && (
                                  <span className="robboto-fonts font-[400] text-[12px] block text-white">
                                    🏦 (bonding curve)
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {transaction.owned}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {transaction.solBalance}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {transaction.sourceTFTime}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {transaction.inflowAmount}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {transaction.holdingDuration}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {transaction.avgCostSold}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {transaction.buySell}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center text-orange-500 font-bold text-lg uppercase">
                        No transactions found
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="Created Tokens">
                  <div className="overflow-x-auto">
                    {mockCreatedTokens.length > 0 ? (
                      <table className="min-w-full bg-gray-800 whitespace-nowrap crollbar-hide">
                        <thead>
                          <tr className="bg-[#000000] text-white">
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Name
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Ticker
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Total Supply
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Market Cap
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left">
                              Created At
                            </th>
                            <th className="py-4 px-3 sm:px-7 sofia-fonts font-[600] text-[14px] text-white text-left"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockCreatedTokens.map((token, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                              }
                            >
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {token.name}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {token.ticker}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {token.totalSupply}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {token.marketCap}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                {formatDistanceToNow(new Date(token.createdAt), { addSuffix: true })}
                              </td>
                              <td className="py-4 px-3 sm:px-7 robboto-fonts font-[400] text-[14px] text-white">
                                <Settings
                                  onClick={() => handleViewDetails()}
                                  size={15}
                                />
                                {/* Dialog for agent details */}
                                <Dialog
                                  open={dialogOpen}
                                  onOpenChange={setDialogOpen}
                                >
                                  <DialogContent className="max-w-[425px] lg:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2 p-2">
                                        {token?.name || 'Agent Details'}
                                      </DialogTitle>
                                      <DialogDescription className="mt-2 font-semibold ">
                                        Setup your agent in Telegram or Discord
                                        to start using it.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center mb-4 ">
                                      <div className="h-full flex items-center gap-1 justify-center font-semibold">
                                        <span className="font-semibold">
                                          Agent ID:{' '}
                                        </span>
                                        <code className="bg-gray-700 py-1 px-2 truncate rounded rounded-r-none max-w-[200px] md:max-w-full max-h-full ">
                                          {index}
                                        </code>
                                      </div>
                                    </div>
                                    <div className="mb-2">
                                      <p className="mb-4 text-muted-foreground text-sm font-semibold">
                                        Add @YozoonBot to your Telegram or
                                        Discord group to receive updates.
                                      </p>
                                      <h4 className="font-semibold">
                                        Telegram
                                      </h4>
                                      <p className="mb-2 text-muted-foreground text-sm font-semibold">
                                        Click the link below to add @YozoonBot
                                        to your group. It will automatically
                                        link to your agent.
                                      </p>
                                      <a
                                        href={token?.telegramLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="no-underline"
                                      >
                                        <button className="cursor-pointer px-2 py-1 text-sm font-semibold bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]">
                                          Add to Telegram
                                        </button>
                                      </a>
                                      <p className="text-sm my-2">
                                        Alternatively, add @YozoonBot manually
                                        and run: <br />
                                        <code className="bg-gray-600 p-1 mt-1 rounded max-w-full">
                                          /setup {token?.id}
                                        </code>
                                      </p>
                                    </div>
                                    <div className="mb-4">
                                      <h4 className="font-semibold">Discord</h4>
                                      <p className="mb-2 text-muted-foreground text-sm font-semibold">
                                        Click the link below to add @YozoonBot
                                        to your server, then run the setup
                                        command in a channel.
                                      </p>
                                      <a
                                        href={token?.discordLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="no-underline"
                                      >
                                        <button className="cursor-pointer px-2 py-1 text-sm font-semibold bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]">
                                          Add to Discord
                                        </button>
                                      </a>
                                      <p className="text-sm mt-2">
                                        After adding, run: <br />
                                        <code className="bg-gray-600 p-1 rounded max-w-full">
                                          !setup {token?.id}
                                        </code>
                                      </p>
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center text-orange-500 font-bold uppercase text-lg">
                        No tokens created
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
