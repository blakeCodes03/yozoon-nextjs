# Yozoon Protocol Frontend Services

This directory contains TypeScript service modules that provide a clean abstraction layer for integrating with the Yozoon protocol from frontend applications.

## Service Overview

| Service | File | Description |
|---------|------|-------------|
| `connectionService` | `connection-service.ts` | Manages Solana connections, wallet integration, and PDA derivations |
| `tokenCreationService` | `token-creation-service.ts` | Handles the two-step user token creation process |
| `tokenTradingService` | `token-trading-service.ts` | Provides buy/sell operations for both YOZOON and user tokens |
| `referralService` | `referral-service.ts` | Manages the referral system (setting/getting referrers) |
| `priceService` | `price-service.ts` | Calculates token prices and estimates trade outcomes |
| `migrationService` | `migration-service.ts` | Detects and monitors Raydium migration events |

## Integration Example

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { 
  connectionService, 
  tokenCreationService,
  tokenTradingService,
  priceService 
} from '../services';

function YourComponent() {
  const { connected, publicKey, wallet } = useWallet();
  
  useEffect(() => {
    if (connected && wallet) {
      // Configure and connect wallet
      connectionService.connectWallet(wallet);
      
      // Now you can use other services
      const getPrice = async () => {
        const price = await priceService.getYozoonTokenPrice();
        console.log(`Current YOZOON price: ${price} SOL`);
      };
      
      getPrice();
    }
  }, [connected, wallet, publicKey]);

  // Component JSX
}
```

## Architecture

All services follow the singleton pattern for consistent state management and are exported through a unified `index.ts` for clean imports. Services are designed to be modular, allowing you to use only what you need for specific frontend features.

## Usage Guidelines

1. Always connect the wallet first using `connectionService` before using other services
2. Handle errors appropriately for all service method calls
3. Use loading states to provide feedback during asynchronous operations
4. Wait for transaction confirmations before updating UI state

Refer to each service file for detailed API documentation.
