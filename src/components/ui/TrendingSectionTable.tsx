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
              {filteredMemecoins.map((memecoin) => {
  // // Calculate growthPercentage
  // const growthPercentage = getGrowthPercentage(
  //   Number(memecoin.marketCap),
  //   Number(memecoin.airdropAmount) // Make sure this is included in your API/select!
  // );

  // Format time
  const time = formatDistanceToNow(new Date(memecoin.createdAt), { addSuffix: true });

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
      description={memecoin.description || 'No description available'}
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
