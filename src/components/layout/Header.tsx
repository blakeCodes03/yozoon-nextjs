'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import TrendingBar from '../ui/TrendingBar';
import { toast } from 'sonner';
import LanguageSelector from '../ui/LanguageSelector';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { ActionButtonList } from '../../config/ActionButtonList';
// import { ConnectButton } from '@/pages/_app';
import { ToggleTheme } from '../ui/ThemeToggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { mockMemecoins } from '../ui/TrendingSectionTable';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import Spinner from '../common/Spinner';
import { useAgentRoomStore } from '@/store/agentRoomStore';
import { Currency } from 'lucide-react';

type Coin = {
  id: string;
  name: string;
  ticker: string;
  description: string;
  marketCap: number;
  createdAt: string;
  pictureUrl: string;
  hashtags: { tag: string }[];
  creator: { username: string; pictureUrl: string }[];
};

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
    useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(router.pathname);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true));
  const observerRef = useRef<HTMLDivElement | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  useOutsideClick(profileRef, () => setIsProfileDropdownOpen(false));

  //initialize currentPage from agentRoomStore using zustand
  const setCurrentUserPage = useAgentRoomStore(
    (state) => state.setCurrentUserPage
  );
  const currentUserPage = useAgentRoomStore((state) => state.currentUserPage);

  useEffect(() => {
    const storedMode = localStorage.getItem('theme');
    if (storedMode === 'dark') setDarkMode(true);
    else if (storedMode === 'light') setDarkMode(false);
    else {
      setDarkMode(true);
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast('Signed out');
    router.push('/login');

    setIsProfileDropdownOpen(false);
  };
  const handleSignIn = async () => {
    await signIn();
  };

  // Fetch searched coins from the API
  const fetchCoins = useCallback(async () => {
    if (!hasMore || loading) return;

    if (query.trim() === '') {
      setCoins([]);
      return;
    }

    setLoading(true);
    console.log('Fetching coins for query:', query, 'page:', page);
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

  const handleCardClick = (coinId: string) => {
    router.push(`/coin/${coinId}`);
  };

  // Debounce the search query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCoins([]);
      setPage(1);
      setHasMore(true);
      console.log('Searching for:', query);
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

  const onDialogClose = () => {
    setDialogOpen(false);
    setQuery('');
  };

  const isActive = (path: string) =>
    currentUserPage === path || router.pathname === path;

  const setActivePage = (page: string) => {
    setCurrentPage(page);
    if (router.pathname === page) {
      setCurrentUserPage(page); //global state
    }
  };

  useEffect(() => {
    setCurrentPage(router.pathname);
    setIsMenuOpen(false);
  }, [router.pathname]);

  return (
    <header className="dark:bg-[#1E2329] dark:text-white bg-white text-black">
      <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25 md:py-3">
        <TrendingBar />
      </div>

      <div className="dark:bg-[#181A20] bg-white">
        <div className="container mx-auto px-4 py-5 lg:px-10 xl:px-25 pb-1">
          <nav className="pb-2.5 md:border-b-[1px] dark:md:border-[#FFFFFF] md:md:border-[#181A20]">
            <div className="max-w-screen-xl  flex items-center justify-center gap-1 lg:gap-1 mx-auto py-1">
              {/* <!-- Logo --> */}
              <Link href="/" className="h-[auto] w-[100px] md:w-[59]">
                {/* <img
                  src="/assets/images/sitelogo.svg"
                  className="w-full h-full object-cover"
                  alt="Logo"
                /> */}
                <Image
                  // src="/assets/images/sitelogo.svg"
                  src="/assets/images/yozoon_logo.png"
                  alt="Yozoon Logo"
                  className=" "
                  width={40}
                  height={40}
                />
              </Link>
              <div className="flex items-center gap-4">
                <ul className="hidden xl:flex inter-fonts text-[14px] xl:text-[16px] gap-2 font-medium flex-col p-4 md:p-0 mt-4 md:mt-0 md:flex-row md:space-x-8 rtl:space-x-reverse">
                  <li className="mr-3.5">
                    <Link
                      href="/"
                      onClick={() => setCurrentUserPage('/')}
                      className={cn(
                        'text-[16x] transition-all duration-300 ease-in-out block pb-[4px] px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="mr-3.5">
                    <Link
                      href="/tokens"
                      onClick={() => setCurrentUserPage('/tokens')}
                      className={cn(
                        'text-[16x] transition-all duration-300 ease-in-out block pb-[4px] px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/how-it-works'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Tokens
                    </Link>
                  </li>
                  <li className="mr-3.5">
                    <Link
                      href="/marketplace"
                      onClick={() => setCurrentUserPage('/marketplace')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/marketplace'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Marketplace
                    </Link>
                  </li>
                  <li className="mr-2.5">
                    <Link
                      href="/education"
                      onClick={() => setCurrentUserPage('/education')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/education'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Education
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      onClick={() => setCurrentUserPage('/contact')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/tokens'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
                <div
                  className="h-3.5 w-3.5 cursor-pointer justify-between flex mt-1 "
                  onClick={() => setDialogOpen(true)}
                >
                  <img
                    className="w-[100%] h-[100%] object-cover mx-2"
                    src={
                      resolvedTheme === 'light'
                        ? '/assets/images/searchblack.png'
                        : '/assets/images/search2.svg'
                    }
                    alt=""
                  />
                </div>
                <div className="hidden md:flex items-center  ">
                  {session ? (
                    <div
                      className=" hidden md:flex items-center gap-3 "
                      ref={profileRef}
                    >
                      <div className="inter-fonts">
                        {/* connect wallet */}
                        {/* <a
                        className="transition-all duration-300 ease-in-out bg-[#FFB92D] hover:bg-white hover:text-[#FFB92D] text-[#121212] text-[13px] font-[900] rounded-md  px-5 py-[10px]"
                        onClick={() => open()}
                      >
                        Connect Wallet
                      </a> */}
                        {/* <ConnectButton /> */}
                        <ActionButtonList />
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Image
                            src={
                              session.user?.image ||
                              '/assets/avatar/default-avatar.png'
                            }
                            alt={`${session.user?.name || 'User'} Avatar`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#2B3139]">
                          <DropdownMenuItem className="font-semibold">
                            <Link href="/profile">Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="font-semibold"
                            onClick={handleSignOut}
                          >
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="hidden md:flex items-center gap-3 ">
                      <ul className="dark:bg-[#2B3139] bg-gray-300 text-black  rounded-md  py-[4px] px-3 colfaxfont font-[800]  flex items-center gap-2.5 dark:text-[#FFFFFF]">
                        <li className="h-[29px] cursor-pointer">
                          <Link
                            // onClick={() => signIn()}
                            href="/login"
                            className="text-[13px] transition-all duration-300 ease-in-out hover:text-[#FFB92D] border-r-2 dark:border-[#FFFFFF] border-black pr-2"
                          >
                            Login
                          </Link>
                        </li>
                        <li className="h-[29px] cursor-pointer">
                          <Link
                            href="/signup"
                            className="text-[13px]  transition-all duration-300 ease-in-out hover:text-[#FFB92D]"
                          >
                            Signup
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="ml-4 inter-fonts flex gap-6 items-center">
                    <div className=" cursor-pointer">
                      {/* <img
                        className="w-full h-full object-cover"
                        src="/assets/images/theme.svg"
                        alt="Dark Mode"
                      /> */}
                      <ToggleTheme />
                    </div>

                    <div className="relative cursor-pointer">
                      {/* <!-- Language icon that toggles the dropdown --> */}
                      {/* <LanguageSelector /> */}
                    </div>
                  </div>
                </div>
              </div>

              <button
                // id="mobileToggle"
                // type="button"
                onClick={() => toggleMenu()}
                className="transition-all duration-700 ease-in-out inline-flex items-center p-2 w-10 h-10 justify-center ml-6 text-sm dark:text-gray-500 rounded-lg xl:hidden   focus:ring-2 dark:focus:ring-gray-200 focus:ring-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 17 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            {/* <!-- Mobile Menu (hidden by default) --> */}
            {isMenuOpen && (
              <div
                id=""
                className=" transition-all duration-700 ease-in-out border-t-2 border-white  xl:hidden inter-fonts lg:text-[14px] xl:text-[16px] font-medium flex-col py-5 px-4  md:px-0 mt-4 md:mt-0 md:flex-row md:space-x-8 rtl:space-x-reverse"
              >
                <ul className="transition-all duration-700 ease-in-out">
                  <li className="mr-6.5">
                    <Link
                      href="/"
                      onClick={() => setCurrentUserPage('/')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="mr-6.5">
                    <Link
                      href="/tokens"
                      onClick={() => setCurrentUserPage('/tokens')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/how-it-works'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Tokens
                    </Link>
                  </li>
                  <li className="mr-6.5">
                    <Link
                      href="/marketplace"
                      onClick={() => setCurrentUserPage('/marketplace')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/marketplace'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Marketplace
                    </Link>
                  </li>
                  <li className="mr-6.5">
                    <Link
                      href="/education"
                      onClick={() => setCurrentUserPage('/education')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/education'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Education
                    </Link>
                  </li>
                  <li className="mr-6.5">
                    <Link
                      href="/contact"
                      onClick={() => setCurrentUserPage('/contact')}
                      className={cn(
                        'text-[16px] transition-all duration-300 ease-in-out block pb-1 px-0 hover:text-[#FFB92D] hover:border-b',
                        currentPage == '/tokens'
                          ? 'active text-[#FFB92D] border-b'
                          : 'dark:text-[#FFFFFF] text-black'
                      )}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
                <div className="block md:hidden mt-5">
                  {session ? (
                    <div className="inter-fonts">
                      <ActionButtonList />
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Image
                            src={
                              session.user?.image ||
                              '/assets/avatar/default-avatar.png' //!add user profile image
                            }
                            alt={`${session.user?.name || 'User'} Avatar`}
                            width={40}
                            height={40}
                            className="rounded-full mt-5"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link href="/profile">Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut}>
                            Sign Out
                          </DropdownMenuItem>
                          <DropdownMenuItem>Billing</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <ul className="inter-fonts font-medium text-[16px] flex items-center gap-4 dark:text-[#FFFFFF] text-black my-3 dark:bg-[#2B3139] bg-gray-300">
                      <li className="h-[29px]">
                        <Link
                          href="/login"
                          className="text-[13px] transition-all duration-300 ease-in-out dark:text-[#FFFFFF] text-black hover:text-[#FFB92D] border-r-2 dark:border-[#FFFFFF] border-black pr-2"
                        >
                          Login
                        </Link>
                      </li>
                      <li className="h-[29px]">
                        <Link
                          href="/signup"
                          className="text-[13px]  transition-all duration-300 ease-in-out dark:text-[#FFFFFF] text-black hover:text-[#FFB92D]"
                        >
                          Signup
                        </Link>
                      </li>
                    </ul>
                  )}

                  <div className="ml-2.5 mt-3 inter-fonts flex gap-6 items-center content-center">
                    <div className="w-10 h-6 flex items-center justify-center cursor-pointer">
                      <ToggleTheme />
                    </div>
                    {/* <div className="w-5 h-5 relative">
                      <LanguageSelector />
                    </div> */}
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
        {/* Dialog for search functionality */}
        <Dialog open={dialogOpen} onOpenChange={onDialogClose}>
          <DialogContent className="max-w-[425px] lg:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="hidden text-center text-2xl font-bold  items-center justify-center gap-2 p-2">
                Search Tokens
              </DialogTitle>
              {/* <DialogDescription className="mt-2 font-semibold ">
                Setup your agent in Telegram or Discord to start using it.
              </DialogDescription> */}
            </DialogHeader>
            <div className=" mb-4 w-full relative ">
              <div className="relative w-full  ">
                <img
                  className="w-4 h-4 absolute top-3.5 left-3 z-20"
                  src={
                    resolvedTheme === 'light'
                      ? '/assets/images/searchblack.png'
                      : '/assets/images/search2.svg'
                  }
                  alt=""
                />
                <input
                  className=" dark:bg-[#181A20] bg-white robboto-fonts placeholder:text-sm placeholder:text-[#A6A6A6] dark:text-[#A6A6A6] text-sm  inter-fonts relative w-full h-11 rounded-lg pl-9 pr-5 focus:outline-none "
                  type="search"
                  placeholder="Token"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={15}
                />
              </div>
              {/* Scrollable area for search results */}
              <div className=" w-full mt-2 z-20">
                <ScrollArea
                  ref={observerRef}
                  className={cn(
                    'w-full mt-1 dark:bg-[#1E2329] shadow-lg rounded-lg transition-all',
                    coins?.length < 2
                      ? 'h-[4.5rem]'
                      : coins?.length < 3
                        ? 'h-[9.5rem]'
                        : 'h-[13.5rem]'
                  )}
                >
                  {' '}
                  <ul className="divide-y divide-gray-800">
                    {/* Example search result item */}
                    {coins?.map((coin) => (
                      <li
                        key={coin.id}
                        onClick={() => handleCardClick(coin.id)}
                        className="flex items-center justify-between px-4 py-3 dark:hover:bg-[#2A2F36] hover:bg-gray-400 transition-colors"
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
                            <span className="dark:text-white text-black  font-medium text-sm truncate max-w-[150px]">
                              {coin.name}
                            </span>
                            <span className="dark:text-gray-400 text-black text-xs">
                              {coin.ticker}
                            </span>
                          </div>
                        </div>
                        {/* Market Cap */}
                        <div className="text-right">
                          <span className="dark:text-white text-black font-semibold text-sm">
                            {coin.marketCap} SOL
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {(loading || !hasMore) && (
                    <div className="  flex items-center justify-center content-center w-full h-[4.5rem]">
                      {/* Loading Indicator */}
                      {loading && <Spinner />}
                      {/* Trigger Element for Intersection Observer */}

                      {/* No More Results */}
                      {!hasMore && <p>No more results</p>}
                    </div>
                  )}
                  {!loading && hasMore && (
                    <div id="load-more-trigger" style={{ height: '1px' }}></div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

         </header>
  );
};

export default Header;
