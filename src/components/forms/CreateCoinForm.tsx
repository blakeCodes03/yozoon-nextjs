import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Tooltip from '../common/Tooltip';
import { addDays, format } from 'date-fns';
import { useRouter } from 'next/router';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import FileUpload from '../../components/ui/FileUpload';
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

interface CreateCoinData {
  pictureFile: File | null;
  name: string;
  ticker: string;
  description: string;
  hashtags?: string[];
  socialLinks?: Record<string, string>;
}

const CreateCoinForm: React.FC = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [createdCoinId, setCreatedCoinId] = useState<string>('');
  const [formData, setFormData] = useState<CreateCoinData>({
    name: '',
    ticker: '',
    description: '',
    hashtags: [],
    pictureFile: null as File | null,
    socialLinks: { twitter: '', telegram: '', website: '', discord: '' },
  });

  // Hashtag suggestions fetched from the database
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [filteredTrendingHashtags, setFilteredTrendingHashtags] = useState<
    string[]
  >([]);

  // Handlers for form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    if (
      !formData.description ||
      formData.description.replace(/<[^>]+>/g, '').trim() === ''
    ) {
      setError(t('pleaseEnterDescription'));
      setLoading(false);
      return;
    }

    // Prepare FormData for file upload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('ticker', formData.ticker);
    data.append('description', formData.description);

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

    // Append picture file
    if (formData.pictureFile) {
      data.append('pictureFile', formData.pictureFile);
    }

    try {
      // Step 1: Calculate the fee and prompt user confirmation     

      //step 2: create token on chain

      // Step 3: Proceed with token creation on prisma
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

  const handleFileUpload = (files: File[]) => {
    const file = files?.[0] || null;
    setFormData((prev) => ({ ...prev, pictureFile: file }));
  };

  // Handler for description change using ReactQuill
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
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

  return (
    <div className="container mx-auto max-w-5xl">
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
      <div className="flex items-center justify-center my-5 text-white py-5">
        <div className="bg-[#1E2329CC] bg-opacity-80 rounded-[40px] border-[2px] border-[#4B4B4B] shadow-lg p-3 w-full max-w-lg mx-4 sm:mx-0">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end items-center">
            <button className="text-white">
              <i className="fas fa-times mr-2"></i>
            </button>
          </div>
          <div className="md:mt-[-30px] sm:pt-4">
            <h2 className="sofia-fonts font-[700] text-center text-[22px] sm:text-[35px] md:mt-[-15px] text-[#FFB92D]">
              Create New Coin
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-700"
              >
                {t('coinName')}:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                placeholder="Enter coin name"
                required
              />
            </div>

            {/* Ticker */}
            <div>
              <label
                htmlFor="ticker"
                className="block text-lg font-medium text-gray-700"
              >
                {t('ticker')} ($):
              </label>
              <input
                type="text"
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                placeholder="Enter ticker symbol"
                required
              />
            </div>

            {/* Description with ReactQuill */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium text-gray-700"
              >
                {t('description')}:{' '}
                <Tooltip message={t('descriptionTooltip')} />
              </label>
              {/* <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                placeholder="Enter description"
                required
              /> */}
              <ReactQuill
                value={formData.description}
                onChange={handleDescriptionChange}
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

            {/* Image upload */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                {t('uploadMedia')}:{' '}
                <Tooltip message={t('uploadMediaTooltip')} />
              </label>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>

            {/* Optional Links */}
            <div className="mt-3">
              <div className="py-2">
                <label
                  htmlFor="socialLinks.telegram"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telegram Link (optional)
                </label>
                <input
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
                <input
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
                <input
                  type="url"
                  id="twitter"
                  name="socialLinks.twitter"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm "
                  placeholder="Enter Twitter link"
                />
              </div>
              <div className="py-2">
                <label
                  htmlFor="socialLinks.discord"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter Link (optional)
                </label>
                <input
                  type="url"
                  id="discord"
                  name="socialLinks.discord"
                  value={formData.socialLinks?.discord || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm "
                  placeholder="Enter Discord link"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#FFB92D] text-white font-semibold rounded-md shadow hover:bg-[#c28407]"
            >
              Create Coin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoinForm;
