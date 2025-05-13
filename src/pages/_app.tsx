import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { solanaWallets } from '../config/solanaWalletConfig';
// import TopReferrersBanner from '../components/ui/TopReferrersBanner';
import TopReferrersCarousel from '../components/ui/TopReferrersCarousel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from '@/components/ui/sonner';
import { config } from '../config/wagmiConfig';
import CookieConsent from 'react-cookie-consent';
import '../i18n';
import { useEffect, useRef } from 'react';
import { createAppKit, useAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useAppKitAccount } from '@reown/appkit/react';

// Replace with your Reown project ID
const PROJECT_ID = 'f325d70cabde57c85536722f0b6e724f';

// Replace with your Reown project ID
//  const PROJECT_ID = process.env.REOWN_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

// my own project id
//  const PROJECT_ID = "b99e2398076df92befcbb193bac0b0d4"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const queryClient = new QueryClient();

export function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit();

  return (
    <>
      <a
        className="transition-all duration-300 ease-in-out bg-[#FFB92D] hover:bg-white hover:text-[#FFB92D] text-[#121212] text-[13px] font-[900] rounded-md  px-5 py-[10px]"
        onClick={() => open({ view: 'Connect', namespace: 'solana' })}
      >
        Connect Wallet
      </a>
    </>
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { wallets } = solanaWallets();
  const appKitRef = useRef<any>(null);

  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();

  // Lazy imports for client-side adapters
  // let SolanaAdapter: any, PhantomWalletAdapter: any, SolflareWalletAdapter: any;
  // if (typeof window !== 'undefined') {
  //   // Dynamically import browser-only modules
  //   SolanaAdapter = require('@reown/appkit-adapter-solana/react').SolanaAdapter;
  //   PhantomWalletAdapter = require('@solana/wallet-adapter-wallets').PhantomWalletAdapter;
  //   SolflareWalletAdapter = require('@solana/wallet-adapter-wallets').SolflareWalletAdapter;
  // }

  // const solanaAdapter = new SolanaAdapter({
  //   wallets: [
  //       new PhantomWalletAdapter(),
  //       new SolflareWalletAdapter()]
  // })

  useEffect(() => {
    if (!appKitRef.current && typeof window !== 'undefined' && PROJECT_ID) {
      appKitRef.current = createAppKit({
        adapters: [
          new SolanaAdapter({
            wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
          }),
        ],
        networks: [solana, solanaTestnet, solanaDevnet],
        metadata: {
          name: 'Cryptowny',
          description: 'Cryptowny Wallet Connection',
          url: 'http://localhost:3000',
          icons: ['https://cryptowny.com/icon.png'],
        },
        projectId: PROJECT_ID,
        features: {
          analytics: true,
          socials: [],
          email: false,
        },
      });
    }
  }, []);

  return (
    <WagmiConfig config={config}>
      <WalletProvider wallets={wallets} autoConnect>
        <QueryClientProvider client={queryClient}>
          <SessionProvider session={session}>
            <AuthProvider>
              <SocketProvider>
                <Head>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />
                  <title>Meme Launchpad</title>
                </Head>
                <div
                  className={`${inter.variable} font-sans text-textPrimary bg-bg1 dark:bg-bg2 min-h-screen`}
                >
                  <Header />
                  {/* <TopReferrersBanner /> */}
                  <TopReferrersCarousel />
                  <main className="flex-grow container mx-auto px-4 py-8">
                    <Component {...pageProps} />
                  </main>
                  <Footer />
                  <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    limit={1}
                  />
                  <Toaster />

                  <CookieConsent
                    location="bottom"
                    buttonText="Accept"
                    declineButtonText="Decline"
                    enableDeclineButton
                    onAccept={() => {
                      console.log('Cookies accepted.');
                    }}
                    onDecline={() => {
                      console.log('Cookies declined.');
                    }}
                    cookieName="meme_launchpad_cookie_consent"
                    style={{ background: '#2B373B' }}
                    buttonStyle={{
                      color: '#4e503b',
                      fontSize: '13px',
                      background: '#ffffff',
                      borderRadius: '5px',
                      padding: '10px 20px',
                    }}
                    declineButtonStyle={{
                      color: '#ffffff',
                      fontSize: '13px',
                      background: '#6c757d',
                      borderRadius: '5px',
                      padding: '10px 20px',
                      marginLeft: '10px',
                    }}
                    expires={150}
                  >
                    This website uses cookies to enhance the user experience.{' '}
                    <a
                      href="/privacy-policy"
                      style={{ color: '#ffffff', textDecoration: 'underline' }}
                    >
                      Learn more
                    </a>
                  </CookieConsent>
                </div>
              </SocketProvider>
            </AuthProvider>
          </SessionProvider>
        </QueryClientProvider>
      </WalletProvider>
    </WagmiConfig>
  );
}

export default MyApp;
