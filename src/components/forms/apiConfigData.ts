// Description: This file contains the API configuration data for creating Eliza agents.
export const apiConfigData = {
  discord: {
    applicationId: {
      value: '', // DISCORD_APPLICATION_ID
      tooltip: 'Enter the Discord Application ID.',
      placeholder: 'e.g., 123456789012345678',
    },
    apiToken: {
      value: '', // DISCORD_API_TOKEN
      tooltip: 'Enter the Discord Bot Token.',
      placeholder: 'e.g., your_bot_token_here',
    },
    voiceChannelId: {
      value: '', // DISCORD_VOICE_CHANNEL_ID
      tooltip: 'Optional: Enter the ID of the voice channel the bot should join.',
      placeholder: 'e.g., 987654321098765432',
    },
  },
  farcaster: {
    fid: {
      value: '', // FARCASTER_FID
      tooltip: 'Enter the FID associated with the Farcaster account.',
      placeholder: 'e.g., 12345',
    },
    neynarApiKey: {
      value: '', // FARCASTER_NEYNAR_API_KEY
      tooltip: 'Enter your Neynar API Key. Get it from https://neynar.com/',
      placeholder: 'e.g., your_neynar_api_key_here',
    },
    neynarSignerUuid: {
      value: '', // FARCASTER_NEYNAR_SIGNER_UUID
      tooltip: 'Enter the Neynar Signer UUID for the account. Create one at https://dev.neynar.com/app',
      placeholder: 'e.g., your_signer_uuid_here',
    },
    dryRun: {
      value: false, // FARCASTER_DRY_RUN
      tooltip: 'Set to true to test without publishing casts.',
    },
    pollInterval: {
      value: 120, // FARCASTER_POLL_INTERVAL
      tooltip: 'Specify how often (in seconds) to check for interactions.',
      placeholder: 'e.g., 120',
    },
  },
  telegram: {
    botToken: {
      value: '', // TELEGRAM_BOT_TOKEN
      tooltip: 'Enter the Telegram Bot Token.',
      placeholder: 'e.g., your_bot_token_here',
    },
    // account: {
      phone: {
        value: '', // TELEGRAM_ACCOUNT_PHONE
        tooltip: 'Enter your phone number with the country code.',
        placeholder: 'e.g., +1234567890',
      },
      appId: {
        value: '', // TELEGRAM_ACCOUNT_APP_ID
        tooltip: 'Enter your Telegram API App ID. Get it from https://my.telegram.org/',
        placeholder: 'e.g., 12345',
      },
      appHash: {
        value: '', // TELEGRAM_ACCOUNT_APP_HASH
        tooltip: 'Enter your Telegram API App Hash. Get it from https://my.telegram.org/',
        placeholder: 'e.g., your_api_hash_here',
      },
      deviceModel: {
        value: '', // TELEGRAM_ACCOUNT_DEVICE_MODEL
        tooltip: 'Enter the device model to show in Telegram.',
        placeholder: 'e.g., Desktop',
      },
      systemVersion: {
        value: '', // TELEGRAM_ACCOUNT_SYSTEM_VERSION
        tooltip: 'Enter the system version to show in Telegram.',
        placeholder: 'e.g., 1.0',
      },
    // },
  },
  twitter: {
    dryRun: {
      value: false, // TWITTER_DRY_RUN
      tooltip: 'Set to true to test without publishing tweets.',
    },
    username: {
      value: '', // TWITTER_USERNAME
      tooltip: 'Enter the Twitter account username.',
      placeholder: 'e.g., your_username',
    },
    password: {
      value: '', // TWITTER_PASSWORD
      tooltip: 'Enter the Twitter account password.',
      placeholder: 'e.g., your_password',
    },
    email: {
      value: '', // TWITTER_EMAIL
      tooltip: 'Enter the email associated with the Twitter account.',
      placeholder: 'e.g., your_email@example.com',
    },
    twoFaSecret: {
      value: '', // TWITTER_2FA_SECRET
      tooltip: 'Enter the 2FA secret for the Twitter account.',
      placeholder: 'e.g., your_2fa_secret',
    },
  },
  lens: {
    address: {
      value: '', // LENS_ADDRESS
      tooltip: 'Enter the Lens account address.',
      placeholder: 'e.g., 0x1234567890abcdef',
    },
    privateKey: {
      value: '', // LENS_PRIVATE_KEY
      tooltip: 'Enter the private key for the Lens account.',
      placeholder: 'e.g., your_private_key_here',
    },
  },
};