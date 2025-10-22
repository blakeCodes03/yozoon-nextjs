import React from 'react';
// client-only page (no server-side data fetching during build)
import { useRouter } from 'next/router';
import { mockMemecoins } from '../../components/ui/TrendingSectionTable'; // Import mock data
import CoinInfo from '@/components/pages/CoinPage/CoinInfo';
import Spinner from '@/components/common/Spinner';
import Head from 'next/head';

// using shared prisma client from src/lib/prisma

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

  //mock data used here
  const router = useRouter();
  const { id } = router.query; // Get the memecoin ID from the URL

  // Fetch the memecoin data based on the ID (mock data used here)
  const coinData = mockMemecoins; // Replace this with actual data fetching logic
  const selectedCoin = coinData.find((coin) => coin.id === id);

  if (!coinData) {
    return <Spinner />; // Show a loading state if data is not available
  }

  return (
    <div>
      {/* Pass the coin data to the CoinInfo component */}
      <CoinInfo coinData={selectedCoin} />
    </div>
  );
};

// Server-side fetching is disabled in this build to avoid Prisma initialization errors.

//   const coin = await prisma.coin.findUnique({
//     where: { id: id as string },
//     include: {
//       chatMessages: true,
//       bondingCurve: { include: { feeStructure: true } },
//       creator: {
//         select: {
// id: true,
//           username: true,
//           pictureUrl: true,
//         },
//       },
//       priceHistory: {
//       orderBy: { timestamp: 'asc' },
//       select: { price: true, timestamp: true },
//     },
//     },
//   });

//   if (!coin) {
//     return {
//       notFound: true,
//     };
//   }

//   const priceHistory = coin.priceHistory.map((entry) => ({
//   price: Number(entry.price),
//   timestamp: entry.timestamp.toISOString(),
// }));

//   // Convert BigInt and Decimal fields to numbers for serialization
//   const coinData = {
//     ...coin,
//     totalSupply: Number(coin.totalSupply),
//     airdropAmount: Number(coin.airdropAmount),
//     priceHistory,
//     marketCap: Number(coin.marketCap),
//     holders: await prisma.tokenHolding.count({
//       where: {
//         coinId: id as string,
//         amount: {
//           gt: 0,
//         },
//       },
//     }),
//     chatMessages: coin.chatMessages.length,
//   };

//   return {
//     props: {
//       coin: JSON.parse(JSON.stringify(coinData)),
//     },
//   };
// };

export default CoinPage;
