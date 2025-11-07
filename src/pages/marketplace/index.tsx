import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BottomSignup from '../../components/ui/BottomSignup';
import { useTheme } from 'next-themes';

const Marketplace: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true));

  // Example usage for your social icons:
  const twitterIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-x.svg'
      : '/assets/images/social-icons/twitter.svg';

  const feedbackIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-link.svg'
      : '/assets/images/social-icons/feedback.svg';

  const discardIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-discort.svg'
      : '/assets/images/social-icons/discard.svg';

  const youtubeIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-youtube.svg'
      : '/assets/images/social-icons/youtube.svg';

  return (
    <>
      <Head>
        <title>Marketplace | Yozoon</title>
        <meta
          name="description"
          content="Privacy Policy for Yozoon - Learn how we protect your privacy and handle your data."
        />
      </Head>
      <main className="dark:text-white text-black">
        <div
          className={` text-center px-4 pb-6 sm:pb-8 pt-8 sm:pt-18 ${
            mounted && resolvedTheme === 'dark' ? 'inner-head' : 'outer-head'
          }`}
        >
          <h1 className="dark:text-white text-black text-[22px] sm:text-[30px] text-center sofia-fonts font-[700] uppercase">
            Marketplace
          </h1>
        </div>
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25 md:py-3">
          <div className="bg-transparent flex items-center justify-center h-[250px] md:min-h-screen">
            <div className="text-center">
              <h1 className="dark:text-white text-black text-3xl md:text-5xl sofia-fonts font-[700] my-4">
                COMING SOON
              </h1>
              <p className="dark:text-white text-black inter-fonts font-[400] text-[16px]">
                Soon AI modules here to customize your AI Agents
              </p>
              <div className="text-center dark:text-white text-black">
                <p className="text-white inter-fonts font-[700] text-[16px] sm:text-[18px] my-4">
                  Follow Us
                </p>
                <div className="flex justify-center items-center gap-4">
                  <Link
                    href="#"
                    className="dark:text-white text-black text-2xl"
                  >
                    <img
                      className="w-[27px] h-auto object-cover"
                      src={feedbackIcon}
                      alt="img"
                    ></img>
                  </Link>
                  <Link
                    href="#"
                    className="dark:text-white text-black text-2xl"
                  >
                    <img
                      className="w-[24px] h-auto object-cover"
                      src={twitterIcon}
                      alt=""
                    ></img>
                  </Link>
                  <Link
                    href="#"
                    className="dark:text-white text-black text-2xl"
                  >
                    <img
                      className="w-[22px] h-auto object-cover"
                      src={discardIcon}
                      alt=""
                    ></img>
                  </Link>
                  <Link
                    href="#"
                    className="dark:text-white text-black text-2xl"
                  >
                    <img
                      className="w-[33px] h-auto object-cover"
                      src={youtubeIcon}
                      alt=""
                    ></img>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomSignup />
      </main>
    </>
  );
};

export default Marketplace;
