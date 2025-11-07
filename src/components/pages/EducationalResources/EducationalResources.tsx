// src/components/pages/EducationalResources/EducationalResources.tsx
"use client";

import React from 'react';
import Head from 'next/head';
import VideoEmbed from './VideoEmbed';
import { ReferFriendsCarousel } from '../../ui/ReferFriendsCarousel';
import FAQs from '../../ui/FAQs';

const EducationalResources: React.FC = () => {
  const resources = [
    {
      title: 'How to Create a Meme Coin',
      link: '/resources/create-meme-coin',
    },
    {
      title: 'Understanding Blockchain Technology',
      link: '/resources/blockchain-basics',
    },
    // Add more resources as needed
  ];

  // Step 1: Define an array of video data
  const videos = [
    {
      videoSrc: '/assets/videos/education-video.mp4',
      title: 'Crypto 101: Start Your Digital Journey',
      description:
        'New to crypto? Learn the basics of blockchain, wallets, and digital currencies in easy-to-follow lessons.',
      buttonText: 'Start Learning',
    },
    {
      videoSrc: '/assets/videos/education-video.mp4',
      title: 'Advanced Blockchain Concepts',
      description:
        'Dive deeper into blockchain technology and explore advanced concepts like smart contracts and DeFi.',
      buttonText: 'Learn More',
    },
    {
      videoSrc: '/assets/videos/education-video.mp4',
      title: 'How to Create a Meme Coin',
      description:
        'Step-by-step guide to creating your own meme coin and launching it on the blockchain.',
      buttonText: 'Get Started',
    },
    {
      videoSrc: '/assets/videos/education-video.mp4',
      title: 'Understanding NFTs',
      description:
        'Learn what NFTs are, how they work, and how to create and trade them.',
      buttonText: 'Explore NFTs',
    },
  ];

  return (
    <>
      <Head>
        <title>Education | Yozoon</title>
        <meta name="description" content="Crypto Education Page" />
      </Head>
      <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25 md:py-3">
        <ReferFriendsCarousel />
      </div>
      <section className="bg-gradient-to-t from-[#343434] to-[#151515]">
            <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25">
                <h1
                    className="sofia-fonts text-[#FFFFFF] font-[700] text-[20px] md:text-[28px] text-center pt-6 pb-3 md:pt-18 md:pb-6">
                    EDUCATION </h1>

            </div>
        </section>
      <div className="Journey-sec bg-[#181A20] pb-2 md:pb-12">
        <div className="container mx-auto px-4 lg:px-10 xl:px-25">
          <h1 className="text-center text-[#FFFFFF] font-[700] sofia-fonts text-[18px] md:text-[22px]">
            User Guide
          </h1>
          <div>
            <div className="mt-4 md:mt-9 grid grid-1 sm:grid-cols-2 gap-3">
              {videos.map((video, index) => (
                <VideoEmbed
                  key={index}
                  videoSrc={video.videoSrc}
                  title={video.title}
                  description={video.description}
                  buttonText={video.buttonText}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <FAQs />
      {/* <section className="mt-7 EarningToday-sec bg-[#1E2329]">
        <div className="container mx-auto px-4 py-5 lg:px-10 xl:px-25 lg:py-12 text-center">
          <h1 className="text-[16px] md:text-[30px] sofia-fonts font-[600] text-white mb-3.5">
            Start Earning Today
          </h1>
          <div>
            <button className="colfaxfont bg-[#FFB92D] hover:bg-white hover:text-[#FFB92D] hover:border-1 hover:border-[#FFB92D] text-black text-xs md:text-sm md:font-[700] rounded-lg px-7 py-2 font-[500] shadow-xs shadow-black transition-all duration-300 ease-in-out">
              Sign Up Now
            </button>
          </div>
        </div>
      </section> */}

    
    </>
  );
};

export default EducationalResources;
