// src/pages/coin/[id].tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import CoinDetails from '../../components/pages/CoinPage/CoinDetails';
import { PrismaClient } from "@/generated/prisma";

import Head from 'next/head';

const prisma = new PrismaClient();

interface CoinPageProps {
  coin: any; // Adjust as needed
}

const CoinPage: React.FC<CoinPageProps> = ({ coin }) => {
  return (
    <>
      <Head>
        <title>{coin.name} - Meme Launchpad</title>
        <meta name="description" content={coin.description} />
        <meta property="og:title" content={`${coin.name} - Meme Launchpad`} />
        <meta property="og:description" content={coin.description} />
        <meta property="og:image" content={coin.pictureUrl} />
        <meta property="og:url" content={`https://www.memelaunchpad.com/coin/${coin.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <CoinDetails coin={coin} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  const coin = await prisma.coin.findUnique({
    where: { id: id as string },
    include: {
      chatMessages: true,
      bondingCurve: { include: { feeStructure: true } },      
      creator: {
        select: {
          username: true,
          pictureUrl: true,
        },
      },
    },
  });

  if (!coin) {
    return {
      notFound: true,
    };
  }

  // Convert BigInt and Decimal fields to numbers for serialization
  const coinData = {
    ...coin,
    totalSupply: Number(coin.totalSupply),
    airdropAmount: Number(coin.airdropAmount),
    marketCap: Number(coin.marketCap),
    holders: await prisma.tokenHolding.count({
      where: {
        coinId: id as string,
        amount: {
          gt: 0,
        },
      },
    }),
    chatMessages: coin.chatMessages.length,
  };

  return {
    props: {
      coin: JSON.parse(JSON.stringify(coinData)),
    },
  };
};

export default CoinPage;
