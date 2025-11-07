// src/pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" suppressHydrationWarning>
        <Head>
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Meta Tags for SEO */}
          <meta
            name="description"
            content="Yozoon - Launch Your Meme Coin Securely and Creatively!"
          />
          <meta
            name="keywords"
            content="Meme Coin, Cryptocurrency, Launchpad, Secure Crypto Platform"
          />
          <meta property="og:title" content="Meme Launchpad" />
          <meta
            property="og:description"
            content="Launch Your Meme Coin Securely and Creatively!"
          />
          <meta property="og:image" content="/og-image.png" />
          <meta property="og:url" content="https://www.yozoon.com" />
          <meta name="twitter:card" content="summary_large_image" />

          {/* Accessibility */}
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
