import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Spinner from '../common/Spinner';
import { mockMemecoins } from './TrendingSectionTable';
import { useRouter } from "next/router";
import SmallerLoaderSpin from '../common/SmallerLoaderSpin';


type Coin = {
  id: string;
  name: string;
  ticker: string;
  description: string;
  markwetCap: number;
  createdAt: string;
  pictureUrl: string;
  hashtags: { tag: string }[];
  creator: { username: string; pictureUrl: string }[];
};

const SearchCoins = () => {
  const [query, setQuery] = useState('');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();
  

  // Fetch coins from the API
  const fetchCoins = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/coins/search', {
        params: { query, page, pageSize: 12 },
      });
      setCoins((prev) => [...prev, ...response.data.coins]);
      setHasMore(response.data.coins.length > 0); // If no more results, stop fetching
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  }, [query, page, hasMore, loading]);

  const handleCardClick: any = (coinId: string) => {
    // router.push(`/coin/${coinId}`);
  };

  // Debounce the search query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCoins([]);
      setPage(1);
      setHasMore(true);
      fetchCoins();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { root: observerRef.current, threshold: 1.0 }
    );

    const target = document.querySelector('#load-more-trigger');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading]);

  return (
    
      <div className="  xs:col-span-4 sm:col-span-6 md:col-span-6 lg:col-span-5 xl:col-span-3 order-2 sm:order-2 md:order-2 lg:order-2 xl:order-3 ring-2 ring-[#FFB92D]  rounded-lg focus:outline-none focus-within:ring-0 w-full relative  ">
        <div className="relative   ">
          <img
            className="w-4 h-4 absolute top-3.5 left-3 z-20"
            src="/assets/images/search.svg"
            alt=""
          />
          <input
            className=" bg-[#181A20] robboto-fonts placeholder:text-sm placeholder:text-[#A6A6A6] text-[#A6A6A6] text-sm  inter-fonts relative w-full h-11 rounded-lg pl-9 pr-34 focus:outline-none "
            type="search"
            placeholder="Token"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={15}
          />
          {/* <div className="absolute top-1 right-0">
                  <button className="inter-fonts py-[9px] md:py-2 lg:py-2  text-dark px-8 md:px-12 rounded-md bg-[#FFB92D] text-[12px] md:text-[14px] inter-fonts font-[600] md:text-sm">
                    Search
                  </button>
                </div> */}
        </div>
        {/* Scrollable area for search results */}
        <div className="absolute w-full mt-2 top-full left-0 z-20">
          <ScrollArea
            ref={observerRef}
            className={cn(
              'w-full mt-1 bg-[#1E2329] shadow-lg rounded-lg transition-all',
              mockMemecoins.length < 2
                ? 'h-[4.5rem]'
                : mockMemecoins.length < 3
                  ? 'h-[9.5rem]'
                  : 'h-[13.5rem]'
            )}
          >
            {' '}
            <ul className="divide-y divide-gray-800">
              {/* Example search result item */}
              {mockMemecoins.map((coin) => (
                <li
                  key={coin.id}
                    onClick={handleCardClick(coin.id)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#2A2F36] transition-colors"
                >
                  {/* Image */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={coin.pictureUrl}
                      alt={coin.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    {/* Token Name and Ticker */}
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm truncate max-w-[150px]">
                        {coin.name}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {coin.ticker}
                      </span>
                    </div>
                  </div>
                  {/* Market Cap */}
                  <div className="text-right">
                    <span className="text-white font-semibold text-sm">
                      {coin.marketCap} SOL
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {/* Loading Indicator */}
            {loading && <SmallerLoaderSpin/>}
            {/* Trigger Element for Intersection Observer */}
            {!loading && hasMore && (
              <div id="load-more-trigger" style={{ height: '1px' }}></div>
            )}
            {/* No More Results */}
            {/* {!hasMore && <p>No more results</p>} */}
          </ScrollArea>
        </div>
      </div>
      
    
  );
};

export default SearchCoins;
