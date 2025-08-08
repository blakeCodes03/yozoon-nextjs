import React, { useState, useEffect } from 'react';
import MemecoinCard from './MemecoinCard';
import { formatDistanceToNow } from 'date-fns';
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

const PAGE_SIZE = 12;

export const mockMemecoins = [
  {
    id: '1',
    name: 'DogeCoin',
    keyword: '#doge',
    marketCap: '5000000000', // Converted to string
    pictureUrl: 'https://images.unsplash.com/photo-1753097916730-4d32f369bbaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3NHx8fGVufDB8fHx8fA%3D%3D',
    creator: {
      username: 'Elon Musk', // Changed to object
      pictureUrl: 'https://images.unsplash.com/photo-1753150972975-0524f7f24888?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: '2025-07-20T12:00:00Z',
    chatMessages: [{}, {}, {}], // 3 replies
    ticker: 'DOGE',
    description: 'The original meme coin.',
    priceHistory : [
    { timestamp: '2024-07-01T12:00:00Z', price: 0.05 },
    { timestamp: '2024-07-02T12:00:00Z', price: 0.06 },
    { timestamp: '2024-07-03T12:00:00Z', price: 0.07 },
    
  ]
  },
  {
    id: '2',
    name: 'Shiba Inu',
    keyword: '#shiba',
    marketCap: '3000000000', // Converted to string
    pictureUrl: 'https://images.unsplash.com/photo-1752306639259-2554bb3fa65f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D',
    creator: {
      username: 'Ryoshi', // Changed to object
      pictureUrl: 'https://example.com/ryoshi.png',
    },
    createdAt: '2025-07-18T15:30:00Z',
    chatMessages: [{}], // 1 reply
    ticker: 'SHIB',
    description: 'A decentralized meme token.',
  },
  {
    id: '3',
    name: 'PepeCoin',
    keyword: '#pepe',
    marketCap: '1000000000', // Converted to string
    pictureUrl: 'https://example.com/pepecoin.png',
    creator: {
      username: 'Pepe Dev', // Changed to object
      pictureUrl: 'https://plus.unsplash.com/premium_photo-1751998306511-8fc018746860?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: '2025-07-22T10:00:00Z',
    chatMessages: [], // 0 replies
    ticker: 'PEPE',
    description: 'The frog-themed meme coin.',
  },
  {
    id: '4',
    name: 'Floki Inu',
    keyword: '#floki',
    marketCap: '2000000000', // Converted to string
    pictureUrl: 'https://images.unsplash.com/photo-1753272379232-18de1237b795?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOXx8fGVufDB8fHx8fA%3D%3D',
    creator: {
      username: 'Floki Team', // Changed to object
      pictureUrl: 'https://example.com/floki.png',
    },
    createdAt: '2025-07-19T08:45:00Z',
    chatMessages: [{}, {}, {}, {}], // 4 replies
    ticker: 'FLOKI',
    description: 'Inspired by Elon Musk’s dog.',
  },
  {
    id: '5',
    name: 'Baby DogeCoin',
    keyword: '#babydoge',
    marketCap: '1500000000', // Converted to string
    pictureUrl: 'https://example.com/babydogecoin.png',
    creator: {
      username: 'Baby Doge Dev', // Changed to object
      pictureUrl: 'https://example.com/babydoge.png',
    },
    createdAt: '2025-07-21T14:20:00Z',
    chatMessages: [{}, {}], // 2 replies
    ticker: 'BABYDOGE',
    description: 'A cute meme coin with big dreams.',
  },
];

const TrendingSectionTable: React.FC = () => {
  const [memecoins, setMemecoins] = useState<any[]>([]);
  const [filteredMemecoins, setFilteredMemecoins] = useState<any[]>([]);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'none' | 'marketCap' | 'createdAt'>(
    'none'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]); // <-- new state

  // Fetch memecoins from API based on sortBy and pagination
  const fetchMemecoins = async (
    sort: 'none' | 'marketCap' | 'createdAt',
    page: number = 1
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/coins/sorted`, {
        params: {
          sortBy: sort,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      setMemecoins(response.data.coins);
      setFilteredMemecoins(response.data.coins);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching memecoins:', error);
      setMemecoins([]);
      setFilteredMemecoins([]);
      setTotal(0);
    }
    setLoading(false);
  };

  // Fetch trending keywords (popular hashtags) from API
  useEffect(() => {
    axios
      .get('/api/coins/popular-hashtags')
      .then((res) => setTrendingKeywords(res.data))
      .catch(() => setTrendingKeywords([]));
  }, []);

  useEffect(() => {
    fetchMemecoins(sortBy, currentPage);
    setActiveKeyword(null); // Reset filter on sort/page change
  }, [sortBy, currentPage]);

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

  // Pagination logic
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Sort change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'none' | 'marketCap' | 'createdAt';
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <section className="trending-sec">
      <div className="container mx-auto px-4 py-1 lg:px-10 xl:px-25 md:py-3">
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

        {/* Trending Keywords Filter */}
        <div className="mt-4">
          <label className="text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] mr-3 inter-fonts font-[400] text-[#FFFFFF]">
            Trending:
          </label>
          <ul className="flex flex-wrap gap-2">
            {trendingKeywords.map((keyword) => (
              <li
                key={keyword}
                className={`cursor-pointer px-2 py-1 rounded ${
                  activeKeyword === keyword
                    ? 'bg-[#FFB92D] text-black'
                    : 'bg-black text-white'
                }`}
                onClick={() => handleFilter(keyword)}
              >
                {keyword}
                {activeKeyword === keyword && (
                  <span
                    className="ml-2 text-white bg-red-500 rounded-full px-1 text-xs"
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
          </ul>
        </div>

        {/* Memecoin Cards */}
        <div className="py-9">
          {loading ? (
            <Spinner />
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
                const time = formatDistanceToNow(new Date(memecoin.createdAt), {
                  addSuffix: true,
                });

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
                    // progressBarColor={memecoin.progressBarColor}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};

export default TrendingSectionTable;
