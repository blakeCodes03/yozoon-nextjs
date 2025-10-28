import { createConfig } from 'wagmi';
import { mainnet, sepolia, optimism, polygon, bsc } from 'wagmi/chains';
import { http } from 'viem';

const chains = [mainnet, sepolia, optimism, polygon, bsc];

const transports = {
  [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ''}`),
  [optimism.id]: http('https://mainnet.optimism.io'),
  [polygon.id]: http('https://polygon-rpc.com'),
  [bsc.id]: http('https://bsc-dataseed.binance.org/'),
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ''}`),
};

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports,
});

export { chains };