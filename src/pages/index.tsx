// src/pages/index.tsx

import React from 'react';
import LandingPage from '../components/pages/LandingPage/LandingPage';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Yozoon</title>
        <meta name="description" content="Launch Your Meme Coin Securely and Creatively!" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Meme Launchpad",
              "url": "https://www.memelaunchpad.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.memelaunchpad.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </Head>
      <LandingPage />
    </>
  );
};

export default Home;
