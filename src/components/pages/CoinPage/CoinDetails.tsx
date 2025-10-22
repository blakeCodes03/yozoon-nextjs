// src/components/pages/CoinPage/CoinDetails.tsx

import React from 'react';
import VotingPage from './VotingPage';
import BondingCurvePage from './BondingCurvePage';
import Spinner from '../../common/Spinner';
import {
  FaGlobe,
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
} from 'react-icons/fa';
import BlockchainIcon from '../../common/BlockchainIcon';
import Image from 'next/image';
import CoinReplies from '../../ui/CoinReplies';

export interface Coin {
  id: string;
  name: string;
  ticker: string;
  description: string;
  pictureUrl: string;
  blockchain: string;
  socialLinks: Record<string, string>;
  marketCap: number;
  holders: number;
  chatMessages: number;
  createdAt?: string;
  status: string; // e.g., "voting", "bondingCurve", "completed"
  totalSupply: number;
  airdropAmount: number;
  teamMembers: TeamMember[];
  creator: {
    username: string;
    pictureUrl: string;
  };
  bondingCurve?: BondingCurve; // if exists
  vestingDetails?: VestingDetails; // assuming this field exists
}

interface TeamMember {
  id: string;
  username: string;
  avatarUrl?: string;
  displayName?: string;
}

interface BondingCurve {
  dexPoolLink?: string; // assuming this field exists
  // other fields as needed
}

interface VestingDetails {
  who: string;
  releaseDate: string;
  releasePercentage: number;
  staggered?: boolean;
  staggerIntervalDays?: number;
  staggerPercentage?: number;
}

interface CoinDetailsProps {
  coin: Coin;
}

const CoinDetails: React.FC<CoinDetailsProps> = ({ coin }) => {
  if (!coin) {
    return <Spinner />;
  }

  // Conditionally render based on coin status
  if (coin.status === 'voting') {
    return <VotingPage coin={coin} />;
  } else if (coin.status === 'bondingCurve') {
    return <BondingCurvePage coin={coin} />;
  } else if (coin.status === 'completed') {
    return (
      <div className="coin-detail-page">
        {/* Coin Header */}
        <header className="coin-header">
          <Image
            src={coin.pictureUrl}
            alt={coin.name}
            width={100}
            height={100}
            className="coin-image"
          />
          <div className="coin-info">
            <h1 className="coin-name">{coin.name}</h1>
            <p className="coin-ticker">Ticker: {coin.ticker}</p>
            <p className="blockchain-info">Blockchain: {coin.blockchain}</p>
            {/* Smart Contract Details (if any) */}
            {coin.bondingCurve?.dexPoolLink && (
              <p className="smart-contract-info">
                Smart Contract:{' '}
                <a
                  href={coin.bondingCurve.dexPoolLink}
                  className="text-neonBlue underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Contract
                </a>
              </p>
            )}
          </div>
        </header>

        {/* Social Links */}
        <section className="social-links">
          <div className="links">
            {coin.socialLinks.website && (
              <a
                href={coin.socialLinks.website}
                className="link-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                🌐 Website
              </a>
            )}
            {coin.socialLinks.twitter && (
              <a
                href={coin.socialLinks.twitter}
                className="link-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                🐦 Twitter
              </a>
            )}
            {coin.socialLinks.telegram && (
              <a
                href={coin.socialLinks.telegram}
                className="link-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                📢 Telegram
              </a>
            )}
            {coin.socialLinks.instagram && (
              <a
                href={coin.socialLinks.instagram}
                className="link-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                📸 Instagram
              </a>
            )}
          </div>
          <div className="social-stats">
            <p>
              Twitter Followers: {coin.socialLinks.twitter ? '10,450' : 'N/A'}
            </p>
            <p>
              Telegram Members: {coin.socialLinks.telegram ? '8,245' : 'N/A'}
            </p>
          </div>
        </section>

        {/* Performance Indicators */}
        <section className="performance">
          <div className="progress-bar">
            <p>Bonding Curve: 96%</p>
            <div className="bar">
              <span style={{ width: '96%' }}></span>
            </div>
          </div>
          <div className="king-of-the-hill">
            <p>King of the Hill: 100%</p>
            <div className="bar gold">
              <span style={{ width: '100%' }}></span>
            </div>
            <p className="badge">Crowned King on 11/28/2024, 9:34:57 AM</p>
          </div>
          <div className="bonding-info">
            <p>Total SOL in Bonding Curve: 71.331</p>
          </div>
        </section>

        {/* Market Stats */}
        <section className="market-stats">
          <div className="tradingview-chart">
            {/* Replace with actual TradingView embed */}
            <p>TradingView Chart: Embedded Here</p>
          </div>
          <div className="stats">
            <p className="market-cap">
              Market Cap: <strong>$97,034</strong>
            </p>
            <p>Chat Messages: 1,240</p>
            <p>Traders: 500</p>
            <p>Holders: 750</p>
          </div>
        </section>

        {/* Additional Sections */}
        <section className="additional-sections">
          {/* Holder Distribution */}
          <div className="holder-distribution">
            <h2>Holder Distribution</h2>
            <ul className="distribution-list">
              <li>0-100 SOL: 300 Holders</li>
              <li>101-500 SOL: 200 Holders</li>
              <li>501+ SOL: 250 Holders</li>
            </ul>
          </div>

          {/* Bubble Map */}
          <div className="bubble-map">
            <h2>Token Holders Distribution</h2>
            <p>Bubble Map Visualization Here</p>
          </div>

          {/* Vesting and Mining Pool Details */}
          <div className="vesting-mining">
            <h2>Vesting & Mining Pool Details</h2>
            <p>Vesting Schedule: 25% release every 6 months</p>
            <p>Mining Pool: Active</p>
          </div>
        </section>

        {/* Team Members */}
        {coin.teamMembers && coin.teamMembers.length > 0 && (
          <section className="team-members">
            <h2>Team Members</h2>
            <div className="flex flex-wrap">
              {coin.teamMembers.map((member) => (
                <div key={member.id} className="team-member-card">
                  <Image
                    src={member.avatarUrl || '/default-avatar.png'}
                    alt={member.displayName || member.username}
                    width={80}
                    height={80}
                    className="rounded-full mb-2"
                  />
                  <p className="text-center">
                    {member.displayName || member.username}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat Room */}
        <section className="chat-room">
          <CoinReplies coinId={coin.id} />
        </section>
      </div>
    );
  } else {
    return (
      <div className="coin-detail-page">
        <p>Unknown coin status.</p>
      </div>
    );
  }
};

export default CoinDetails;
