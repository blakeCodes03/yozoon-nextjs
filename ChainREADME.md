# This file contains details of areas for blockchain integration.


## Key features to implement:

- Buy Yozoon token
- Create user token
- Buy/sell user token
- Bonding curve progress
- referral tracking
- Agent token trades 
- DAO governance (possible implementation )

### Buy Yozoon token

`src\components\ui\BuyYozoon.tsx`

```typescript
const BuyYozoonToken: React.FC = () => {
  const [selectedSol, setSelectedSol] = useState<number | null>(null);
  const [yozoonBalance, setYozoonBalace] = useState(100); // yozoon token balance from wallet
  const [yozoonPrice, setYozoonPrice] = useState(0.01); // Yozoon token price from wallet
  const [solBalance, setSolBalance] = useState(10); // sol balance from wallet
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const solOptions = [0.1, 0.5, 1]; // Fixed SOL amounts
  const exchangeRate = 100; // 1 SOL = 100 Yozoon tokens, should be fetched

  useEffect(() => {
    //fetch current price of Yozoon token
    // fetch yozoon balance from wallet
  }, []);
};
```

### create user token

`src\components\forms\CreateAgentForm.tsx`

```typescript
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
```

### Buy/sell user token

`src\components\pages\CoinPage\CoinInfo.tsx`

```typescript
const [loading, setLoading] = useState<boolean>(true);
const agentRoomId = useAgentRoomStore((state) => state.agentRoomId); // Get the agent room ID from the store and use in iframe
const [solBalance, setSolBalance] = useState(100); // Example balance, should fetch real balance from wallet
const [agentTokenPrice, setAgentTokenPrice] = useState(0.05); // AI-agent token price in SOL
const [agentTokenBalance, setAgentTokenBalance] = useState(0); // AI-agent token balance in wallet
const [selectedBuySol, setSelectedBuySol] = React.useState(null);
const [selectedSellPercentage, setSelectedSellPercentage] =
  React.useState(null); //percentage of user's agent-token balance to sell
const [showModal, setShowModal] = React.useState(false);
const [modalType, setModalType] = React.useState('success');

const solOptions = [0.1, 0.5, 1]; // Quantity to buy in SOL [0.1 sol, 0.5 sol, 1 sol]
const percentageOptions = [25, 50, 75, 100]; // Percentage options for selling [25%, 50%, 75%, 100%]
```

### Bonding curve progress
Expected outcome:
1.Progress bar indicating the bonding curve progress.
2. The amount of SOL in the bonding curve.
`src\components\pages\CoinPage\CoinInfo.tsx`

```typescript
    useEffect(() => {
    //implement bonding curve progress logic here for agent token
  }, []);

```


### Referral tracking
Expected outcome:
1. set referrer logic
`src\pages\api\auth\signup.ts`

```typescript
// Handle referral association
    let referrerId: string | null = null;
    if (referralCodeFromURL) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referralCodeFromURL },
      });
      if (referrer) {
        referrerId = referrer.id;
        console.log(`Associated referrer ID: ${referrerId}`);
      } else {
        console.log('Invalid referral code provided.');
      }
    }
```

### Agent token trades
Expected outcome:
1. List of agent token trades with details:
    - transaction type: Buy/sell
    - wallet address
    - date
    - token quantity

`src\components\pages\CoinPage\CoinInfo.tsx`

```typescript
useEffect(() => {
    //retrieve agent token trades here.
  }, []);
```

### DAO governance
Expected outcome:
1. token holders create proposals for decision making by staking Yozoon tokens(e.g 1000 Yozoon)

`src\components\pages\CoinPage\CreateProposal.tsx`

```typescript
//implement staking logic here

    try {
      await axios.post(`/api/coins/${coinId}/proposals`, {
        title,
        description,
        date,
      });
      setDialogOpen(false); // Close the dialog after creating
      setSuccess(true);
      setTitle('');
      setDescription('');
      setSelected(undefined);
      window.location.reload(); // Reload the page to reflect the new proposal
    } catch (err: any) {
      setError('Failed to create proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  }; 

```

2. Users can vote on proposals by staking an amount of yozoon
`src\components\pages\CoinPage\ActiveProposal.tsx`

```typescript

const placeVote = async (proposalId: string, vote: number) => {
    setVoteLoading(true);
    setError('');

    // implement vote staking logic here 
    try {
      await axios.put(`/api/coins/${coinId}/proposals`, {
        proposalId,
        vote, // 1 for "for", -1 for "against"
        coinId,
      });
      // Refresh proposals after voting
      fetchProposals();
      setDialogOpen(false); // Close the dialog after voting
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place vote');
    } finally {
      setVoteLoading(false);
    }
  };


```

