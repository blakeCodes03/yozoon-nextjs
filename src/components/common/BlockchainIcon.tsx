// src/components/common/BlockchainIcon.tsx

import React from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'; // Import FaTimes for fallback

interface BlockchainIconProps {
  blockchain: string;
  size?: number; // optional size prop
  className?: string;
}

const blockchainIcons: { [key: string]: string } = {
  sol: '/assets/icons/solana.png',
  bnb: '/assets/icons/bnb.png',
  eth: '/assets/icons/ethereum.png',
  avax: '/assets/icons/avalanche.png',
  blast: '/assets/icons/blast.png',
  optimism: '/assets/icons/optimism.png',
  opbnb: '/assets/icons/opbnb.png',
  aptos: '/assets/icons/aptos.png',
  hbar: '/assets/icons/hbar.png',
  linear: '/assets/icons/linear.png',
};

const BlockchainIcon: React.FC<BlockchainIconProps> = ({ blockchain, size = 24, className }) => {
  const key = blockchain.toLowerCase();
  const iconSrc = blockchainIcons[key];

  if (!iconSrc) {
    return <FaTimes className={`text-red-500 ${className}`} size={size} />; // Display 'X' icon if blockchain is not recognized
  }

  return (
    <Image
      src={iconSrc}
      alt={blockchain}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }} // Updated to use style prop
    />
  );
};

export default BlockchainIcon;
