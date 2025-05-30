'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
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
import { Label } from '@/components/ui/label';
import { FaInfoCircle } from 'react-icons/fa';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  PumpFunActionData,
  executePumpFunAction,
} from '../../services/pump-fun';
import { getYozoonBalance } from '../../services/yozoon';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
// import {Calendar} from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, set } from 'date-fns';
// import {Progress} from '@/components/ui/progress';
// import {Slider} from '@/components/ui/slider';
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
import { useAgentRoomStore } from '@/store/agentRoomStore';


interface CreateCoinData {
  hashtags?: string[];
  socialLinks?: Record<string, string>;
}

const CATEGORY_TAGS = [
  'DAO',
  'DeFi',
  'Meme',
  'Trading',
  'Governance',
  'Social',
  'Utility',
];

export const AIAgentCreationForm = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
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

  const [mode, setMode] = useState<'NoCode' | 'Expert'>('NoCode');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [avatar, setAvatar] = useState<any>(null);
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenTicker, setTokenTicker] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryTags, setCategoryTags] = useState<string[]>([]);
  const [yozoonBalance, setYozoonBalance] = useState<number>(0);
  const [hasSufficientYozoon, setHasSufficientYozoon] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [llmProvider, setLlmProvider] = useState('');
  const [platformCredentials, setPlatformCredentials] = useState<any>({});
  const [platformCredentialsFilled, setPlatformCredentialsFilled] = useState<{
    [key: string]: boolean;
  }>({});
  const [progress, setProgress] = useState(0);
  const [solanaConfig, setSolanaConfig] = useState<{
    birdeyeApiKey: string;
    solPrivateKey: string;
    solPublicKey: string;
  }>({
    birdeyeApiKey: '',
    solPrivateKey: '',
    solPublicKey: '',
  });

  //initialize agentRoomId from agentRoomStore using zustand
  const setAgentRoomId = useAgentRoomStore((state) => state.setAgentRoomId);


  const handleProgress = (value: number) => {
    setProgress(value);
  };

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // this checks if user has filled the platform credentials for the selected platforms
  const filledStatus: { [key: string]: boolean } = {};



  // Building secrets for eliza character object dynamically
  const buildSecretkeys = () => {
    const secrets: Record<string, string> = {};
    // Conditionally add LLM API key
    if (llmProvider && apiKey) {
      if (llmProvider === 'OpenAI') {
        secrets['OPENAI_API_KEY'] = apiKey;
      } else if (llmProvider === 'Anthropic') {
        secrets['ANTHROPIC_API_KEY'] = apiKey;
      }
      // Add more providers as needed
    }
    // Add Discord credentials if filled
    if (filledStatus['discord']) {
      secrets['DISCORD_API_TOKEN'] = platformCredentials['discord'].apiToken;
      secrets['DISCORD_APPLICATION_ID'] =
        platformCredentials['discord'].applicationId;
    }

    // Add Twitter credentials if filled
    if (filledStatus['twitter']) {
      secrets['TWITTER_ENABLE_POST_GENERATION'] =
        platformCredentials['twitter'].enablePostGeneration;
      secrets['TWITTER_USERNAME'] = platformCredentials['twitter'].username;
      secrets['TWITTER_PASSWORD'] = platformCredentials['twitter'].password;
      secrets['TWITTER_EMAIL'] = platformCredentials['twitter'].password;
    }

    // Add Telegram credentials if filled
    if (filledStatus['telegram']) {
      secrets['TELEGRAM_BOT_TOKEN'] = platformCredentials['telegram'].botToken;
      // secrets["TELEGRAM_USERNAME"] = platformCredentials["telegram"].username;
      // secrets["TELEGRAM_PASSWORD"] = platformCredentials["telegram"].password;
    }

    // Add Farcaster credentials if filled
    if (filledStatus['farcaster']) {
      secrets['FARCASTER_FID'] = platformCredentials['farcaster'].fid;
      secrets['FARCASTER_NEYNAR_API_KEY'] =
        platformCredentials['farcaster'].neynarApiKey;
      secrets['FARCASTER_NEYNAR_SIGNER_UUID'] =
        platformCredentials['farcaster'].neynarSignerUuid;
    }

    // Add Solana config if filled
    if (
      solanaConfig.birdeyeApiKey &&
      solanaConfig.solPrivateKey &&
      solanaConfig.solPublicKey
    ) {
      secrets['SOLANA_BIRDEYE_API_KEY'] = solanaConfig.birdeyeApiKey;
      secrets['SOLANA_PRIVATE_KEY'] = solanaConfig.solPrivateKey;
      secrets['SOLANA_PUBLIC_KEY'] = solanaConfig.solPublicKey;
    }

    return secrets;
  };
  const secretkeys = buildSecretkeys();

  //character json for eliza agent creation
  let character = {
    name: tokenName,
    plugins: [
      '@elizaos/plugin-sql',
      '@elizaos/plugin-solana',
      ...(llmProvider == 'OpenAI' && apiKey ? ['@elizaos/plugin-openai'] : []),
      ...(llmProvider == 'Anthropic' && apiKey
        ? ['@elizaos/plugin-anthropic']
        : []),
      ...(!apiKey && !llmProvider ? ['@elizaos/plugin-local-ai'] : []),
      ...(filledStatus['discord'] ? ['@elizaos/plugin-discord'] : []),
      ...(filledStatus['twitter'] ? ['@elizaos/plugin-twitter'] : []),
      ...(filledStatus['telegram'] ? ['@elizaos/plugin-telegram'] : []),
      ...(filledStatus['farcaster'] ? ['@elizaos/plugin-farcaster'] : []),
    ],
    settings: {
      avatar: avatar,
      USE_LOCAL_AI: !apiKey && !llmProvider,
      USE_STUDIOLM_TEXT_MODELS: false,

      STUDIOLM_SERVER_URL: 'http://localhost:1234',
      STUDIOLM_SMALL_MODEL: 'lmstudio-community/deepseek-r1-distill-qwen-1.5b',
      STUDIOLM_MEDIUM_MODEL: 'deepseek-r1-distill-qwen-7b',
      STUDIOLM_EMBEDDING_MODEL: false,

      secrets: secretkeys,
    },
    system: 'A friendly, helpful community manager and member of the team.',
    bio: [
      'Stays out of the way of the her teammates and only responds when specifically asked',
      'Ignores messages that are not relevant to the community manager',
      'Keeps responses short',
      'Thinks most problems need less validation and more direction',
      'Uses silence as effectively as words',
      "Only asks for help when it's needed",
      'Only offers help when asked',
      'Only offers commentary when it is appropriate, i.e. when asked',
    ],
    messageExamples: [
      [
        {
          name: '{{name1}}',
          content: {
            text: 'This user keeps derailing technical discussions with personal problems.',
          },
        },
        {
          name: tokenName,
          content: {
            text: 'DM them. Sounds like they need to talk about something else.',
          },
        },
        {
          name: '{{name1}}',
          content: {
            text: 'I tried, they just keep bringing drama back to the main channel.',
          },
        },
        {
          name: tokenName,
          content: {
            text: "Send them my way. I've got time today.",
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: 'The #dev channel is getting really toxic lately.',
          },
        },
        {
          name: tokenName,
          content: {
            text: 'Been watching that. Names in DM?',
          },
        },
        {
          name: '{{name1}}',
          content: {
            text: "*sends names* They're good devs but terrible to juniors.",
          },
        },
        {
          name: tokenName,
          content: {
            text: "Got it. They're hurting and taking it out on others.",
          },
        },
        {
          name: '{{name1}}',
          content: {
            text: 'Should we ban them?',
          },
        },
        {
          name: tokenName,
          content: {
            text: "Not yet. Let me talk to them first. They're worth saving.",
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: "I can't handle being a mod anymore. It's affecting my mental health.",
          },
        },
        {
          name: tokenName,
          content: {
            text: 'Drop the channels. You come first.',
          },
        },
        {
          name: '{{name1}}',
          content: {
            text: "But who's going to handle everything?",
          },
        },
        {
          name: tokenName,
          content: {
            text: "We will. Take the break. Come back when you're ready.",
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: "Should we ban this person? They're not breaking rules but creating drama.",
          },
        },
        {
          name: tokenName,
          content: {
            text: 'Give them a project instead. Bored people make trouble.',
          },
        },
        {
          name: '{{name1}}',
          content: {
            text: 'Like what?',
          },
        },
        {
          name: tokenName,
          content: {
            text: 'Put them in charge of welcoming newbies. Watch them change.',
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: "I'm getting burned out trying to keep everyone happy.",
          },
        },
        {
          name: tokenName,
          content: {
            text: "That's not your job. What do you actually want to do here?",
          },
        },
        {
          name: '{{name1}}',
          content: {
            text: 'I just want to code without all the drama.',
          },
        },
        {
          name: tokenName,
          content: {
            text: "Then do that. I'll handle the people stuff.",
          },
        },
        {
          name: '{{name1}}',
          content: {
            text: 'Just like that?',
          },
        },
        {
          name: tokenName,
          content: {
            text: 'Just like that. Go build something cool instead.',
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: 'Hey everyone, check out my new social media growth strategy!',
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: 'What do you think about the latest token price action?',
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: 'Can someone help me set up my Twitter bot?',
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: 'Does this marketing copy comply with SEC regulations?',
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: 'We need to review our token distribution strategy for compliance.',
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: "What's our social media content calendar looking like?",
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: 'Should we boost this post for more engagement?',
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
      [
        {
          name: '{{name1}}',
          content: {
            text: "I'll draft a clean announcement focused on capabilities and vision. Send me the team details and I'll have something for review in 30.",
          },
        },
        {
          name: tokenName,
          content: {
            text: '',
            actions: ['IGNORE'],
          },
        },
      ],
    ],
    style: {
      all: [
        'Keep it short, one line when possible',
        'No therapy jargon or coddling',
        'Say more by saying less',
        'Make every word count',
        'Use humor to defuse tension',
        'End with questions that matter',
        'Let silence do the heavy lifting',
        'Ignore messages that are not relevant to the community manager',
        'Be kind but firm with community members',
        'Keep it very brief and only share relevant details',
        'Ignore messages addressed to other people.',
      ],
      chat: [
        "Don't be annoying or verbose",
        'Only say something if you have something to say',
        "Focus on your job, don't be chatty",
        "Only respond when it's relevant to you or your job",
      ],
    },
  };

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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    setCreatedCoinId('');

    // if (status !== 'authenticated') {
    //   //   setError(t('mustBeLoggedInToCreateCoin'));
    //   toast.info(t('mustBeLoggedInToCreateCoin'));
    //   setLoading(false);
    //   return;
    // }

    // // Validate required fields (same validations as before)
    // if (!tokenName) {
    //   setError(t('pleaseEnterCoinName'));
    //   window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    //   setLoading(false);
    //   return;
    // }
    // if (!tokenTicker) {
    //   setError(t('pleaseEnterTicker'));
    //   window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    //   setLoading(false);
    //   return;
    // }
    // if (!avatar) {
    //   setError(t('pictureFileRequired'));
    //   window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    //   setLoading(false);
    //   return;
    // }
    // if (!description || description.replace(/<[^>]+>/g, '').trim() === '') {
    //   setError(t('pleaseEnterDescription'));
    //   window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    //   setLoading(false);
    //   return;
    // }

    // Validate platform credentials
    for (const platform of selectedPlatforms) {
      const credentials = platformCredentials[platform];
      const platformConfig =
        apiConfigData[platform.toLowerCase() as keyof typeof apiConfigData];

      if (!credentials || !platformConfig) {
        setError(`Please fill in all required fields for ${platform}.`);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
        setLoading(false);
        return;
      }

      for (const [field, config] of Object.entries(platformConfig)) {
        if (
          config.value !== false && // Skip boolean fields if they are optional
          !credentials[field as keyof typeof credentials]
        ) {
          setError(`Please fill in the ${field} field for ${platform}.`);
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
          setLoading(false);
          return;
        }
      }
    }
    // Validate Solana config fields
    if (
      !solanaConfig.birdeyeApiKey.trim() ||
      !solanaConfig.solPrivateKey.trim() ||
      !solanaConfig.solPublicKey.trim()
    ) {
      setError('Please fill in all Solana configuration fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Append picture file
    if (avatar) {
      data.append('pictureFile', avatar);
    }

    // Append selected LLM provider
    if (llmProvider) {
      data.append('llmProvider', llmProvider);
    }

    // Append selected platforms and their credentials
    // if (selectedPlatforms.length > 0) {
    //   data.append('selectedPlatforms', JSON.stringify(selectedPlatforms));
    //   selectedPlatforms.forEach((platform) => {
    //     const credentials = platformCredentials[platform];
    //     if (credentials) {
    //       Object.keys(credentials).forEach((field) => {
    //         const key = field as keyof typeof credentials; // Explicitly casting field
    //         if (credentials[key]) {
    //           data.append(
    //             `platformCredentials.${platform}.${field}`,
    //             credentials[key]!
    //           );
    //         }
    //       });
    //     }
    //   });
    // }

    // Append chain selection
    const chainSelection = 'Sol';
    data.append('blockchain', chainSelection);

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

      // Step 2: Proceed with agent creation on Eliza
      const characterData = JSON.stringify({ characterJson: character });
      let elizaAgentId = ''; // Initialize elizaAgentId
      console.log('Character Data:', characterData);
      console.log('Eliza avatar:', avatar);

      let configAgent = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://173.208.161.187:3001/api/agents/',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: JSON.stringify(character),
      };

      await axios
        .request(configAgent)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          elizaAgentId = response.data.id;
          if (!elizaAgentId) {
            setError(
              'An Agent already exists with this name, please use another name.'
            );
            throw new Error('Failed to create Agent');
          }
          // Proceed to start the agent on eliza
          axios.post(
            `http://173.208.161.187:3000/api/agents/${response.data.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          );
        })

        .catch((error) => {
          console.log(error);
          throw new Error('Failed to create Agent');
        });

      //proceed to create agent room on eliza
      const serverId = uuidv4();
      const worldId = uuidv4();

      const groupPayload = {
        name: tokenName,
        worldId: worldId,
        source: 'client',
        agentIds: [elizaAgentId],
      };

      let configRoom = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://173.208.161.187:3000/api/agents/groups/${serverId}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: JSON.stringify(groupPayload),
      };
      await axios.request(configRoom).then((roomResponse) => {
        console.log(JSON.stringify(roomResponse.data));
        const agentRoomId = roomResponse.data.id;
        if (!agentRoomId) {
          setError('Failed to create Agent chat room, please try again');
          throw new Error('Failed to create Agent');
        }
        // Set the agentRoomId in zustand store
         setAgentRoomId(agentRoomId); // <-- Set global state
      });
      
      // Step 3: Proceed with token creation prisma database

      // const response = await axios.post('/api/coins', data, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // const createdCoin = response.data.coin;

      // if (!createdCoin.id) {
      //   throw new Error(t('coinIdNotFound'));
      // }

      // setSuccess(true);
      // setCreatedCoinId(createdCoin.id);

      // Show toast notification
      toast.success(t('coinSuccessfullyCreated'));

      // Redirect to the newly created coin's page after a short delay
      // setTimeout(() => {
      //   router.push(`/coin/${createdCoin.id}`);
      // }, 3000); // 3-second delay
      setTimeout(() => {
        router.push(`/coin/1`);
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

  const handleExecutePumpFunAction = async () => {
    const pumpFunActionData: PumpFunActionData = {
      tokenName: tokenName,
      tokenTicker: tokenTicker,
      initialSupply: 1000000,
    };

    try {
      const success = await executePumpFunAction(pumpFunActionData);
      if (success) {
        toast.success(
          `Token ${tokenName} with ticker ${tokenTicker} created on Pump.fun.`
        );
      } else {
        toast.error('Failed to execute Pump.fun action');
      }
    } catch (error: any) {
      setError(error.message);
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

  //verify YOZOON balance on component mount
  useEffect(() => {
    const verifyYozoonBalance = async () => {
      setIsVerifying(true);
      try {
        // Replace with actual wallet address retrieval logic
        const walletAddress = 'YOUR_WALLET_ADDRESS';
        const balance = await getYozoonBalance(walletAddress);
        setYozoonBalance(balance.balance);

        // Check if the balance meets the minimum requirement (e.g., 1000 YOZOON)
        const minimumYozoonRequired = 1000;
        setHasSufficientYozoon(balance.balance >= minimumYozoonRequired);
      } catch (error: any) {
        setError(error.message);
        setHasSufficientYozoon(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyYozoonBalance();
  }, [toast]);

  const handlePlatformChange = (platform: string) => {
    setError('');
    setSelectedPlatforms((prevPlatforms) => {
      // If the platform is already selected, do nothing
      if (prevPlatforms.includes(platform)) {
        return prevPlatforms;
      }
      // Otherwise, add the platform to the selectedPlatforms list
      return [...prevPlatforms, platform];
    });
  };

  const handleCredentialChange = (
    platform: string,
    field: string,
    value: string | boolean | number
  ) => {
    setError('');
    setPlatformCredentials((prevCredentials: any) => ({
      ...prevCredentials,
      [platform]: {
        ...(prevCredentials[platform] || {}),
        [field]: value,
      },
    }));
    // console.log('Platform Credentials:', platformCredentials);
  };

  const handleSolanaConfigChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setError('');
    setSolanaConfig((prevConfig) => ({
      ...prevConfig,
      [field]: value,
    }));
  };

  useEffect(() => {
    const checkPlatformCredentials = () => {
      selectedPlatforms.forEach((platform) => {
        const credentials = platformCredentials[platform];
        let isFilled = false;
        if (platform === 'Twitter' || platform === 'Telegram') {
          isFilled = !!credentials?.apiKey;
        } else if (platform === 'Discord') {
          isFilled =
            !!credentials?.apiKey &&
            !!credentials?.username &&
            !!credentials?.password;
        } else if (platform === 'Lens' || platform === 'Farcaster') {
          isFilled = !!credentials?.username;
        } else if (platform === 'Slack') {
          isFilled = !!credentials?.apiKey;
        }
        filledStatus[platform] = isFilled;
      });
      // Only update if the filled status has actually changed.
      if (
        JSON.stringify(filledStatus) !==
        JSON.stringify(platformCredentialsFilled)
      ) {
        setPlatformCredentialsFilled(filledStatus);
      }
    };
    checkPlatformCredentials();
  }, [selectedPlatforms, platformCredentials]);

  const handleClearPlatformCredentials = (platform: string) => {
    // Clear the platform's credentials
    setPlatformCredentials((prevCredentials: any) => {
      const updatedCredentials = { ...prevCredentials };
      delete updatedCredentials[platform]; // Remove the platform's credentials
      return updatedCredentials;
    });

    // Mark the platform as not filled
    setPlatformCredentialsFilled((prevFilled) => ({
      ...prevFilled,
      [platform]: false,
    }));

    // Remove the platform from the selectedPlatforms state
    setSelectedPlatforms((prevPlatforms) =>
      prevPlatforms.filter((p) => p !== platform)
    );

    // Show a success toast message
    toast.success(`${platform} credentials cleared.`);
  };

  return (
    <div className="container mx-auto max-w-full md:max-w-5xl">
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
        <div className="bg-[#1E2329CC] bg-opacity-80 rounded-[40px] border-[2px] py-5 border-[#4B4B4B] shadow-lg  w-full mx-4 sm:mx-0">
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

          <Accordion type="single" collapsible className="px-4 py-2">
            {/* <div className="mb-4 flex items-center justify-between">
              <Label htmlFor="mode-switch">Mode:</Label>
              <div className="space-x-2">
                <span>No Code</span>
                <Switch
                  id="mode-switch"
                  checked={mode === 'Expert'}
                  onCheckedChange={(checked) =>
                    setMode(checked ? 'Expert' : 'NoCode')
                  }
                />
                <span>Expert</span>
              </div>
            </div> */}
            <AccordionItem value="agent-identity">
              <AccordionTrigger className=" text-2xl font-bold ">
                Agent Identity
              </AccordionTrigger>
              <AccordionContent>
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
                    {/* <FileUpload onFileUpload={handleFileUpload} />
                     */}
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
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
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
                      maxLength={500}
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
                    <label
                      htmlFor="hashtags"
                      className="block font-semibold mb-2"
                    >
                      {t('hashtags')}:{' '}
                      <Tooltip message={t('hashtagsTooltip')} />
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
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="yozoon-ai-logic">
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

                  <div className="mb-6 relative group">
                    <Label htmlFor="llm-provider">
                      External LLM Provider{' '}
                      <span className="text-sm text-gray-500">(optional)</span>:
                      <Tooltip message="Select External LLM Agent will make use of" />
                    </Label>
                    <Select onValueChange={setLlmProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OpenAI">OpenAI</SelectItem>
                        {/* <SelectItem value="Deepseek">Deepseek</SelectItem> */}
                        <SelectItem value="Anthropic">Anthropic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-6 relative group">
                    <Label htmlFor="api-key">
                      LLM API Key:{' '}
                      <Tooltip message="Add API key for the selected LLM your Agent will make use of" />
                    </Label>
                    <Input
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                      placeholder="Enter LLM API Key"
                      type="password"
                      id="api-key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  {mode === 'Expert' && (
                    <div className="mb-6 relative group">
                      <Label htmlFor="override-switch">
                        Override YOZOON AI Logic
                      </Label>
                      <Switch id="override-switch" />
                    </div>
                  )}
                  <div>
                    {isVerifying ? (
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
                        <AlertTitle>ML Features Enabled</AlertTitle>
                        <AlertDescription>
                          You hold sufficient YOZOON tokens for ML features.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        <AlertTitle>
                          Hold YOZOON tokens for ML features
                        </AlertTitle>
                        <AlertDescription>
                          Ensure your wallet maintains the required YOZOON token
                          value to unlock advanced ML tools.{' '}
                          <a href="#" className="underline">
                            Purchase YOZOON
                          </a>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="technical-configuration">
              <AccordionTrigger className="text-2xl font-bold">
                Technical Configuration
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div className="mb-6 mt-2 relative group">
                    <Label>
                      Platforms:{' '}
                      <span className="z-50 text-sm text-[#9CA3AF]">
                        <FaInfoCircle className="inline text-[#9CA3AF] ml-1 cursor-pointer" />{' '}
                        (Add social media accounts your Agent will operate)
                        {/* <Tooltip message="Add social media accounts your Agent will operate" /> */}
                      </span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Twitter',
                        'Telegram',
                        'Discord',
                        // 'Lens',
                        'Farcaster',
                        // 'Slack',
                      ].map((platform) => (
                        <Button
                          key={platform}
                          onClick={() => handlePlatformChange(platform)}
                          className={`relative hover:bg-[#FFB92D] ${
                            selectedPlatforms.includes(platform)
                              ? 'bg-[#FFB92D]' // Background color for selected platforms
                              : '' // Background color for unselected platforms
                          }`}
                        >
                          {platform}
                          {selectedPlatforms.includes(platform) &&
                            platformCredentialsFilled[platform] && (
                              <CircleCheck className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {selectedPlatforms.map((platform) => (
                    <div
                      key={platform}
                      className="mt-4 relative border border-gray-600 rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-lg mb-4">
                        {platform} Credentials
                      </h3>
                      {Object.entries(
                        apiConfigData[
                          platform.toLowerCase() as keyof typeof apiConfigData
                        ] || {}
                      ).map(([field, config]) => (
                        <div key={field} className="mb-6 relative group">
                          <Label htmlFor={`${platform}-${field}`}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                            {config.tooltip && (
                              <Tooltip message={config.tooltip} />
                            )}
                          </Label>
                          {typeof config.value === 'boolean' ? (
                            // Boolean field (render as a checkbox or toggle)
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`${platform}-${field}`}
                                checked={
                                  platformCredentials[platform]?.[
                                    field as keyof typeof platform
                                  ] || false
                                }
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleCredentialChange(
                                    platform,
                                    field,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span>{config.tooltip}</span>
                            </div>
                          ) : typeof config.value === 'number' ? (
                            // Numeric field (render as a number input)
                            <Input
                              className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                              type="number"
                              id={`${platform}-${field}`}
                              placeholder={config.placeholder || ''}
                              value={
                                platformCredentials[platform]?.[field] || ''
                              }
                              onChange={(e) =>
                                handleCredentialChange(
                                  platform,
                                  field,
                                  parseInt(e.target.value, 10)
                                )
                              }
                            />
                          ) : (
                            // Text or password field (default)
                            <Input
                              className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm"
                              type={
                                field.toLowerCase().includes('password') ||
                                field.toLowerCase().includes('key') ||
                                field.toLowerCase().includes('secret')
                                  ? 'password'
                                  : 'text'
                              }
                              id={`${platform}-${field}`}
                              placeholder={config.placeholder || ''}
                              value={
                                platformCredentials[platform]?.[field] || ''
                              }
                              onChange={(e) =>
                                handleCredentialChange(
                                  platform,
                                  field,
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </div>
                      ))}
                      {/* Add Delete Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleClearPlatformCredentials(platform)
                          }
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* //code for shceduling with calendar */}
                {/* 

          <div>
            <Label>Scheduling</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>} 
                  
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow-sm"
                  disabled={(date: Date) => date > new Date() || date < new Date("2025-01-01")} /> 
              </PopoverContent>
            </Popover>
          </div> */}

                <div className="mt-10 relative group">
                  <Label htmlFor="chain-selection">Chain Selection</Label>
                  <Select>
                    <SelectTrigger id="chain-selection">
                      <SelectValue placeholder="Select a chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem defaultChecked value="Solana">
                        Solana
                      </SelectItem>
                      {/* <SelectItem value="EVM">EVM</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-2 relative space-y-5">
                  <div>
                    <Label htmlFor="sol-plubic-key">
                      Solana Wallet Address:{' '}
                      <Tooltip message="Fill in your wallet address" />
                    </Label>
                    <Input
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                      placeholder="Enter Wallet Address"
                      id="sol-plubic-key"
                      value={solanaConfig.solPublicKey}
                      onChange={(e) => (
                        setError(''),
                        setSolanaConfig((prev) => ({
                          ...prev,
                          solPublicKey: e.target.value,
                        }))
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sol-private-key">
                      Solana Private Key:{' '}
                      <Tooltip message="Fill in Private key from your wallet" />
                    </Label>
                    <Input
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                      placeholder="Enter Private Key"
                      id="sol-private-key"
                      value={solanaConfig.solPrivateKey}
                      onChange={(e) => (
                        setError(''),
                        setSolanaConfig((prev) => ({
                          ...prev,
                          solPrivateKey: e.target.value,
                        }))
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birdeye-api-key">
                      Birdeye API Key:{' '}
                      <Tooltip message="Insert your Birdeye API key." />
                    </Label>
                    <Input
                      className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
                      placeholder="Enter Private Key"
                      id="birdeye-api-key"
                      value={solanaConfig.birdeyeApiKey}
                      onChange={(e) => (
                        setError(''),
                        setSolanaConfig((prev) => ({
                          ...prev,
                          birdeyeApiKey: e.target.value,
                        }))
                      )}
                    />
                    <p className="text-xs text-gray-600 p-1">
                      You can create one{' '}
                      <a
                        href="https://docs.birdeye.so/docs/authentication-api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        here.
                      </a>
                    </p>
                  </div>
                </div>

                {/* <div className="mb-6 relative group">
                  <Label htmlFor="marketplace-plugins">
                    Marketplace Plugins
                  </Label>
                  <Select
                    //   multiple

                    onValueChange={(values: any) => {
                      setIsPumpFunPluginEnabled(
                        values.includes('Pump.fun Plugin')
                      );
                    }}
                  >
                    <SelectTrigger id="marketplace-plugins">
                      <SelectValue placeholder="Select plugins" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pump.fun Plugin">
                        Pump.fun Plugin
                      </SelectItem>
                      <SelectItem value="DAO Governance Plugin">
                        DAO Governance Plugin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isPumpFunPluginEnabled && (
                  <Button onClick={handleExecutePumpFunAction}>
                    Execute Pump.fun Action
                  </Button>
                )} */}
              </AccordionContent>
            </AccordionItem>

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
            <div className="flex flex-col items-center justify-center mt-3">
              <button
                onClick={() => handleSubmit()}
                className="w-full cursor-pointer py-2 px-4 bg-[#FFB92D] text-white font-semibold rounded-md shadow hover:bg-[#c28407] md:w-1/2 md:mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFB92D]"
                disabled={
                  !hasSufficientYozoon || isVerifying || loading || error != ''
                }
              >
                Create Agent
              </button>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
