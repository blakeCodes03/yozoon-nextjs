'use client';

import React, { useState, useEffect, ChangeEvent, createRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import Tooltip from '../common/Tooltip';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import FileUpload from '../../components/ui/FileUpload';
import { apiConfigData } from './apiConfigData'; // Import the API configuration data
import { CircleCheck } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BuyYozoon from '@/components/ui/BuyYozoon';
import { Label } from '@/components/ui/label';
import { FaInfoCircle } from 'react-icons/fa';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getYozoonBalance } from '../../services/yozoon';
import {
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircleIcon,
} from 'lucide-react';

import {
  FaPlus,
  FaTrash,
  FaUserFriends,
  FaGlobe,
  FaTwitter,
  FaInstagram,
  FaTelegramPlane,
  FaHashtag,
} from 'react-icons/fa';
import AvatarUpload from '../ui/AvatarUpload';
import { compressImage } from '@/lib/utils';
import { useAgentRoomStore } from '@/store/agentRoomStore';
import { useSolana } from '../../contexts/SolanaContext';
import { Program } from '@coral-xyz/anchor';
import { AnchorProvider, Wallet, web3 } from '@project-serum/anchor';
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { uploadToPinata, base64ToFile } from '@/lib/pinata';
import { createUserToken } from '../../services/token-mill/services/mintUserToken';
import { useProgramUser } from '../../hooks/useProgram';
import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
} from '@reown/appkit/react';
import { useAppKitProvider } from '@reown/appkit/react';
import * as anchor from '@coral-xyz/anchor';
import { getBondingCurvePDA, getConfigPDA } from '@/utils/config';
import { connection } from '@/lib/connection';
import {
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import type { Provider } from '@reown/appkit-adapter-solana/react';

interface CreateCoinData {
  hashtags?: string[];
  socialLinks?: Record<string, string>;
}

interface SuccessData {
  agentId?: string;
  discordLink?: string;
  telegramLink?: string;
}

export const AIAgentCreationForm = () => {
  const buttonRef = React.createRef<HTMLButtonElement>();

  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [mode, setMode] = useState<'Basic' | 'Expert'>('Basic');

  const [createdCoinId, setCreatedCoinId] = useState<string>('');
  const [formData, setFormData] = useState<CreateCoinData>({
    hashtags: [],
    socialLinks: { twitter: '', telegram: '', website: '' },
  });
  // Hashtag suggestions fetched from the database
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [filteredTrendingHashtags, setFilteredTrendingHashtags] = useState<
    string[]
  >([]);
  const [hashtagInput, setHashtagInput] = useState<string>('');

  const [avatar, setAvatar] = useState<any>(null);
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenTicker, setTokenTicker] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryTags, setCategoryTags] = useState<string[]>([]);
  const [yozoonBalance, setYozoonBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);

  const [hasSufficientYozoon, setHasSufficientYozoon] =
    useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<SuccessData>({
    agentId: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
    discordLink: '',
    telegramLink: '',
  });
  const [personality, setPersonality] = useState({
    bio: '',
    traits: '',
    topics: '',
    temperature: 0.7,
    maxTokens: 2000,
    memoryLength: 1000,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const { address, isConnected, caipAddress, embeddedWalletInfo } =
    useAppKitAccount();

  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const program = useProgramUser(walletProvider, isConnected);

  //initialize agentRoomId from agentRoomStore using zustand
  const setAgentRoomId = useAgentRoomStore((state) => state.setAgentRoomId);

  //to handle opening/closing of buy-yozoon side drawer
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  // Handlers for form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('');
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const platform = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...(prev.socialLinks || {}),
          [platform]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler for personality field changes
  const handlePersonalityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersonality((prev) => ({
      ...prev,
      [name]:
        name === 'temperature' ||
        name === 'maxTokens' ||
        name === 'memoryLength'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    setCreatedCoinId('');

    if (!address || !isConnected) {
      setLoading(false);
      setError('Wallet not connected');
      return;
    }

    if (!program) {
      console.error('Program not loaded yet');
      setError('Error processing request. Please try again.');
      setLoading(false);
      return;
    }

    if (status !== 'authenticated') {
      //   setError(t('mustBeLoggedInToCreateCoin'));
      toast.info(t('mustBeLoggedInToCreateCoin'));
      setLoading(false);
      return;
    }

    // Validate required fields (same validations as before)
    if (!tokenName) {
      setError(t('pleaseEnterCoinName'));
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
      setLoading(false);
      return;
    }
    if (!tokenTicker) {
      setError(t('pleaseEnterTicker'));
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
      setLoading(false);
      return;
    }
    if (!avatar) {
      setError(t('pictureFileRequired'));
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
      setLoading(false);
      return;
    }
    if (!description || description.replace(/<[^>]+>/g, '').trim() === '') {
      setError(t('pleaseEnterDescription'));
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
      setLoading(false);
      return;
    }

    // Prepare FormData for upload to prisma database
    const data = new FormData();
    data.append('name', tokenName);
    data.append('ticker', tokenTicker);
    data.append('description', description);

    // Append social links
    if (formData.socialLinks) {
      Object.keys(formData.socialLinks).forEach((key) => {
        if (formData.socialLinks![key]) {
          data.append(`socialLinks.${key}`, formData.socialLinks![key]);
        }
      });
    }

    // Append hashtags as a single JSON string
    if (formData.hashtags) {
      data.append('hashtags', JSON.stringify(formData.hashtags));
    }

    if (personality) {
      data.append('personality', JSON.stringify(personality));
    }

    // Append picture file
    if (avatar) {
      data.append('pictureFile', avatar);
    }

    const { configPDA } = await getConfigPDA();
    const configAccount = await (program.account as any).config.fetch(
      configPDA
    );

    const yozoonMint = configAccount.mint;
    const decimals = 9;
    const totalSupplyBN = new anchor.BN(1000000000).mul(
      new anchor.BN(10).pow(new anchor.BN(decimals))
    );
    const initialPriceBN = new anchor.BN(100); // 100 lamports = 0.0000001 SOL
    const kFactorBN = new anchor.BN(93750);

    try {
      // Step 1: Calculate the fee and prompt user confirmation

      // const feeResponse = await axios.get('/api/coins/calculateFee');
      // const { fee } = feeResponse.data;
      // const userConfirmation = confirm(
      //   `The fee to create this token is ${fee} SOL. Proceed?`
      // );
      // if (!userConfirmation) {
      //   setLoading(false);
      //   return;
      // }

      //step 2: create token on Solana blockchain

      const pubkey = new PublicKey(address);

      if (solBalance <= 0.5) {
        toast.error('Low SOL balance, please purchase more SOL to proceed.');
      }

      const result = await uploadToPinata({
        name: tokenName,
        symbol: tokenTicker,
        description,
        image: await compressImage(avatar),
        formData: formData,
      });

      if (!result) {
        throw new Error('Failed to upload metadata to IPFS');
      }
      const { uri, image } = result;

      const contractAddress = await createUserToken({
        program,
        publicKey: pubkey,
        name: tokenName,
        symbol: tokenTicker,
        uri: uri,
        image: image,
        totalSupply: totalSupplyBN,
        initialPrice: initialPriceBN,
        kFactor: kFactorBN,
      });

      if (contractAddress) {  //also token mint
        console.log(
          'Token created with contract address:',
          contractAddress.toBase58()
        );
        data.append('contractAddress', contractAddress.toBase58());
      }
      

      console.log('data', tokenTicker);
      console.log('avatar', avatar);

      console.log('address', address);
      console.log('isConnected', isConnected);

      // console.log("data:", data.entries);
      for (const [key, value] of data.entries()) {
  console.log(`${key}: ${value}`);
}

      // Step 3: Proceed with token creation prisma database

      const response = await axios.post('/api/coins', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const createdCoin = response.data.coin;

      if (!createdCoin.id) {
        throw new Error(t('coinIdNotFound'));
      }

      setSuccess(true);
      setCreatedCoinId(createdCoin.id);
      setSuccessData({
        agentId: createdCoin.id,
        telegramLink: createdCoin.telegramLink,
        discordLink: createdCoin.discordLink,
      });

      // Show popup success message notification
      openSuccessPopup();
      toast(t('coinSuccessfullyCreated'));

      // Redirect to the newly created coin's page after a short delay
      setTimeout(() => {
        router.push(`/coin/${createdCoin.id}`);
      }, 3000); // 3-second delay
    } catch (err: any) {
      console.error('Error creating Agent:', err);
      setError(err.response?.data?.message || t('anErrorOccurred'));
      toast.error(err.response?.data?.message || t('anErrorOccurred'));
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    } finally {
      setLoading(false);
    }
  };

  const addHashtag = (tag?: string) => {
    let trimmedHashtag = (tag || hashtagInput).trim();

    if (trimmedHashtag === '') return;

    // Ensure the hashtag starts with '#'
    if (!trimmedHashtag.startsWith('#')) {
      trimmedHashtag = `#${trimmedHashtag}`;
    }

    // Prevent duplicates
    if (formData.hashtags?.includes(trimmedHashtag)) return;

    setFormData((prev) => ({
      ...prev,
      hashtags: [...(prev.hashtags || []), trimmedHashtag],
    }));
    setHashtagInput('');
    setFilteredTrendingHashtags([]);
  };

  const removeHashtag = (hashtag: string) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags?.filter((tag) => tag !== hashtag),
    }));
  };

  const handleHashtagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = e.target.value;
    setHashtagInput(value);

    if (value.length > 0) {
      const suggestions = trendingHashtags.filter((tag) =>
        tag.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTrendingHashtags(suggestions);
    } else {
      setFilteredTrendingHashtags([]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const openSuccessPopup = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  // Handler for file upload
  // const handleFileUpload = (files: File[]) => {
  //   const file = files?.[0] || null;
  //   setAvatar((prev) => file);
  // };

  // Handler for description change using ReactQuill
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('');
    setDescription(e.target.value);
  };

  // remove error on change of avatar
  useEffect(() => {
    setError('');

    
  }, [avatar, description, tokenName, tokenTicker]);

  // Fetch hashtags from the database on component mount
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await axios.get('/api/hashtags');
        setTrendingHashtags(response.data);
      } catch (error) {
        console.error('Error fetching hashtags:', error);
      }
    };

    fetchHashtags();
  }, []);

  // Fetch SOL balance
  useEffect(() => {
    if (!address || !isConnected) return;

    const pubkey = new PublicKey(address);

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(pubkey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        setSolBalance(Number(solBalance.toFixed(2)));
        console.log('SOL balance', solBalance);
      } catch (error) {
        console.error('❌ Error fetching balance:', error);
      }
    };

    fetchBalance();

    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [address, isConnected]);

  // verify YOZOON balance on component mount
  useEffect(() => {
    if (!address || !isConnected || !program) {
      console.error(
        'Cannot verify YOZOON balance: Wallet not connected or program not loaded'
      );
      return;
    }

    const verifyYozoonBalance = async () => {
      setIsVerifying(true);

      const { configPDA } = await getConfigPDA();
      const pubkey = new PublicKey(address);
      const configAccount = await (program.account as any).config.fetch(
        configPDA
      );

      const yozoonMint = configAccount.mint;
      try {
        // Replace with actual wallet address retrieval logic
        const balance = await getYozoonBalance(pubkey, yozoonMint);
        setYozoonBalance(balance.balance);
        console.log('Yozoon balance:', balance.balance);

        // Check if the balance meets the minimum requirement (e.g., 25 YOZOON)
        const minimumYozoonRequired = 25_000_000_000;
        setHasSufficientYozoon(balance.balance >= minimumYozoonRequired);
      } catch (error: any) {
        setError(error.message);
        setHasSufficientYozoon(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyYozoonBalance();
  }, [isConnected, address, isDrawerOpen]);

  return (
    <div className="container mx-auto max-w-full md:max-w-3xl">
      <div>
        <button
          onClick={() => window.history.back()}
          className="mt-5 px-10 py-[7px] border-1 border-[#FFFFFF] shadow-xs shadow-[#FFFFFF] rounded-full inter-fonts font-[600] text-[#FFFFFF] flex flex-row items-center flex-nowrap text-lg"
        >
          <img
            className="flex-shrink-0 w-4 h-4 mr-2"
            src="/assets/images/back-arrow.svg"
            alt=""
          />
          Back
        </button>
      </div>

      <div className="flex items-center justify-center">
        <div className="bg-[#1E2329CC] bg-opacity-80 rounded-[40px] border-[2px] py-5 px-10 md:px-16 border-[#4B4B4B] shadow-lg  w-full mx-4 sm:mx-0">
          <div className="sm:pt-4">
            <h2 className="sofia-fonts font-[700] text-center text-[22px] sm:text-[35px] md:mt-[-15px] text-[#FFB92D]">
              Create New Agent
            </h2>
          </div>
          <div className="flex items-center justify-center w-1/2 mx-auto">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* <Accordion type="single" collapsible className="px-4 py-2"> */}

          {/* <AccordionItem value="agent-identity"> */}
          {/* <AccordionTrigger className=" text-2xl font-bold ">
                Agent Identity
              </AccordionTrigger> */}
          {/* <AccordionContent> */}
          <div className="mb-4 flex items-center justify-between">
            <Label htmlFor="mode-switch">Mode:</Label>
            <div className="space-x-2">
              <span>No Code</span>
              <Switch
                id="mode-switch"
                checked={mode === 'Expert'}
                onCheckedChange={(checked) =>
                  setMode(checked ? 'Expert' : 'Basic')
                }
              />
              <span>Expert</span>
            </div>
          </div>
          <div className="grid gap-4 mt-4">
            <div className="mb-6 relative group">
              <Label htmlFor="token-name">Agent Name:</Label>
              <Input
                className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                type="text"
                id="token-name"
                maxLength={40}
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </div>
            <div className="mb-6 relative group">
              <Label htmlFor="avatar">
                Avatar Upload:
                <Tooltip message={t('uploadMediaTooltip')} />
              </Label>
              <AvatarUpload onAvatarChange={setAvatar} />
              {/* <FileUpload onFileUpload={handleFileUpload} /> */}
              
              {/* <Input
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                      type="file"
                      id="avatar"
                      accept="image/svg+xml, image/png, image/jpeg, image/gif"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          if (file.size > 2 * 1024 * 1024) {
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>
                                File size exceeds 2MB
                              </AlertDescription>
                            </Alert>;
                          }
                          setAvatar(file);
                        }
                      }}
                    /> */}
            </div>
            <div className="mb-6 relative group">
              <Label htmlFor="token-ticker">{t('ticker')} ($):</Label>
              <Input
                className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                type="text"
                id="token-ticker"
                maxLength={5}
                pattern="^[A-Z0-9]{1,5}$"
                value={tokenTicker}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => setTokenTicker(e.target.value)}
              />
            </div>
            <div className="mb-6 relative group">
              <Label htmlFor="description">
                {t('description')}:{' '}
                <Tooltip message={t('descriptionTooltip')} />
              </Label>
              <Textarea
                id="description"
                maxLength={250}
                value={description}
                onChange={handleDescriptionChange}
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
              />

              {/* <Label
                      htmlFor="description"
                      className="block text-lg font-medium text-gray-700"
                    >
                      {t('description')}:{' '}
                      <Tooltip message={t('descriptionTooltip')} />
                    </Label>

                    <ReactQuill
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder={t('describeYourCoin')}
                      readOnly={success}
                      className="mb-2"
                    /> */}
              <div className="text-right text-sm text-gray-500">
                {description.replace(/<[^>]+>/g, '').length}/250
              </div>
            </div>
            {/* <div>
              <Label>Category Tags</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={categoryTags.includes(tag) ? 'default' : 'outline'}
                    onClick={() => {
                      if (categoryTags.includes(tag)) {
                        setCategoryTags(categoryTags.filter((t) => t !== tag));
                      } else {
                        setCategoryTags([...categoryTags, tag]);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div> */}
            <div className="mb-6 relative group">
              <label htmlFor="hashtags" className="block font-semibold mb-2">
                {t('hashtags')}: <Tooltip message={t('hashtagsTooltip')} />
              </label>
              <div className="flex items-center mb-2 space-x-2 relative">
                <FaHashtag className="text-gray-400 mr-2" />
                <Input
                  type="text"
                  value={hashtagInput}
                  onChange={handleHashtagInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHashtag();
                    }
                  }}
                  placeholder={t('addHashtag')}
                  className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => addHashtag()}
                  className="px-4 py-2 bg-[#FFB92D] text-white rounded-r hover:bg-[#c28100] transition-colors focus:outline-none"
                  disabled={success}
                >
                  <FaPlus />
                </button>
                {/* Suggestions Dropdown */}
                {filteredTrendingHashtags.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 bg-white border border-line rounded mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
                    {filteredTrendingHashtags.map((tag, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                        onClick={() => addHashtag(tag)}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap">
                {formData.hashtags?.map((hashtag, index) => (
                  <span
                    key={index}
                    className="hashtag-label mr-2 mb-2 px-2 py-1 bg-accentGreen text-white rounded-full flex items-center"
                  >
                    {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                    {!success && (
                      <button
                        type="button"
                        onClick={() => removeHashtag(hashtag)}
                        className="ml-1 text-white hover:text-gray-300 focus:outline-none"
                        aria-label={t('removeHashtag')}
                      >
                        &times;
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
            {/* Agent Personality */}
            <Accordion type="single" collapsible className="px-4 py-2">
              <AccordionItem value="agent-personality">
                <AccordionTrigger className="text-2xl font-bold">
                  {' '}
                  Agent Personality
                </AccordionTrigger>
                <div className="grid gap-4 mt-4">
                  <div className="mb-6 relative group">
                    <Label htmlFor="bio">
                      Bio{' '}
                      <Tooltip message="Biographical details that establish the agent's background and context." />
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      maxLength={100}
                      value={personality.bio}
                      onChange={handlePersonalityChange}
                      rows={2}
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="mb-6 relative group">
                    <Label htmlFor="traits">
                      Traits{' '}
                      <Tooltip message="Key personality traits of the agent." />
                    </Label>
                    <Textarea
                      id="traits"
                      name="traits"
                      maxLength={100}
                      value={personality.traits}
                      onChange={handlePersonalityChange}
                      rows={2}
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="mb-6 relative group">
                    <Label htmlFor="topics">
                      Topics{' '}
                      <Tooltip message="Preferred topics of discussion for the agent." />
                    </Label>
                    <Textarea
                      id="topics"
                      name="topics"
                      maxLength={100}
                      value={personality.topics}
                      onChange={handlePersonalityChange}
                      rows={2}
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                    />
                  </div>
                </div>
                {mode === 'Expert' && (
                  <div className="grid gap-4">
                    <div className="mb-6 relative group">
                      <Label htmlFor="temperature">
                        Temperature{' '}
                        <Tooltip message="Controls randomness in responses (0–1.2)." />
                      </Label>
                      <Input
                        id="temperature"
                        name="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1.2"
                        value={personality.temperature}
                        onChange={handlePersonalityChange}
                        className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="mb-6 relative group">
                      <Label htmlFor="maxTokens">
                        Max Tokens{' '}
                        <Tooltip message="Maximum token limit for responses (≤ 2000)." />
                      </Label>
                      <Input
                        id="maxTokens"
                        name="maxTokens"
                        type="number"
                        min="10"
                        max="2000"
                        value={personality.maxTokens}
                        onChange={handlePersonalityChange}
                        className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                      />
                    </div>
                    <div className="mb-6 relative group">
                      <Label htmlFor="memoryLength">
                        Memory Length{' '}
                        <Tooltip message="Number of tokens to retain in memory (default ≈ 1000)." />
                      </Label>
                      <Input
                        id="memoryLength"
                        name="memoryLength"
                        type="number"
                        min="1"
                        value={personality.memoryLength}
                        onChange={handlePersonalityChange}
                        className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </AccordionItem>
            </Accordion>
            {/* Optional Links */}
            <div className="mt-3">
              <div className="py-2">
                <label
                  htmlFor="socialLinks.telegram"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telegram Link (optional)
                </label>
                <Input
                  type="url"
                  id="telegram"
                  name="socialLinks.telegram"
                  value={formData.socialLinks?.telegram || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                  placeholder="Enter Telegram link"
                />
              </div>
              <div className="py-2">
                <label
                  htmlFor="socialLinks.website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website Link (optional)
                </label>
                <Input
                  type="url"
                  id="website"
                  name="socialLinks.website"
                  value={formData.socialLinks?.website || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm "
                  placeholder="Enter website link"
                  disabled={success}
                />
              </div>
              <div className="py-2">
                <label
                  htmlFor="socialLinks.twitter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter Link (optional)
                </label>
                <Input
                  type="url"
                  id="twitter"
                  name="socialLinks.twitter"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm "
                  placeholder="Enter Twitter link"
                />
              </div>
            </div>
          </div>
          {/* </AccordionContent> */}
          {/* </AccordionItem> */}
          {/* <AccordionItem value="yozoon-ai-logic">
              <AccordionTrigger className="text-2xl font-bold">
                YOZOON AI Logic Configuration
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div className="mb-6 relative group">
                    <Label>YOZOON AI Logic:</Label>
                    <p className="text-sm text-gray-500">
                      Always On. Your agent always benefits from YOZOON AI Logic
                      for chat and memory management.
                    </p>
                  </div>

                  
                </div>
              </AccordionContent>
            </AccordionItem> */}
          {/* <AccordionItem value="technical-configuration">
              <AccordionTrigger className="text-2xl font-bold">
                Technical Configuration
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem> */}

          {/* //slider section */}

          {/* <AccordionItem value="range">
        <AccordionTrigger>Range</AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-4">
            <Label> Set Range</Label>
            <Slider
              defaultValue={[0]}
              max={100}
              step={1}
              onValueChange={handleProgress}
            />
            <Progress value={progress}/>
          </div>
          </AccordionContent>
      </AccordionItem> */}
          <div className="flex items-center justify-center my-3 ">
            {!isConnected ? (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Please connect your wallet</AlertTitle>
              </Alert>
            ) : isVerifying ? (
              <Alert>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <AlertTitle>Verifying YOZOON balance...</AlertTitle>
                <AlertDescription>
                  Please wait while we check your YOZOON token balance.
                </AlertDescription>
              </Alert>
            ) : hasSufficientYozoon ? (
              <Alert className="bg-green-600">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <AlertTitle>Sufficient Yozoon tokens</AlertTitle>
                <AlertDescription>
                  You hold sufficient YOZOON tokens.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <ShieldAlert className="mr-2 h-4 w-4" />
                <AlertTitle>Insufficient YOZOON tokens</AlertTitle>

                <AlertDescription>
                  You need at least 25 Yozoon tokens to create a token. <br />
                  <a
                    href="#"
                    className="underline text-blue-400"
                    onClick={handleOpenDrawer}
                  >
                    Purchase YOZOON
                  </a>
                  <BuyYozoon
                    isOpen={isDrawerOpen}
                    onClose={handleCloseDrawer}
                  />
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex flex-col items-center justify-center mt-3">
            <button
              onClick={() => handleSubmit()}
              className="w-full cursor-pointer py-2 px-4 bg-[#FFB92D] text-white font-semibold rounded-md shadow hover:bg-[#c28407] md:w-1/2 md:mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFB92D]"
              disabled={
                !hasSufficientYozoon || isVerifying || loading || error != ''
              }
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Agent'
              )}
            </button>
          </div>
          {/* </Accordion> */}
        </div>
      </div>
      {successData && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              ref={buttonRef}
              className="hidden"
              variant="outline"
            >
              Open Dialog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[425px] lg:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-center text-4xl font-bold flex items-center justify-center gap-2 p-2">
                Success{' '}
                <img
                  src="/assets/icons/agent-success-tick.svg"
                  className=" w-14 h-14 circle pulse"
                />
              </DialogTitle>
              <DialogDescription className="mt-2 font-semibold ">
                Setup your agent in Telegram or Discord to start using it.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center mb-4 ">
              <div className="h-full flex items-center gap-1 justify-center font-semibold">
                <span className="font-semibold">Agent ID: </span>
                <code className=" bg-gray-700 py-1 px-2 truncate rounded rounded-r-none max-w-[200px] md:max-w-full max-h-full ">
                  {successData.agentId || (
                    <span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  )}
                </code>
              </div>
              <div className="h-full flex items-center justify-center">
                <button
                  onClick={() => copyToClipboard(successData.agentId || '')}
                  className="cursor-pointer px-2 py-1 rounded-l-none bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]   "
                >
                  <span
                    id="default-message"
                    className="inline-flex items-center"
                  >
                    <svg
                      className="w-3 h-3 me-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                    </svg>
                    <span className="text-xs font-semibold">Copy</span>
                  </span>
                </button>
              </div>
            </div>
            <div className="mb-2">
              <p className=" mb-4 text-muted-foreground text-sm font-semibold">
                Add @YozoonBot to your Telegram or Discord group to receive
                updates.
              </p>
              <h4 className="font-semibold">Telegram</h4>
              <p className=" mb-2 text-muted-foreground text-sm font-semibold">
                Click the link below to add @YozoonBot to your group. It will
                automatically link to your agent.
              </p>
              <a
                href={successData.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <button className="cursor-pointer px-2 py-1 text-sm font-semibold bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]   ">
                  Add to Telegram
                </button>
              </a>
              <p className="text-sm my-2">
                Alternatively, add @YozoonBot manually and run: <br />
                <code className="bg-gray-600 p-1 mt-1 rounded max-w-full">
                  /setup {successData.agentId}
                </code>
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold">Discord</h4>
              <p className=" mb-2 text-muted-foreground text-sm font-semibold">
                Click the link below to add @YozoonBot to your server, then run
                the setup command in a channel.
              </p>
              <a
                href={successData.discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <button className="cursor-pointer px-2 py-1 text-sm font-semibold bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]   ">
                  Add to Discord
                </button>
              </a>
              <p className="text-sm mt-2">
                After adding, run: <br />
                <code className="bg-gray-600 p-1 rounded max-w-full">
                  !setup {successData.agentId}
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
      )}
    </div>
  );
};
