import React, { useState, useEffect, useRef } from 'react';
import MemecoinCard from './MemecoinCard';
import { formatDistanceToNow, set } from 'date-fns';
import axios from 'axios';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Spinner from '../common/Spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import SearchCoins from './Search';
import BuyYozoon from './BuyYozoon';

const PAGE_SIZE = 12;

export const mockMemecoins = [
  {
    id: '1',
    name: 'DogeCoin',
    keyword: '#doge',
    marketCap: '$50k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin.png',
    creator: {
      username: 'Elon Musk', // Changed to object
      id: 'baa7a226-771a-4a6e-ab58-e35568446035',
      pictureUrl:
        'https://images.unsplash.com/photo-1753150972975-0524f7f24888?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: '2025-07-20T12:00:00Z',
    chatMessages: [{}, {}, {}], // 3 replies
    ticker: 'DOGE',
    description: 'The original meme coin.',
    contractAddress: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
    priceHistory: [
      { timestamp: '2024-07-01T12:00:00Z', price: 0.05 },
      { timestamp: '2024-07-02T12:00:00Z', price: 0.06 },
      { timestamp: '2024-07-03T12:00:00Z', price: 0.07 },
    ],
  },
  {
    id: '2',
    name: 'Shiba Inu',
    keyword: '#shiba',
    marketCap: '$3.6k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin2.png',
    creator: {
      username: 'Ryoshi', // Changed to object
      pictureUrl:
        'https://images.unsplash.com/photo-1753150972975-0524f7f24888?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: '2025-07-18T15:30:00Z',
    chatMessages: [{}], // 1 reply
    ticker: 'SHIB',
    contractAddress: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',

    description: 'A decentralized meme token.',
  },
  {
    id: '3',
    name: 'PepeCoin',
    keyword: '#pepe',
    marketCap: '$10.5k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin3.png',
    creator: {
      username: 'Pepe Dev', // Changed to object
      pictureUrl:
        'https://plus.unsplash.com/premium_photo-1751998306511-8fc018746860?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: '2025-07-22T10:00:00Z',
    chatMessages: [], // 0 replies
    ticker: 'PEPE',
    description: 'The frog-themed meme coin.',
    contractAddress: '7ecdhsygxxyscszyep35khn8vvw3svaulktzxwcfltv',
  },
  {
    id: '4',
    name: 'Floki Inu',
    keyword: '#floki',
    marketCap: '$2.4k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin.png',
    creator: {
      username: 'Floki Team', // Changed to object
      pictureUrl:
        'https://images.unsplash.com/photo-1753150972975-0524f7f24888?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: '2025-07-19T08:45:00Z',
    chatMessages: [{}, {}, {}, {}], // 4 replies
    ticker: 'FLOKI',
    description: 'Inspired by Elon Musk’s dog.',
    contractAddress: '7ecdhsygxxyscszyep35khn8vvw3svaulktzxwcfltv',
  },
  {
    id: '5',
    name: 'Baby DogeCoin',
    keyword: '#babydoge',
    marketCap: '$1.5k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin3.png',
    creator: {
      username: 'Baby Doge Dev', // Changed to object
      pictureUrl:
        'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500&auto=format&fit=crop&q=60',
    },
    createdAt: '2025-07-21T14:20:00Z',
    chatMessages: [{}, {}], // 2 replies
    ticker: 'BABYDOGE',
    description: 'A cute meme coin with big dreams.',
    contractAddress: '7ecdhsygxxyscszyep35khn8vvw3svaulktzxwcfltv',
  },
  {
    id: '6',
    name: 'Baby DogeCoin',
    keyword: '#babydoge',
    marketCap: '$15k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin.png',
    creator: {
      username: 'Baby Doge Dev', // Changed to object
      pictureUrl:
        'https://images.unsplash.com/photo-1753150972975-0524f7f24888?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: '2025-07-21T14:20:00Z',
    chatMessages: [{}, {}], // 2 replies
    ticker: 'BABYDOGE',
    description: 'A cute meme coin with big dreams.',
    contractAddress: '7ecdhsygxxyscszyep35khn8vvw3svaulktzxwcfltv',
  },
  {
    id: '7',
    name: 'Baby DogeCoin',
    keyword: '#babydoge',
    marketCap: '$45k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin2.png',
    creator: {
      username: 'Baby Doge Dev', // Changed to object
      pictureUrl:
        'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500&auto=format&fit=crop&q=60',
    },
    createdAt: '2025-07-21T14:20:00Z',
    chatMessages: [{}, {}], // 2 replies
    ticker: 'BABYDOGE',
    description: 'A cute meme coin with big dreams.',
    contractAddress: '7ecdhsygxxyscszyep35khn8vvw3svaulktzxwcfltv',
  },
  {
    id: '8',
    name: 'symple',
    keyword: '#babydoge',
    marketCap: '$15.3k', // Converted to string
    pictureUrl: '/assets/images/trending-images/trending-coin.png',
    creator: {
      username: 'Baby Doge Dev', // Changed to object
      pictureUrl:
        'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500&auto=format&fit=crop&q=60',
    },
    createdAt: '2025-07-21T14:20:00Z',
    chatMessages: [{}, {}], // 2 replies
    ticker: 'SYMPL',
    description: 'A cute meme coin with big dreams.',
    contractAddress: '7ecdhsygxxyscszyep35khn8vvw3svaulktzxwcfltv',
  },
];

const trendingKeywordsMock = ['doge', 'shiba', 'pepe', 'floki', 'babydoge'];

const TrendingSectionTable: React.FC = () => {
  const [memecoins, setMemecoins] = useState<any[]>([]);
  const [filteredMemecoins, setFilteredMemecoins] = useState<any[]>([]);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'none' | 'marketCap' | 'createdAt'>(
    'none'
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]); // <-- new state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  //to handle opening/closing of buy-yozoon side drawer
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  // Fetch memecoins from API based on sortBy and pagination
  const fetchMemecoins = async (
    sort: 'none' | 'marketCap' | 'createdAt',
    page: number = 1
  ) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/coins/sorted`, {
        params: {
          sortBy: sort,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      setMemecoins((prev) => [...prev, ...response.data.coins]);
      setHasMore(response.data.coins.length > 0); // Stop fetching if no more results
    } catch (error) {
      console.error('Error fetching memecoins:', error);
      setMemecoins([]);
      setFilteredMemecoins([]);
    }
    setLoading(false);
  };

  // Fetch trending keywords (popular hashtags) from API
  useEffect(() => {
    axios
      .get('/api/coins/popular-hashtags')
      .then((res) => setTrendingKeywords(res.data))
      .catch(() => setTrendingKeywords([]));
    setTrendingKeywords(['doge', 'shiba', 'pepe', 'floki', 'babydoge']); // Mock data for now
  }, []);

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

  // useEffect(() => {
  //   fetchMemecoins(sortBy, currentPage);
  //   setActiveKeyword(null); // Reset filter on sort/page change
  // }, [sortBy, currentPage]);

  // Filter memecoins by keyword in hashtags
  const handleFilter = (keyword: string) => {
    setActiveKeyword(keyword);
    setFilteredMemecoins(
      memecoins.filter((coin) =>
        coin.hashtags?.some((h: { tag: string }) => h.tag === keyword)
      )
    );
  };

  // Clear filter
  const clearFilter = () => {
    setFilteredMemecoins(memecoins);
    setActiveKeyword(null);
  };

  // Sort change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'none' | 'marketCap' | 'createdAt';
    setSortBy(value);
    setCurrentPage(1);
  };

  // Fetch memecoins when page changes
  useEffect(() => {
    fetchMemecoins(sortBy, page);
  }, [page, sortBy]);

  return (
    <>
      <section className="trending-sec">
        <div className="container mx-auto px-4 py-1 lg:px-10 xl:px-25 md:py-3">
          <div className="grid xs:grid-cols:12 sm:grid-cols:12 md:grid-cols-12 lg:grid-cols-12 gap-3 md:gap-4 md:mt-4.5 items-center content-center ">
            <div className="xs:col-span-6 sm:col-span-6 md:col-span-5 lg:col-span-6 xl:col-span-4 order-1 sm:order-1 md:order-1 lg:order-1">
              <div className="xs:block flex items-center justify-start xl:justify-between  space-x-2">
                <div className="mt-2 md:mt-0 ">
                  {/* Sort Dropdown */}
                  <form className="w-full md:w-40 flex items-center justify-center bg-[#1E2329] rounded-sm px-2 py-1">
                    <label
                      htmlFor="sort"
                      className="text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] font-[500] text-white sofia-fonts"
                    >
                      Sort:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={handleSortChange}
                      className="sofia-fonts focus:outline-none cursor-pointer bg-[#1E2329] text-start text-white text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] font-[500] rounded-lg block w-28 py-1.5 placeholder-gray-400"
                    >
                      <option value="none">All</option>
                      <option value="marketCap">Market cap</option>
                      <option value="createdAt">Latest</option>
                    </select>
                  </form>
                </div>

                <div className="mt-2 py-2 md:mt-0 w-full md:w-40 flex space-x-2 items-center justify-center text-white font-[500] sofia-fonts rounded-sm text-[14px] xl:text-[15px]">
                  <span className="text-white lg:ms-0 xl:ms-2 text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] font-[500] sofia-fonts  md:pr-1 lg:pr-2">
                    Animation ON
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer py-1"
                    />
                    <div
                      className="text-start relative w-8 h-5 bg[#1E2329] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#FFB92D] dark:peer-focus:ring-[#FFB92D] ring-1 ring-[#FFB92D] rounded-full peer dark:bg-transparent peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-[#FFB92D] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1E2329] dark:peer-checked:bg-[#1E2329] 
                                        peer-checked:after:bg-[#FFB92D]"
                    ></div>
                  </label>
                </div>
              </div>
            </div>
            {/* Trending Keywords Filter */}

            <div className="xs:col-span-6 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-5 order-3 sm:order-3 md:order-3 lg:order-3 xl:order-2">
              <div className="flex justify-center content-center w-full">
                <div className="relative right-0 flex items-center">
                  <ul
                    className="tabs-list relative flex-wrap lg:flex-nowrap text-center flex items-center content-center justify-center space-y-2 space-x-1 list-none  inter-fonts "
                    data-tabs="tabs"
                    role="list"
                  >
                    <label className="trending-text text-xs pt-1 sm:text-[13px] lg:text-[14px] xl:text-[15px] mr-3 inter-fonts font-[400] ">
                      Trending:
                    </label>
                    {trendingKeywordsMock.map((keyword) => (
                      <li
                        key={keyword}
                        className={`cursor-pointer px-2 py-1 rounded   ${
                          activeKeyword === keyword
                            ? 'bg-[#FFB92D] text-black'
                            : 'bg-[#1E2323] text-white'
                        }`}
                        onClick={() => handleFilter(keyword)}
                      >
                        {keyword}
                        {activeKeyword === keyword && (
                          <span
                            className="ml-2 text-center text-white bg-red-500 rounded-full px-1 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFilter();
                            }}
                          >
                            x
                          </span>
                        )}
                      </li>
                    ))}

                    <div
                      className="w-fit mb-2  rounded-sm text-xs cursor-pointer"
                      onClick={handleOpenDrawer}
                    >
                      <button
                        className="flex items-center  cursor-pointer gap-1 rounded-[5px] px-2 py-1 inter-fonts font-[700]  text-[14px]"
                        data-drawer-target="drawer-right-1"
                      >
                        <img
                          className="w-3 h-auto"
                          src="/assets/images/green-chargin-icon.png"
                          alt=""
                        />
                        Buy Yozoon
                      </button>
                    </div>
                  </ul>
                </div>
              </div>
            </div>

            <SearchCoins />
          </div>

          <ScrollArea className="h-full w-full">
            {/* Memecoin Cards */}
            <div className="py-9">
              {loading && page === 1 ? (
                <div className="flex justify-center items-center h-48">
                  <Spinner />
                </div>
              ) : (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* {filteredMemecoins.map((memecoin) => { //!uncomment for actual data */}

                  {mockMemecoins.map((memecoin) => {
                    // // Calculate growthPercentage
                    // const growthPercentage = getGrowthPercentage(
                    //   Number(memecoin.marketCap),
                    //   Number(memecoin.airdropAmount) // Make sure this is included in your API/select!
                    // );

                    // Format time
                    const time = formatDistanceToNow(
                      new Date(memecoin.createdAt),
                      {
                        addSuffix: true,
                      }
                    );

                    // Replies count
                    const replies = memecoin.chatMessages?.length || 0;

                    return (
                      <MemecoinCard
                        id={memecoin.id}
                        key={memecoin.id}
                        name={memecoin.name}
                        keyword={memecoin.keyword}
                        marketCap={memecoin.marketCap}
                        // growthPercentage={growthPercentage}
                        // growthIcon={memecoin.growthIcon}
                        coinImage={memecoin.pictureUrl}
                        creator={memecoin.creator}
                        time={time}
                        replies={replies}
                        ticker={memecoin.ticker}
                        description={
                          memecoin.description || 'No description available'
                        }
                        contractAddress={memecoin.contractAddress}
                        // progressBarColor={memecoin.progressBarColor}
                      />
                    );
                  })}
                  {/* Trigger Element for Intersection Observer */}
                  {!loading && hasMore && (
                    <div
                      id="load-more-trigger"
                      className=" flex justify-center items-center"
                      style={{ height: '1px' }}
                    ></div>
                  )}
                  {loading && <Spinner />}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <BuyYozoon isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
      </section>
    </>
  );
};

export default TrendingSectionTable;
