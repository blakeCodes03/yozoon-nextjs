import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import { mockMemecoins } from "../../components/ui/TrendingSectionTable"; // Import mock data
import CoinInfo from "@/components/pages/CoinPage/CoinInfo";
import Spinner from "@/components/common/Spinner";
import { PrismaClient } from "@/generated/prisma";

import Head from 'next/head';


const prisma = new PrismaClient();



interface CoinPageProps {
  coin: any; // Adjust as needed
}

const CoinPage: React.FC<CoinPageProps> = ({ coin }) => {

  //!!uncomment for actual data
  // return (
  //   <>
  //     <Head>
  //       <title>{coin.name} - Yozoon</title>
  //       <meta name="description" content={coin.description} />
  //       <meta property="og:title" content={`${coin.name} - Yozoon`} />
  //       <meta property="og:description" content={coin.description} />
  //       <meta property="og:image" content={coin.pictureUrl} />
  //       <meta property="og:url" content={`https://yozoon.com/coin/${coin.id}`} />
  //       <meta name="twitter:card" content="summary_large_image" />
  //     </Head>
  //     <CoinInfo coinData={coin} />
  //   </>
  // );
  

  // //mock data used here
  // const router = useRouter();
  // const { id } = router.query; // Get the memecoin ID from the URL



  // // Fetch the memecoin data based on the ID (mock data used here)
  // const coinData = mockMemecoins; // Replace this with actual data fetching logic
  // const selectedCoin = coinData.find((coin) => coin.id === id);

  if (!coin) {
    return <Spinner/>; // Show a loading state if data is not available
  }

  return (
    <div>
      {/* Pass the coin data to the CoinInfo component */}
      <CoinInfo coinData={coin} />
    </div>
  );
};

//!!uncomment for actual data fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  const coin = await prisma.coin.findUnique({
    where: { contractAddress: id as string },
    include: {
      chatMessages: true,
      bondingCurve: { include: { feeStructure: true } },      
      creator: {
        select: {
          username: true,
          pictureUrl: true,
        },
      },
      priceHistory: {
      orderBy: { timestamp: 'asc' },
      select: { price: true, timestamp: true },
    },
    },
  });

  if (!coin) {
    return {
      notFound: true,
    };
  }

  const priceHistory = coin.priceHistory.map((entry) => ({
  price: Number(entry.price),
  timestamp: entry.timestamp.toISOString(),
}));

  // Convert BigInt and Decimal fields to numbers for serialization
  const coinData = {
    ...coin,
    totalSupply: Number(coin.totalSupply),
    airdropAmount: Number(coin.airdropAmount),
    priceHistory,
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