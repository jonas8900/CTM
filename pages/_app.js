import Head from "next/head";
import '../styles/globals.css';
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then((registration) => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch((error) => {
                        console.error('Service Worker registration failed:', error);
                    });
            });
        }
    }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="ctm-theme" disableTransitionOnChange>
      <Head>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>CatchTheMoment</title>
            <meta name="description" content="Fange den Moment ein, genieße den Abend und blicke mit Freude auf die Erinnerungen zurück." />
            <link rel="shortcut icon" href="/icons/192x192.png" />
            <link rel="mask-icon" href="/icons/192x192.png" color="#FFFFFF" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="apple-touch-icon" href="/icons/192x192.png" />
            <link
                rel="apple-touch-icon"
                sizes="512x512"
                href="/icons/512x512.png"
            />
            <link rel="manifest" href="/manifest.json" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:url" content="https://yourdomain.com" />
            <meta name="twitter:title" content="CatchTheMoment" />
            <meta name="twitter:description" content="Fange den Moment ein, genieße den Abend und blicke mit Freude auf die Erinnerungen zurück." />
            <meta name="twitter:image" content="/icons/512x512.png" />
            <meta name="twitter:creator" content="@DavidWShadow" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="CatchTheMoment" />
            <meta property="og:description" content="Fange den Moment ein, genieße den Abend und blicke mit Freude auf die Erinnerungen zurück." />
            <meta property="og:site_name" content="CatchTheMoment" />
            <meta property="og:url" content="https://yourdomain.com" />
            <meta property="og:image" content="/icons/512x512.png" />
        </Head>
        <Component {...pageProps} />
    </ThemeProvider>
  );
}
