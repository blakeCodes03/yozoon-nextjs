import React, { useEffect, useState } from 'react';
// client-only page (no server-side data fetching during build)
import { useRouter } from 'next/router';
import CoinInfo from '@/components/pages/CoinPage/CoinInfo';
import Spinner from '@/components/common/Spinner';
import Head from 'next/head';
import axios from 'axios';

// using shared prisma client from src/lib/prisma

interface CoinPageProps {
  coin?: any; // optional
}

const CoinPage: React.FC<CoinPageProps> = () => {
  const router = useRouter();
  const { id } = router.query; // Get the memecoin ID from the URL

  const [coin, setCoin] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchCoin = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`/api/coins/${id}`);
        if (cancelled) return;
        const coinData = resp.data.coin;
        if (!coinData) {
          setNotFound(true);
          setCoin(null);
        } else {
          setCoin(coinData);
          setNotFound(false);
        }
      } catch (err) {
        console.error('Error fetching coin:', err);
        setNotFound(true);
        setCoin(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCoin();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner />;
  if (notFound) return <div>Coin not found</div>;

  return (
    <div>
      <Head>
        <title>{coin?.name ? `${coin.name} - Yozoon` : 'Coin - Yozoon'}</title>
        <meta name="description" content={coin?.description || ''} />
        <meta
          property="og:title"
          content={`${coin?.name || 'Coin'} - Yozoon`}
        />
        <meta property="og:description" content={coin?.description || ''} />
        <meta property="og:image" content={coin?.pictureUrl || ''} />
        <meta property="og:url" content={`https://yozoon.com/coin/${id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <CoinInfo coinData={coin} />
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
