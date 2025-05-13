import React, { useState, useRef } from 'react';
import MemecoinCard from './MemecoinCard';
import { SheetTrigger } from '@/components/ui/sheet';
import { ToggleButton } from './ToggleButton';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import QuickBuySideDrawer from './QuickBuySideDrawer';

export interface Memecoin {
  id: string;
  name: string;
  keyword: string;
  marketCap: string;
  growthPercentage: string;
  growthIcon: string;
  trendingImage: string;
  creator: {
    username: string;
    pictureUrl: string;
  };
  category: string;
  time: string;
  replies: number;
  driver: string;
  driverSymbol: string;
  holozone: string;
  description: string;
  progressBarColor: string;
}


export const memecoins: Memecoin[]
 = [
    {
      id: '1',
      name: 'Downald Trump',
      keyword: 'Trump',
      marketCap: '$500k',
      growthPercentage: '+10%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmfPchJVEVC3auXUZt5VhGmPsFyZRXuBuuL4AZipLVKaCb?img-width=128&img-dpr=2&img-onerror=redirect',      
      creator: {
        username: 'JohnDoe',
        pictureUrl: 'https://pump.mypinata.cloud/ipfs/QmfPchJVEVC3auXUZt5VhGmPsFyZRXuBuuL4AZipLVKaCb?img-width=128&img-dpr=2&img-onerror=redirect',
      },
      category: 'Meme',
      time: 'in 10 min',
      replies: 25,
      driver: 'TRUMP',
      driverSymbol: '(TRUMP)',
      holozone: 'Holozone [HOLO]',
      description:
        'Downald Trump is the latest meme coin taking the crypto world by storm. Join the movement today!',
      progressBarColor: '#FF5733',
    },
    {
      id: '2',
      name: 'Saratoga Spring Water',
      keyword: 'Water',
      marketCap: '$120k',
      growthPercentage: '+5%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/Qmd2Ar87gsVf2mXix9mxT8WCr3Zh27SutfXDJEqUQyLNX3?img-width=128&img-dpr=2&img-onerror=redirect',
      creator: {
        username: 'JohnDoe',
        pictureUrl: 'https://pump.mypinata.cloud/ipfs/Qmd2Ar87gsVf2mXix9mxT8WCr3Zh27SutfXDJEqUQyLNX3?img-width=128&img-dpr=2&img-onerror=redirect',
      },
      category: 'Meme',
      time: 'in 15 min',
      replies: 12,
      driver: 'WATER',
      driverSymbol: '(WATER) vodfokoosdk bdfweoweokskdokeowkeok ',
      holozone: 'Holozone [HOLO]',
      description:
        ' Spring Water coin is here to quench your thirst for profits. Dive in now!',
      progressBarColor: '#00E5FF',
    },
    {
      id: '3',
      name: 'Pyramids',
      keyword: 'History',
      marketCap: '$230k',
      growthPercentage: '+8%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmQjJnXY4RqMatRJeUATBRQuimzQxpQLMh92ufCWdQ1UiT?img-width=128&img-dpr=2&img-onerror=redirect',
      creator: {
        username: 'HistoryBuff',
        pictureUrl: 'https://pump.mypinata.cloud/ipfs/QmQjJnXY4RqMatRJeUATBRQuimzQxpQLMh92ufCWdQ1UiT?img-width=128&img-dpr=2&img-onerror=redirect',
      },
      category: 'Meme',
      time: 'in 20 min',
      replies: 18,
      driver: 'PYRAMID',
      driverSymbol: '(PYRAMID)',
      holozone: 'Holozone [HOLO]',
      description:
        'Pyramids coin is a historical marvel in the crypto space. Build your wealth with us!',
      progressBarColor: '#FFD700',
    },
    {
      id: '4',
      name: 'Italian Brainrot',
      keyword: 'Italy',
      marketCap: '$1M',
      growthPercentage: '+12%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmQ99Nt5FgHGomKZEMtFyVargviKBHLeExqebrTEzs4LnX?img-width=128&img-dpr=2&img-onerror=redirect',
      creator: {
        username: 'CryptoChef',
        pictureUrl: 'https://pump.mypinata.cloud/ipfs/QmQ99Nt5FgHGomKZEMtFyVargviKBHLeExqebrTEzs4LnX?img-width=128&img-dpr=2&img-onerror=redirect',
      },
      category: 'Meme',
      time: 'in 5 min',
      replies: 30,
      driver: 'ITALY',
      driverSymbol: '(ITALY)',
      holozone: 'Holozone [HOLO]',
      description:
        'Italian Brainrot coin brings the taste of Italy to the blockchain. Mangia bene, invest better!',
      progressBarColor: '#39FF14',
    },
    {
      id: '5',
      name: 'Fartcoin',
      keyword: 'Humor',
      marketCap: '$300k',
      growthPercentage: '+20%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmNptjnEqmZvTk7UKsyZDLg7rs5EgUHi2NZ3qLYPVCu4mH?img-width=128&img-dpr=2&img-onerror=redirect',
      creator: {
        username: 'LaughingStock',
        pictureUrl: 'https://pump.mypinata.cloud/ipfs/QmNptjnEqmZvTk7UKsyZDLg7rs5EgUHi2NZ3qLYPVCu4mH?img-width=128&img-dpr=2&img-onerror=redirect',
      },
      category: 'Meme',
      time: 'in 2 min',
      replies: 50,
      driver: 'FART',
      driverSymbol: '(FART)',
      holozone: 'Holozone [HOLO]',
      description:
        'Fartcoin is the funniest way to invest in crypto. Laugh your way to the bank!',
      progressBarColor: '#FFB92D',
    },
  ];


const TrendingSectionTable: React.FC = () => {
  const ref = React.createRef<HTMLButtonElement>();
  const [filteredMemecoins, setFilteredMemecoins] =
    useState<Memecoin[]>(memecoins);
    const [activeKeyword, setActiveKeyword] = useState<string | null>(null); // Track the active keyword


  const handleFilter = (keyword: string) => {
    const filtered = memecoins.filter(
      (memecoin) => memecoin.keyword === keyword
    );
    setFilteredMemecoins(filtered);
    setActiveKeyword(keyword)
  };

  const clearFilter = () => {
    setFilteredMemecoins(memecoins); // Reset to the original array
    setActiveKeyword(null); // Clear the active keyword
  };


  const handleParentButtonClick = () => {
    if (ref.current) {
      ref.current.click();
    }
  };
  return (
    <section className="trending-sec">
      <QuickBuySideDrawer
        ref={ref}
        title="Buy Cryptocurrency"
        description="Enter the amount you want to buy."
      />

      <div className="container mx-auto px-4 py-1 lg:px-10 xl:px-25 md:py-3">
        <div className="grid xs:grid-cols:12 sm:grid-cols:12 md:grid-cols-12 lg:grid-cols-12 gap-3 md:gap-3 md:mt-4 items-center">
          <div className="xs:col-span-6 sm:col-span-6 md:col-span-5 lg:col-span-5 xl:col-span-4 order-1 sm:order-1 md:order-1 lg:order-1">
            <div className="xs:block flex items-center justify-start  space-x-2">
              <div className="mt-2 md:mt-0 ">
                <form className="w-full md:w-40 flex items-center justify-center bg-[#1E2329] rounded-sm px-2 py-1">
                  <label
                    htmlFor="countries"
                    className="text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] font-[500] text-white sofia-fonts"
                  >
                    Sort:
                  </label>
                  <select
                    id="countries"
                    className="sofia-fonts focus:outline-none cursor-pointer bg-[#1E2329]  text-start text-white text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] font-[500] rounded-lg  block w-28  py-1.5 placeholder-gray-400"
                  >
                    <option className="text-[14px] ">Market cap</option>
                    <option className="text-black text-[14px]" value="CA">
                      Canada
                    </option>
                    <option className="text-black text-[14px]" value="FR">
                      France
                    </option>
                    <option className="text-black text-[14px]" value="DE">
                      Germany
                    </option>
                  </select>
                </form>
              </div>

              <div className="mt-2 py-2 md:mt-2 w-full md:w-40 flex space-x-2 items-center justify-center text-white font-[500] sofia-fonts rounded-sm text-[14px] xl:text-[15px]">
                <span className="lg:ms-0 xl:ms-2 text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] font-[500] sofia-fonts text-[#FFFFFF]  md:pr-1 lg:pr-2">
                  Animation ON
                </span>
                <ToggleButton />
              </div>
            </div>
          </div>
          <div className="xs:col-span-6 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-5 order-3 sm:order-3 md:order-3 lg:order-3 xl:order-2">
            <div>
              <div className="w-full">
                <div className="relative right-0">
                  <ul
                    className="relative flex-wrap lg:flex-nowrap text-center flex justify-center space-y-2 space-x-1 items-center list-none pt-2 inter-fonts "
                    data-tabs="tabs"
                    role="list"
                  >
                    <label className="text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] mr-3 inter-fonts font-[400] text-[#FFFFFF]">
                      Trending:
                    </label>
                    {Array.from(
                      new Set(memecoins.map((memecoin) => memecoin.keyword))
                    ).map((keyword) => (
                      <li
                      className={`z-30 text-center inline-flex w-fit cursor-pointer pb-2 $
                       
                      }`}
                        key={keyword}
                        onClick={() => handleFilter(keyword)}
                      >
                        <a
                          className={`text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] py-1 px-2 tab-link rounded-sm relative text-white ${
                            activeKeyword === keyword ? 'bg-[#FFB92D]' : 'bg-black'
                          }`}
                          data-tab-target="dashboard"
                          role="tab"
                          aria-selected="true"
                        >
                          {keyword}
                        {activeKeyword === keyword && (
                            <span
                              className=" text-white bg-red-500 absolute -top-2 -right-1 size-4 rounded-full text-xs"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the `onClick` of the parent `<li>`
                                clearFilter();
                              }}
                            >
                              x
                            </span>
                          )}
                        </a>
                      </li>
                    ))}

                    {/* //quick buy */}

                    {/* <div className="w-fit mb-2  rounded-sm bg-[#1E2329] text-white">
                      <button
                        className="flex items-center  cursor-pointer gap-1 rounded-[5pxxx] px-2 py-1 inter-fonts font-[700] text-[#32CA5B] text-[14px]"
                        data-drawer-target="drawer-right-1"
                        onClick={handleParentButtonClick}
                      >
                        <div className="w-[12px] h-[16px] flex-shrink-0">
                          <img
                            className="w-[100%] h-[100%] object-cover"
                            src="/assets/images/filter.svg"
                            alt=""
                          />
                        </div>
                        <img
                          className="w-3 h-auto"
                          src="/assets/images/green-chargin-icon.png"
                          alt=""
                        />
                        Quick Buy
                      </button>
                    </div> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="xs:col-span-4 sm:col-span-6 md:col-span-6 lg:col-span-5 xl:col-span-3 order-2 sm:order-2 md:order-2 lg:order-2 xl:order-3">
            <form action="" className="relative bg-[#1E2329]  focus:border-0">
              <img
                className="w-4 h-4 absolute top-3.5 left-3 "
                src="/assets/images/search.svg"
                alt=""
              />
              <input
                className="focus:outline-none border-1 border-[#FFB92D] robboto-fonts placeholder:text-sm placeholder:text-[#A6A6A6] text-[#A6A6A6] text-xs  focus:border-0  inter-fonts relative forn-control w-full h-11 rounded-lg pl-9 pr-34"
                type="search"
                placeholder="Token"
              />
              <div className="absolute top-1 right-1">
                <button className="inter-fonts py-[9px] md:py-2 lg:py-2  text-dark px-8 md:px-12 rounded-md bg-[#FFB92D] text-[12px] md:text-[14px] inter-fonts font-[600] md:text-sm">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        <div data-tab-content="" className="py-9">
          <div id="dashboard" className="tab-content" role="tabpanel">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              
              {filteredMemecoins.map((memecoin) => (
                <MemecoinCard
                id={memecoin.id}
                  key={memecoin.name}
                  name={memecoin.name}
                  keyword={memecoin.keyword}
                  marketCap={memecoin.marketCap}
                  growthPercentage={memecoin.growthPercentage}
                  growthIcon={memecoin.growthIcon}
                  trendingImage={memecoin.trendingImage}
                  creator={memecoin.creator}
                  time={memecoin.time}
                  replies={memecoin.replies}
                  driver={memecoin.driver}
                  driverSymbol={memecoin.driverSymbol}
                  holozone={memecoin.holozone}
                  description={memecoin.description}
                  progressBarColor={memecoin.progressBarColor}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default TrendingSectionTable;
