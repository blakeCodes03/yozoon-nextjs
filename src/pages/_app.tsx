import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import {
  YozoonClientProvider,
  YozoonClientContext,
} from '../contexts/YozoonClientContext';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig } from 'wagmi';
import {
  WalletProvider,
  useWallet
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { solanaWallets } from '../config/solanaWalletConfig';
import TopReferrersCarousel from '../components/ui/TopReferrersCarousel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from '@/components/ui/sonner';
import { config } from '../config/wagmiConfig';
import CookieConsent from 'react-cookie-consent';
import '../i18n';
import { useEffect, useRef, useState } from 'react';
import { Connection } from '@solana/web3.js';
import { AnchorProvider, Wallet, web3 } from '@project-serum/anchor';
import { AppKitProvider } from '../config/AppKitProvider';
import '@solana/wallet-adapter-react-ui/styles.css'; // ✅ Required for modal UI
import { useProgramAdmin } from "../hooks/useProgram"
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { getBondingCurvePDA, getConfigPDA } from "../utils/config";
import { KeypairWallet } from "../utils/KeypairWallet"; // custom wallet adapter
import * as anchor from '@coral-xyz/anchor';
import { initializeConfig, wallet, InitializeBondingCurve } from "../services/token-mill/services/iniatlizeService"




const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { wallets } = solanaWallets();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [walletInstance, setWalletInstance] = useState<any>(null);

  if (!process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
  throw new Error("ADMIN_SECRET_KEY is not defined in the environment");

}

  const secretKey = JSON.parse(process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY);

  const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

  const wallet = new KeypairWallet(keypair);

  const program = useProgramAdmin(wallet);
  const [initialized, setInitialized] = useState(false);





  useEffect(() => {
    if (!program || !wallet || initialized) return; // Prevent multiple runs

    const initConfig = async () => {
      try {
        const { configPDA } = await getConfigPDA();

        const configAccount = await (program.account as any)["config"].fetch(configPDA);

        const yozoonMint = configAccount?.mint;

        // const { reflectionStatePDA } = await getReflectionStatePDA(yozoonMint);

        // // Check if the config PDA already exists


        // // Check if the reflection state PDA already exists
        // const reflectionStateAccount = await program.account["reflectionState"].fetchNullable(reflectionStatePDA);

        // console.log("Reflection State Account:", reflectionStateAccount);


        // Create a new mint


        console.log("Config Account:", configAccount);
        if (configAccount) {
          console.log("✅ Config already exists:", configAccount.mint.toBase58());
          setInitialized(true);


          const [reflectionStatePDA] = await PublicKey.findProgramAddressSync(
            [Buffer.from("reflection_state"), configAccount.mint.toBuffer()],
            program.programId
          );
          console.log("Reflection State PDA:", reflectionStatePDA.toBase58());
          return;
        }

        // Otherwise, initialize the config
        const configAddress = await initializeConfig(program, wallet);
        console.log("✅ Config initialized:", configAddress.toBase58());
        setInitialized(true);
      } catch (err) {
        console.error("❌ Failed to initialize config:", err);
      }
    };


    const initBondingCurve = async () => {
      try {
        const { bondingCurvePDA } = await getBondingCurvePDA();

        // Check if the bonding curve PDA already exists
        const bondingCurveAccount = await (program.account as any)["bondingCurve"].fetchNullable(bondingCurvePDA);




        if (bondingCurveAccount) {
          console.log("✅ Bonding curve already exists at:", bondingCurvePDA.toBase58());
          setInitialized(true);
          return;
        }

        // Otherwise, initialize the bonding curve
        const bondingCurveAddress = await InitializeBondingCurve(program, wallet);
        console.log("✅ Bonding curve initialized:", bondingCurveAddress.toBase58());
        setInitialized(true);
      } catch (err) {
        console.error("❌ Failed to initialize bonding curve:", err);
      }
    };

    initConfig();
    initBondingCurve();
  }, [program, wallet, initialized]);

  return (
    <WagmiConfig config={config}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider> {/* ✅ This was missing */}
          <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
              <AuthProvider>
                <SocketProvider>
                  <AppKitProvider>
                    <Head>
                      <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                      />
                      <title>Agent Launchpad</title>
                    </Head>
                    <div
                      className={`${inter.variable} font-sans text-textPrimary bg-bg1 dark:bg-bg2 min-h-screen`}
                    >
                      <Header />
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
                      <Toaster richColors position="top-right" />
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
                          style={{
                            color: '#ffffff',
                            textDecoration: 'underline',
                          }}
                        >
                          Learn more
                        </a>
                      </CookieConsent>
                    </div>
                  </AppKitProvider>
                </SocketProvider>
              </AuthProvider>
            </SessionProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </WagmiConfig>
  );
}

export default MyApp;
