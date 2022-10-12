import { useEffect } from 'react';
import Head from 'next/head';

import Intro from '../components/Intro';

export default function Home() {
  useEffect(() => {
    if (window.console) {
    }
  }, []);

  return (
    <div style={{color: "#ffffff",}}>
      <Head>
        <title>Skeleton</title>
        <meta name="Skeleton" content="Skeleton!" />
        <link rel="icon" href="/images/logo.png" />

        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <Intro />
    </div>
  );
}