// src/components/pages/StartNewCoin/StartNewCoinForm.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useSession } from 'next-auth/react';
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
import Image from 'next/image';
import Tooltip from '../../common/Tooltip';
import Modal from '../../common/Modal';
import { addDays, format } from 'date-fns';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';

interface CreateCoinData {
  blockchain: string;
  pictureFile: File | null;
  name: string;
  ticker: string;
  description: string;
  socialLinks?: Record<string, string>;
  airdropAmount?: string;
  vestingDetails?: VestingDetails;
  teamMembers?: TeamMember[];
  fastTrackListing?: boolean;
  stakingPoolAllocation?: string;
  stakingPoolDuration?: string;
  hashtags?: string[];
  milestones?: Milestone[];
  airdropTasks?: AirdropTask[];
}

interface VestingDetails {
  who?: 'devs' | 'devs_and_cryptowny_buyers';
  releaseDate?: string;
  releasePercentage?: number;
  staggered?: boolean;
  staggerIntervalDays?: number;
  staggerPercentage?: number;
}

interface TeamMember {
  username: string;
  avatarUrl?: string;
  displayName?: string;
}

interface Milestone {
  date: string;
  description: string;
}

interface AirdropTask {
  task: string;
}

const blockchainOptions = [
  { value: 'sol', label: 'Solana', icon: '/assets/icons/solana.png' },
  { value: 'bnb', label: 'Binance Smart Chain', icon: '/assets/icons/bnb.png' },
  { value: 'eth', label: 'Ethereum', icon: '/assets/icons/ethereum.png' },
  { value: 'avax', label: 'Avalanche', icon: '/assets/icons/avax.png' },
  { value: 'blast', label: 'Blast', icon: '/assets/icons/blast.png' },
  { value: 'optimism', label: 'Optimism', icon: '/assets/icons/optimism.png' },
  { value: 'opbnb', label: 'OPBNB', icon: '/assets/icons/opbnb.png' },
  { value: 'aptos', label: 'Aptos', icon: '/assets/icons/aptos.png' },
  { value: 'hbar', label: 'Hedera Hashgraph (HBAR)', icon: '/assets/icons/hbar.png' },
  { value: 'linear', label: 'Linear', icon: '/assets/icons/linear.png' },
];

const airdropTaskOptions = [
  'FollowUsOnTwitter',
  'JoinOurTelegramGroup',
  'FollowUsOnInstagram',
  'ShareOurPostOnFacebook',
  'SubscribeToOurNewsletter',
];

const StartNewCoinForm: React.FC = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCoinData>({
    blockchain: '',
    pictureFile: null,
    name: '',
    ticker: '',
    description: '',
    socialLinks: { twitter: '', telegram: '', website: '', instagram: '' },
    airdropAmount: '',
    vestingDetails: {
      who: 'devs',
      releaseDate: '',
      releasePercentage: 100,
      staggered: false,
      staggerIntervalDays: 10,
      staggerPercentage: 10,
    },
    teamMembers: [],
    fastTrackListing: false,
    stakingPoolAllocation: '',
    stakingPoolDuration: '',
    hashtags: [],
    milestones: [],
    airdropTasks: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [createdCoinId, setCreatedCoinId] = useState<string>('');

  const [showFastTrackModal, setShowFastTrackModal] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [showAdminLaunchButton, setShowAdminLaunchButton] = useState<boolean>(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState<boolean>(false);

  // Hashtag suggestions fetched from the database
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [filteredTrendingHashtags, setFilteredTrendingHashtags] = useState<string[]>([]);

  // Handlers for form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const checked = (e.target as HTMLInputElement).checked;
    let newValue: any = value;

    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = value === '' ? '' : parseFloat(value);
    }

    if (name.startsWith('vestingDetails.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        vestingDetails: {
          ...(prev.vestingDetails || {}),
          [field]: newValue,
        },
      }));
    } else if (name.startsWith('socialLinks.')) {
      const platform = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...(prev.socialLinks || {}),
          [platform]: newValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  // Handler for description change using ReactQuill
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // Handler for picture upload
  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        pictureFile: e.target.files![0],
      }));
    }
  };

  // Handlers for team members
  const [teamUsername, setTeamUsername] = useState<string>('');
  const [teamError, setTeamError] = useState<string>('');

  const addTeamMember = async () => {
    if (!teamUsername.startsWith('@')) {
      setTeamError(t('usernameMustStartWithAt'));
      return;
    }

    let username = teamUsername.slice(1); // Remove @

    // Normalize the username by trimming whitespace
    username = username.trim();

    if (username === '') {
      setTeamError(t('usernameCannotBeEmpty'));
      return;
    }

    try {
      // Fetch user data from your API or database
      const response = await axios.get(`/api/users/username/${username}`);
      const user = response.data;

      if (!user) {
        setTeamError(t('userNotFound'));
        return;
      }

      // Check if already added
      if (formData.teamMembers?.find((member) => member.username.toLowerCase() === `#${username.toLowerCase()}`)) {
        setTeamError(t('teamMemberAlreadyAdded'));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        teamMembers: [
          ...(prev.teamMembers || []),
          {
            username: `#${username}`, // Ensure hashtag prefix
            avatarUrl: user.pictureUrl,
            displayName: user.username,
          },
        ],
      }));
      setTeamUsername('');
      setTeamError('');
    } catch (err) {
      console.error(err);
      setTeamError(t('errorFetchingUser'));
    }
  };

  const removeTeamMember = (username: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers?.filter((member) => member.username !== username),
    }));
  };

  // Handlers for hashtags
  const [hashtagInput, setHashtagInput] = useState<string>('');

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

  // Handlers for milestones
  const [milestoneDate, setMilestoneDate] = useState<string>('');
  const [milestoneDescription, setMilestoneDescription] = useState<string>('');
  const [milestoneError, setMilestoneError] = useState<string>('');

  const addMilestone = () => {
    if (milestoneDate === '' || milestoneDescription.trim() === '') {
      setMilestoneError(t('milestoneFieldsRequired'));
      return;
    }

    const selectedDate = new Date(milestoneDate);
    const today = new Date();
    // Remove time components for accurate comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setMilestoneError(t('milestoneDateMustBeInFuture'));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...(prev.milestones || []),
        { date: milestoneDate, description: milestoneDescription },
      ],
    }));
    setMilestoneDate('');
    setMilestoneDescription('');
    setMilestoneError('');
  };

  const removeMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index),
    }));
  };

  // Handlers for Airdrop Tasks
  const [selectedAirdropTasks, setSelectedAirdropTasks] = useState<string[]>([]);

  const toggleAirdropTask = (task: string) => {
    setSelectedAirdropTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
    setFormData((prev) => ({
      ...prev,
      airdropTasks: selectedAirdropTasks.includes(task)
        ? prev.airdropTasks?.filter((t) => t.task !== task)
        : [...(prev.airdropTasks || []), { task }],
    }));
  };

  // Handler for form submission with fee calculation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setCreatedCoinId('');

    if (status !== 'authenticated') {
      toast.error(t('mustBeLoggedInToCreateCoin'));
      setLoading(false);
      return;
    }

    // Validate required fields (same validations as before)
    if (!formData.name) {
      setError(t('pleaseEnterCoinName'));
      setLoading(false);
      return;
    }
    if (!formData.ticker) {
      setError(t('pleaseEnterTicker'));
      setLoading(false);
      return;
    }
    if (!formData.pictureFile) {
      setError(t('pictureFileRequired'));
      setLoading(false);
      return;
    }
    if (!formData.blockchain) {
      setError(t('pleaseSelectBlockchain'));
      setLoading(false);
      return;
    }
    if (!formData.description || formData.description.replace(/<[^>]+>/g, '').trim() === '') {
      setError(t('pleaseEnterDescription'));
      setLoading(false);
      return;
    }

    // Validate vesting percentages
    if (formData.vestingDetails?.staggered) {
      const totalPercentage =
        (formData.vestingDetails?.staggerPercentage || 0) *
        (formData.vestingDetails?.staggerIntervalDays || 0);
      if (totalPercentage !== 100) {
        setError(t('vestingPercentageMustTotal100'));
        setLoading(false);
        return;
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        vestingDetails: {
          ...(prev.vestingDetails || {}),
          releasePercentage: 100,
        },
      }));
    }

    // Validate airdrop amount
    if (formData.airdropAmount) {
      const airdropPercent = parseFloat(formData.airdropAmount);
      if (airdropPercent < 0 || airdropPercent > 100) {
        setError(t('airdropAmountMustBeBetween0And100'));
        setLoading(false);
        return;
      }
    }

    // Prepare FormData for file upload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('ticker', formData.ticker);
    data.append('blockchain', formData.blockchain);
    data.append('description', formData.description);
    data.append('vestingDetails', JSON.stringify(formData.vestingDetails || {}));
    data.append('fastTrackListing', formData.fastTrackListing?.toString() || 'false');
    data.append('airdropAmount', formData.airdropAmount || '0');
    data.append('stakingPoolAllocation', formData.stakingPoolAllocation || '0');
    data.append('stakingPoolDuration', formData.stakingPoolDuration || '0');

    // Append social links
    if (formData.socialLinks) {
      Object.keys(formData.socialLinks).forEach((key) => {
        if (formData.socialLinks![key]) {
          data.append(`socialLinks.${key}`, formData.socialLinks![key]);
        }
      });
    }

    // Append team members as JSON string
    if (formData.teamMembers) {
      data.append('teamMembers', JSON.stringify(formData.teamMembers));
    }

    // Append hashtags as a single JSON string
    if (formData.hashtags) {
      data.append('hashtags', JSON.stringify(formData.hashtags));
    }

    // Append milestones as JSON string
    if (formData.milestones) {
      data.append('milestones', JSON.stringify(formData.milestones));
    }

    // Append airdrop tasks as JSON string
    if (formData.airdropTasks) {
      data.append('airdropTasks', JSON.stringify(formData.airdropTasks));
    }

    // Append picture file
    if (formData.pictureFile) {
      data.append('pictureFile', formData.pictureFile);
    }

    try {
      // Step 1: Calculate the fee and prompt user confirmation
      const feeResponse = await axios.get('/api/coins/calculateFee');
      const { fee } = feeResponse.data;
      const userConfirmation = confirm(`The fee to create this token is ${fee} SOL. Proceed?`);
      if (!userConfirmation) {
        setLoading(false);
        return;
      }

      // Step 2: Proceed with token creation
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

      // Show toast notification
      toast.success(t('coinSuccessfullyCreated'));

      // Redirect to the newly created coin's page after a short delay
      setTimeout(() => {
        router.push(`/coin/${createdCoin.id}`);
      }, 3000); // 3-second delay
    } catch (err: any) {
      console.error('Error creating coin:', err);
      setError(err.response?.data?.message || t('anErrorOccurred'));
      toast.error(err.response?.data?.message || t('anErrorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  // Handler for picture upload preview removal
  const removePicture = () => {
    setFormData((prev) => ({
      ...prev,
      pictureFile: null,
    }));
  };

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

  // Set default release date to 3 days from today
  useEffect(() => {
    if (!formData.vestingDetails?.releaseDate) {
      const threeDaysLater = addDays(new Date(), 3);
      const formattedDate = format(threeDaysLater, 'yyyy-MM-dd'); // Using ISO format for date input
      setFormData((prev) => ({
        ...prev,
        vestingDetails: {
          ...(prev.vestingDetails || {}),
          releaseDate: formattedDate,
        },
      }));
    }
  }, [formData.vestingDetails]);

  // Check if user is admin to show the manual launch button
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      setShowAdminLaunchButton(true);
    }
    console.log('User Role:', session?.user?.role); // Debugging line
  }, [session]);

  // Handler for manual launch
  const handleManualLaunch = () => {
    setShowBenefitsModal(true);
  };

  const confirmManualLaunch = async () => {
    try {
      // Assuming you have an API route to handle manual launch
      await axios.post('/api/coins/manual-launch', { coinId: createdCoinId });
      toast.success(t('coinManuallyLaunched'));
      setShowBenefitsModal(false);
      // Optionally, update the coin status in the UI
      setFormData((prev) => ({
        ...prev,
        fastTrackListing: false, // Example
      }));
    } catch (err: any) {
      console.error('Error launching coin:', err);
      toast.error(err.response?.data?.message || t('anErrorOccurred'));
    }
  };

  return (
    <>
      {/* ToastContainer for react-toastify */}
      {/* Ensure <ToastContainer /> is included in your _app.tsx */}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8 bg-bg1 text-textPrimary shadow rounded-lg w-full mt-20 mb-10"
      >
        {/* Renamed Title */}
        <h2 className="text-3xl font-bold mb-6 text-center">{t('Create New Coin')}</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Picture/GIF/Video Upload */}
        <div className="mb-6 relative group">
          <label htmlFor="pictureFile" className="block font-semibold mb-2">
            {t('uploadMedia')} <Tooltip message={t('uploadMediaTooltip')} />
          </label>
          <div
            className="w-full h-48 bg-bg2 flex items-center justify-center mb-2 rounded cursor-pointer border border-line hover:border-accentBlue transition-colors"
            onClick={() => !success && document.getElementById('pictureFile')?.click()}
          >
            {!formData.pictureFile ? (
              <div className="flex flex-col items-center">
                <FaPlus className="text-4xl text-gray-400" />
                <span className="text-gray-400 mt-2">{t('uploadImageGifVideo')}</span>
              </div>
            ) : (
              <div className="relative">
                {formData.pictureFile.type.startsWith('image/') ? (
                  <Image
                    src={URL.createObjectURL(formData.pictureFile)}
                    alt={t('mediaPreview')}
                    width={200}
                    height={200}
                    className="object-cover rounded"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(formData.pictureFile)}
                    controls
                    className="object-cover rounded"
                    width="auto"
                    height="auto"
                  />
                )}
                {!success && (
                  <button
                    type="button"
                    onClick={removePicture}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    aria-label={t('removeMedia')}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
          </div>
          <input
            type="file"
            name="pictureFile"
            id="pictureFile"
            accept="image/*,video/*"
            onChange={handlePictureUpload}
            required
            className="hidden"
            disabled={success}
          />
        </div>

        {/* Coin Name */}
        <Input
          label={t('coinName')}
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={t('e.gCryptoMeme')}
          tooltip={t('coinNameTooltip')}
          disabled={success}
        />

        {/* Ticker */}
        <Input
          label={t('ticker')}
          name="ticker"
          type="text"
          value={formData.ticker}
          onChange={handleChange}
          required
          placeholder={t('e.gCMEME')}
          maxLength={5}
          tooltip={t('tickerTooltip')}
          disabled={success}
        />

        {/* Blockchain Selection */}
        <div className="mb-6 relative group">
          <label className="block font-semibold mb-2">
            {t('blockchain')} <Tooltip message={t('blockchainTooltip')} />
          </label>
          <div className="flex flex-wrap gap-4">
            {blockchainOptions.map((blockchain) => (
              <label key={blockchain.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="blockchain"
                  value={blockchain.value}
                  checked={formData.blockchain === blockchain.value}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-accentGreen"
                  disabled={success}
                />
                <div className="flex items-center ml-2">
                  <Image
                    src={blockchain.icon}
                    alt={`${blockchain.label} Logo`}
                    width={24}
                    height={24}
                    className="w-6 h-6 mr-2"
                  />
                  <span>{blockchain.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description with ReactQuill */}
        <div className="mb-6 relative group">
          <label htmlFor="description" className="block font-semibold mb-2">
            {t('description')} <Tooltip message={t('descriptionTooltip')} />
          </label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleDescriptionChange}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['clean']
              ],
            }}
            formats={[
              'header',
              'bold', 'italic', 'underline',
              'list', 'bullet'
            ]}
            placeholder={t('describeYourCoin')}
            readOnly={success}
            className="mb-2"
          />
          <div className="text-right text-sm text-gray-500">
            {formData.description.replace(/<[^>]+>/g, '').length}/250
          </div>
        </div>

        {/* Hashtags Input with Suggestions */}
        <div className="mb-6 relative group">
          <label htmlFor="hashtags" className="block font-semibold mb-2">
            {t('hashtags')} <Tooltip message={t('hashtagsTooltip')} />
          </label>
          <div className="flex items-center mb-2 relative">
            <FaHashtag className="text-gray-400 mr-2" />
            <input
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
              className="flex-grow px-4 py-2 border border-line rounded-l bg-bg2 text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue"
              disabled={success}
            />
            <button
              type="button"
              onClick={() => addHashtag()}
              className="px-4 py-2 bg-accentBlue text-white rounded-r hover:bg-neonBlue transition-colors focus:outline-none"
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

        {/* Show More Options */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions((prev) => !prev)}
            className="text-accentBlue hover:underline focus:outline-none text-lg font-semibold"
          >
            {showAdvancedOptions ? t('showLessOptions') : t('showMoreOptions')}
          </button>
        </div>

        {showAdvancedOptions && (
          <>
            {/* Fast Track Listing */}
            <div className="mb-6 relative group">
              <label className="block font-semibold mb-2">
                {t('listingPreference')} <Tooltip message={t('listingPreferenceTooltip')} />
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="fastTrackListing"
                    checked={formData.fastTrackListing || false}
                    onChange={() => setShowFastTrackModal(true)}
                    className="form-checkbox h-5 w-5 text-accentGreen"
                    disabled={success}
                  />
                  <span className="ml-2">
                    {t('fastPacedListing')} <Tooltip message={t('fastPacedListingTooltip')} />
                  </span>
                </label>
              </div>
            </div>

            {/* Vesting Details */}
            <div className="mb-6 p-6 rounded-lg bg-bg2">
              <h3 className="text-xl font-semibold mb-4">{t('vestingDetails')}</h3>

              {/* Who */}
              <div className="mb-4 relative group">
                <label htmlFor="vestingDetails.who" className="block font-semibold mb-2">
                  {t('who')} <Tooltip message={t('whoTooltip')} />
                </label>
                <select
                  name="vestingDetails.who"
                  id="vestingDetails.who"
                  value={formData.vestingDetails?.who || 'devs'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-line rounded bg-bg2 text-textPrimary appearance-none bg-no-repeat bg-right-4"
                  disabled={success}
                >
                  <option value="devs">{t('devs')}</option>
                  <option value="devs_and_cryptowny_buyers">{t('devsAndBuyers')}</option>
                </select>
              </div>

              {/* Release Date */}
              <Input
                label={t('releaseDate')}
                name="vestingDetails.releaseDate"
                type="date"
                value={formData.vestingDetails?.releaseDate || ''}
                onChange={handleChange}
                placeholder={t('ddmmyyyy')}
                tooltip={t('releaseDateTooltip')}
                disabled={success}
                min={format(addDays(new Date(), 1), 'yyyy-MM-dd')} // Ensure release date is in the future
              />

              {/* Release Percentage */}
              <Input
                label={t('releasePercentage')}
                name="vestingDetails.releasePercentage"
                type="number"
                value={formData.vestingDetails?.releasePercentage || 100}
                onChange={handleChange}
                min={0}
                max={100}
                placeholder={t('e.g50')}
                tooltip={t('releasePercentageTooltip')}
                disabled={!formData.vestingDetails?.staggered || success}
              />

              {/* Staggered Vesting */}
              <div className="mb-4 relative group">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="vestingDetails.staggered"
                    checked={formData.vestingDetails?.staggered || false}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-accentGreen"
                    disabled={success}
                  />
                  <span className="ml-2 font-semibold">{t('staggeredVesting')}</span>
                </label>
                <Tooltip message={t('staggeredVestingTooltip')} />
              </div>

              {/* Stagger Interval Days */}
              {formData.vestingDetails?.staggered && (
                <Input
                  label={t('staggerIntervalDays')}
                  name="vestingDetails.staggerIntervalDays"
                  type="number"
                  value={formData.vestingDetails.staggerIntervalDays || ''}
                  onChange={handleChange}
                  min={1}
                  placeholder={t('e.g10')}
                  tooltip={t('staggerIntervalDaysTooltip')}
                  disabled={success}
                />
              )}

              {/* Stagger Percentage */}
              {formData.vestingDetails?.staggered && (
                <Input
                  label={t('staggerPercentage')}
                  name="vestingDetails.staggerPercentage"
                  type="number"
                  value={formData.vestingDetails.staggerPercentage || ''}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  placeholder={t('e.g10')}
                  tooltip={t('staggerPercentageTooltip')}
                  disabled={success}
                />
              )}
            </div>

            {/* Airdrop Amount */}
            <div className="mb-6 relative group">
              <Input
                label={t('airdropAmount')}
                name="airdropAmount"
                type="number"
                value={formData.airdropAmount || ''}
                onChange={handleChange}
                min={0}
                max={100}
                placeholder={t('e.g5')}
                tooltip={t('airdropAmountTooltip')}
                disabled={success}
              />
            </div>

            {/* Staking Pool Allocation */}
            <div className="mb-6 relative group">
              <Input
                label={t('stakingPoolAllocation')}
                name="stakingPoolAllocation"
                type="number"
                value={formData.stakingPoolAllocation || ''}
                onChange={handleChange}
                min={0}
                max={100}
                placeholder={t('e.g10')}
                tooltip={t('stakingPoolAllocationTooltip')}
                disabled={success}
              />
            </div>

            {/* Staking Pool Duration */}
            <div className="mb-6 relative group">
              <Input
                label={t('stakingPoolDuration')}
                name="stakingPoolDuration"
                type="number"
                value={formData.stakingPoolDuration || ''}
                onChange={handleChange}
                min={1}
                placeholder={t('e.g30')}
                tooltip={t('stakingPoolDurationTooltip')}
                disabled={success}
              />
            </div>

            {/* Milestones */}
            <div className="mb-6 p-6 rounded-lg bg-bg2">
              <h3 className="text-xl font-semibold mb-4">{t('milestones')}</h3>

              {/* Add Milestone */}
              <div className="flex items-center mb-4">
                <input
                  type="date"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className="px-4 py-2 border border-line rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-accentBlue appearance-none cursor-pointer"
                  disabled={success}
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')} // Set min to tomorrow
                />
                <input
                  type="text"
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                  placeholder={t('milestoneDescriptionPlaceholder')}
                  className="flex-grow px-4 py-2 border-t border-b border-line bg-bg2 text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue"
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-accentBlue text-white rounded-r hover:bg-neonBlue transition-colors focus:outline-none"
                  disabled={success}
                >
                  <FaPlus />
                </button>
              </div>
              {milestoneError && <p className="text-red-500 text-sm mb-2">{milestoneError}</p>}
              {/* Display Milestones */}
              <div className="space-y-2">
                {formData.milestones?.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-bg3 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{format(new Date(milestone.date), 'PPP')}</span>
                      <span>{milestone.description}</span>
                    </div>
                    {!success && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label={t('removeMilestone')}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Airdrop Tasks */}
            <div className="mb-6 p-6 rounded-lg bg-bg2">
              <h3 className="text-xl font-semibold mb-4">{t('airdropTasks')}</h3>
              <div className="space-y-2">
                {airdropTaskOptions.map((task, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="airdropTasks"
                      value={task}
                      checked={selectedAirdropTasks.includes(task)}
                      onChange={() => toggleAirdropTask(task)}
                      className="form-checkbox h-5 w-5 text-accentGreen"
                      disabled={success}
                    />
                    <span className="ml-2">{t(task)}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Team Members */}
        <div className="mb-6 p-6 rounded-lg bg-bg2">
          <h3 className="text-xl font-semibold mb-4">{t('teamMembers')}</h3>
          <div className="flex items-center mb-4">
            <FaUserFriends className="text-gray-400 mr-2" />
            <input
              type="text"
              value={teamUsername}
              onChange={(e) => setTeamUsername(e.target.value)}
              placeholder={t('addTeamMember')}
              className="flex-grow px-4 py-2 border border-line rounded-l bg-bg2 text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue"
              disabled={success}
            />
            <button
              type="button"
              onClick={addTeamMember}
              className="px-4 py-2 bg-accentBlue text-white rounded-r hover:bg-neonBlue transition-colors focus:outline-none"
              disabled={success}
            >
              <FaPlus />
            </button>
          </div>
          {teamError && <p className="text-red-500 text-sm mb-2">{teamError}</p>}
          <div className="space-y-2">
            {formData.teamMembers?.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-bg3 rounded"
              >
                <div className="flex items-center space-x-2">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.displayName || member.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  )}
                  <span>{member.username}</span>
                </div>
                {!success && (
                  <button
                    type="button"
                    onClick={() => removeTeamMember(member.username)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label={t('removeTeamMember')}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6 p-6 rounded-lg bg-bg2">
          <h3 className="text-xl font-semibold mb-4">{t('socialLinks')}</h3>
          {/* Website */}
          <div className="flex items-center mb-4">
            <FaGlobe className="text-gray-400 mr-2" />
            <Input
              label={t('website')}
              name="socialLinks.website"
              type="url"
              value={formData.socialLinks?.website || ''}
              onChange={handleChange}
              placeholder="https://yourcoinwebsite.com"
              tooltip={t('websiteTooltip')}
              disabled={success}
            />
          </div>

          {/* Twitter */}
          <div className="flex items-center mb-4">
            <FaTwitter className="text-gray-400 mr-2" />
            <Input
              label={t('twitter')}
              name="socialLinks.twitter"
              type="url"
              value={formData.socialLinks?.twitter || ''}
              onChange={handleChange}
              placeholder="https://twitter.com/yourcoin"
              tooltip={t('twitterTooltip')}
              disabled={success}
            />
          </div>

          {/* Instagram */}
          <div className="flex items-center mb-4">
            <FaInstagram className="text-gray-400 mr-2" />
            <Input
              label={t('instagram')}
              name="socialLinks.instagram"
              type="url"
              value={formData.socialLinks?.instagram || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/yourcoin"
              tooltip={t('instagramTooltip')}
              disabled={success}
            />
          </div>

          {/* Telegram */}
          <div className="flex items-center">
            <FaTelegramPlane className="text-gray-400 mr-2" />
            <Input
              label={t('telegram')}
              name="socialLinks.telegram"
              type="url"
              value={formData.socialLinks?.telegram || ''}
              onChange={handleChange}
              placeholder="https://t.me/yourcoin"
              tooltip={t('telegramTooltip')}
              disabled={success}
            />
          </div>
        </div>

        {/* Persistent Warning Message */}
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded">
          {t('persistentWarning')}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button type="submit" disabled={loading || success} variant="primary">
            {loading ? t('creating') : t('createCoin')}
          </Button>
        </div>

        {/* Admin Manual Launch Button */}
        {showAdminLaunchButton && (
          <div className="mt-6 text-center">
            <Button
              type="button"
              onClick={handleManualLaunch}
              variant="secondary"
              // className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors focus:outline-none text-lg font-semibold"
            >
              {t('manualLaunch')}
            </Button>
          </div>
        )}

        {/* Fast-Paced Listing Modal */}
        <Modal
          isOpen={showFastTrackModal}
          onClose={() => {
            setShowFastTrackModal(false);
            setFormData((prev) => ({
              ...prev,
              fastTrackListing: false,
            }));
          }}
          title={t('fastPacedListingConfirmation')}
        >
          <p className="mb-4">
            {t('fastPacedListingDescription')}
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowFastTrackModal(false);
                setFormData((prev) => ({
                  ...prev,
                  fastTrackListing: false,
                }));
              }}
            >
              {t('decline')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const threeDaysLater = addDays(new Date(), 3);
                const formattedDate = format(threeDaysLater, 'yyyy-MM-dd'); // Using ISO format for date input
                setShowFastTrackModal(false);
                setFormData((prev) => ({
                  ...prev,
                  fastTrackListing: true,
                  vestingDetails: {
                    ...(prev.vestingDetails || {}),
                    releaseDate: formattedDate,
                    releasePercentage: 100,
                  },
                }));
              }}
            >
              {t('accept')}
            </Button>
          </div>
        </Modal>

        {/* Benefits Explanation Modal for Manual Launch */}
        <Modal
          isOpen={showBenefitsModal}
          onClose={() => setShowBenefitsModal(false)}
          title={t('manualLaunchBenefits')}
        >
          <p className="mb-4">
            {t('manualLaunchBenefitsDescription')}
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowBenefitsModal(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={confirmManualLaunch}
            >
              {t('confirmLaunch')}
            </Button>
          </div>
        </Modal>
      </form>
    </>
  );
};

export default StartNewCoinForm;
