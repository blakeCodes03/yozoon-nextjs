import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ShieldCheck,
  ShieldAlert,
  AlertCircleIcon,
  ChevronDownIcon,
} from 'lucide-react';
import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
  useAppKitProvider,
} from '@reown/appkit/react';
import Spinner from '@/components/common/Spinner';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProgramUser } from '@/hooks/useProgram';
import { PublicKey } from '@solana/web3.js';
import { claimAirdrop } from '@/services/token-mill/services/claimAirdrop';
import type { Provider } from '@reown/appkit-adapter-solana/react';

interface ActiveTasksProps {
  coinId: string;
  coinTicker: string;
  contractAddress: PublicKey;
}

const mocktelegramTasks = [
  {
    id: '2',
    taskType: 'telegram-join',
    twitterHandle: null,
    telegramGroupId: 'exampleTelegram',
    rewardQuantity: 15,
    instruction: 'Join our Telegram group to stay updated.',
    rewardClaimEndDate: '2025-12-31T23:59:59.000Z',
    redirectLink: 'https://t.me/exampleTelegram',
  },
];
const mocktwitterTasks = [
  {
    id: '1',
    taskType: 'twitter-follow',
    twitterHandle: 'exampleTwitter',
    telegramGroupId: null,
    rewardQuantity: 10,
    instruction: 'Follow us on Twitter and mention @yozoonxyz in a tweet.',
    rewardClaimEndDate: '2025-12-31T23:59:59.000Z',
    redirectLink: 'https://twitter.com/exampleTwitter',
  },
];

const ActiveTasks: React.FC<ActiveTasksProps> = ({
  coinId,
  coinTicker,
  contractAddress,
}) => {
  const [twitterTasks, setTwitterTasks] = useState<any[]>([]);
  const [telegramTasks, setTelegramTasks] = useState<any[]>([]);
  const [twitterDialogOpen, setTwitterDialogOpen] = useState(false);
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [claimError, setClaimError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [taskLoading, setTaskLoading] = useState<boolean>(false);
  const [twitterInput, setTwitterInput] = useState<string>('');
  const [telegramInput, setTelegramInput] = useState<string>('');
  const [twitterCheckbox, setTwitterCheckbox] = useState<boolean>(false);
  const [telegramCheckbox, setTelegramCheckbox] = useState<boolean>(false);

  const { address, isConnected } = useAppKitAccount();
  const { publicKey, wallet, connected } = useWallet();
  const { walletProvider } = useAppKitProvider<Provider>('solana');

  const program = useProgramUser(walletProvider, isConnected);

  const handleClaim = async (
    taskId: string,
    taskType: string,
    userHandle: string
  ) => {
    setClaimError('');
    if (!program)
      return setError('Program not available, connect wallet first.');
    if (!isConnected) return setError('Connect your wallet.');

    setLoading(true);
    try {
      const response = await axios.post(`/api/coins/${taskId}/claim-rewards`, {
        taskType,
        userHandle,
        walletAddress: address,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      const { contractAddress } = response.data;
      if (!address) throw new Error('Wallet address is required');
      const sig = await claimAirdrop(program, new PublicKey(address), {
        tokenMint: contractAddress,
      });
      if (!sig) {
        throw new Error('Airdrop claim failed');
      }
      setSuccess(true);

      toast(`Reward claimed successfully!`);
    } catch (err: any) {
      console.error(err);
      setClaimError(err?.response?.data?.message || 'Claim failed');
    } finally {
      setLoading(false);
    }
  };

  //!!uncomment in prod
  useEffect(() => {
    const fetchActiveTasks = async () => {
      try {
        const response = await axios.get(`/api/coins/${coinId}/tasks`);
        const tasks = response.data;

        // Separate tasks by type
        const twitter = tasks.filter(
          (task: any) => task.taskType === 'twitter-follow'
        );
        const telegram = tasks.filter(
          (task: any) => task.taskType === 'telegram-join'
        );

        setTwitterTasks(twitter);
        setTelegramTasks(telegram);
      } catch (err) {
        setError('Failed to fetch active tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTasks();
  }, [coinId]);

  if (loading) {
    return (
      <p className="text-white flex items-center justify-center">
        <Spinner />
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* <!-- Twitter Task --> */}
        {loading ? (
          <p className="text-white flex items-center justify-center">
            Loading Tasks...
          </p>
        ) : error ? (
          <p className="text-red-500 flex items-center justify-center">
            {error}
          </p>
        ) : twitterTasks.length === 0 && telegramTasks.length === 0 ? (
          <p className="text-white flex items-center justify-center">
            No Active Tasks Available.
          </p>
        ) : (
          <>
            {/* Twitter Tasks */}
            {twitterTasks.map((task, idx) => (
              // {/* {mocktwitterTasks.map((task, idx) => ( */}
              <div
                key={task.id || idx}
                className="bg-[#181A20] border-1 border-[#4B4B4B] p-4 rounded-[10px] block sm:flex items-center justify-between"
              >
                <div className="flex items-center mb-4 md:mb-0 justify-center">
                  <div className="bg-[#282828] p-3 rounded-full flex items-center justify-center">
                    <img
                      className="w-6 h-6"
                      src="/assets/images/social-icons/twitter.svg"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-[14px] sm:text-[22px] text-white sofia-fonts font-[600]">
                      Follow us on Twitter to Earn
                    </h2>
                    <p className="text-[12px] sm:text-[14px] text-white inter-fonts font-[400]">
                      Connect with our community
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <button
                    className="bg-[#FFB92D] cursor-pointer text-black text-[14px] font-[700] py-2 px-4 rounded-[9px]"
                    onClick={() => setTwitterDialogOpen(true)}
                  >
                    Follow Now
                  </button>
                  <p className="text-[12px] sofia-fonts font-[400] text-white text-center mt-2">
                    {task.rewardQuantity + ` ` + coinTicker}
                  </p>
                </div>
                {/* Dialog for Twitter Task */}
                <Dialog
                  open={twitterDialogOpen}
                  onOpenChange={(isOpen) => setTwitterDialogOpen(isOpen)}
                >
                  <DialogContent className="max-w-[425px] lg:max-w-[600px] overflow-y-auto max-h-[90vh]">
                    {claimError && (
                      <div>
                        <Alert variant="destructive">
                          <AlertCircleIcon className="mr-2 h-4 w-4" />
                          <AlertTitle></AlertTitle>
                          <AlertDescription>{claimError}</AlertDescription>
                        </Alert>
                      </div>
                    )}
                    <DialogHeader className="text-center flex ">
                      <DialogTitle className="text-2xl font-bold gap-2 p-2">
                        Follow us on Twitter
                      </DialogTitle>
                      <DialogDescription className="text-gray-300">
                        You are to follow{' '}
                        <a
                          href={task.redirectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-400"
                        >
                          {task.twitterHandle}
                        </a>{' '}
                        on Twitter and mention @yozoonxyz in a tweet with the
                        hashtag #{coinTicker}.
                      </DialogDescription>
                      <div>
                        <label className="flex items-center space-x-2 mt-5">
                          <input
                            type="checkbox"
                            checked={twitterCheckbox}
                            className="h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-white checked:border-white focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain cursor-pointer accent-white"
                            onChange={(e) => {
                              setTwitterCheckbox(e.target.checked);
                              setClaimError('');
                            }}
                          />
                          <span className="text-white text-sm ">
                            I have performed this task
                          </span>
                        </label>
                        {twitterCheckbox && (
                          <div className="flex items-center mt-2">
                            <span className="text-white bg-gray-700 px-3 py-1 rounded-l">
                              {' '}
                              @{' '}
                            </span>
                            <input
                              type="text"
                              placeholder="Enter your Twitter handle"
                              value={twitterInput}
                              onChange={(e) => {setTwitterInput(e.target.value); setClaimError('');}}
                              className="px-4 py-2 h-8 w-full border rounded-r"
                            />
                          </div>
                        )}
                      </div>
                    </DialogHeader>
                    <div className="mt-6">
                      {!isConnected && (
                        <Alert variant="destructive">
                          <AlertCircleIcon />
                          <AlertTitle>Please connect your wallet</AlertTitle>
                        </Alert>
                      )}
                    </div>
                    <DialogFooter className="flex items-center justify-center">
                      <Button
                        className=" w-1/2 cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px] bg-[#ffb92d] disabled:bg-gray-500 hover:bg-[#ffb92d] disabled:cursor-not-allowed"
                        disabled={taskLoading || !isConnected || error !== ''}
                        onClick={() => {
                          handleClaim(task.id, task.taskType, twitterInput);
                        }}
                      >
                        Claim Reward {taskLoading && <Spinner />}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
            {/* Telegram Tasks */}
            {telegramTasks.map((task, idx) => (
              // {mocktelegramTasks.map((task, idx) => (
              <div
                key={task.id || idx}
                className="bg-[#181A20] border-1 border-[#4B4B4B] p-4 rounded-[10px] flex flex-col md:flex-row items-center justify-between"
              >
                <div className="flex items-center mb-4 md:mb-0 justify-center">
                  <div className="bg-[#282828] p-3 rounded-full flex items-center justify-center">
                    <img
                      className="w-6 h-6"
                      src="/assets/images/contact-telegram.png"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-[14px] sm:text-[22px] text-white sofia-fonts font-[600]">
                      Join Telegram Group to Earn
                    </h2>
                    <p className="text-[12px] sm:text-[14px] text-white inter-fonts font-[400]">
                      Connect with our community
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <button
                    className="bg-[#FFB92D] text-black text-[14px] font-[700] py-2 px-4 rounded-[9px]"
                    onClick={() => setTelegramDialogOpen(true)}
                  >
                    Join Now
                  </button>
                  <p className="text-[12px] sofia-fonts font-[400] text-white text-center mt-2">
                    {task.rewardQuantity + ` ` + coinTicker}
                  </p>
                </div>
                {/* Dialog for Telegram Task */}
                <Dialog
                  open={telegramDialogOpen}
                  onOpenChange={(isOpen) => setTelegramDialogOpen(isOpen)}
                >
                  <DialogContent className="max-w-[425px] lg:max-w-[600px] overflow-y-auto max-h-[90vh]">
                    {claimError && (
                      <div>
                        <Alert variant="destructive">
                          <AlertCircleIcon className="mr-2 h-4 w-4" />
                          <AlertTitle></AlertTitle>
                          <AlertDescription>{claimError}</AlertDescription>
                        </Alert>
                      </div>
                    )}
                    <DialogHeader className="text-center flex ">
                      <DialogTitle className="text-2xl font-bold gap-2 p-2">
                        Join our Telegram Group
                      </DialogTitle>
                      <DialogDescription className="text-gray-300">
                        You are to join our{' '}
                        <a
                          href={task.redirectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-400"
                        >
                          Telegram
                        </a>{' '}
                        group to earn your reward.
                      </DialogDescription>
                      <div>
                        <label className="flex items-center space-x-2 mt-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-white checked:border-white focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain cursor-pointer accent-white"
                            checked={telegramCheckbox}
                            onChange={(e) =>
                              setTelegramCheckbox(e.target.checked)
                            }
                          />
                          <span className="text-white text-sm">
                            I have performed this task
                          </span>
                        </label>
                        {telegramCheckbox && (
                          <div className="flex items-center mt-2">
                            <span className="text-white bg-gray-700 px-3 py-1 rounded-l">
                              {' '}
                              @{' '}
                            </span>
                            <input
                              type="text"
                              placeholder="Enter your Telegram username"
                              value={telegramInput}
                              onChange={(e) => {
                                setTelegramInput(e.target.value);
                                setClaimError('');
                              }}
                              className="px-4 py-2 h-8 w-full border rounded-r"
                            />
                          </div>
                        )}
                      </div>
                    </DialogHeader>
                    <div className="mt-6">
                      {!isConnected && (
                        <Alert variant="destructive">
                          <AlertCircleIcon />
                          <AlertTitle>Please connect your wallet</AlertTitle>
                        </Alert>
                      )}
                    </div>
                    <DialogFooter className="flex items-center justify-center">
                      <Button
                        className=" w-1/2 cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px] bg-[#ffb92d] disabled:bg-gray-500 hover:bg-[#ffb92d] disabled:cursor-not-allowed"
                        disabled={taskLoading || !isConnected || error !== ''}
                        onClick={() => {
                          handleClaim(task.id, task.taskType, telegramInput);
                        }}
                      >
                        Claim Reward {taskLoading && <Spinner />}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </>
        )}
      </div>
      {/* <!-- Total Available Rewards --> */}
      {(twitterTasks || telegramTasks) && (
        <div className="bg-[#181A20] p-3 sm:px-4 sm:py-8 rounded-[10px] mt-4 border-1 border-[#4B4B4B] block sm:flex items-center justify-between">
          <div className="w-full text-center sm:text-left">
            <h2 className="text-white sofia-fonts font-[600] text-[16px] sm:text-[20px]">
              Total Available Rewards
            </h2>
          </div>
          <div className="w-auto py-7 sm:py-0 text-center">
            <span className="bg-[#282828] w-full rounded-full">
              <Trophy size={60} />
            </span>
          </div>
          <div className="w-full text-center sm:text-end">
            <p className="text-white sofia-fonts font-[600] text-[16px] sm:text-[22px]">
              {mocktwitterTasks[0].rewardQuantity +
                mocktelegramTasks[0].rewardQuantity}
              {` `}
              {coinTicker}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveTasks;
