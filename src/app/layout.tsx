import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import PromoBanner from "@/components/PromoBanner";
import WhastappButton from "@/components/buttons/WhastappButton";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "./auth";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { generateSiteMetadata } from "@/utils/metadata";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = generateSiteMetadata();

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Coding Latam",
  url: "https://codinglatam.dev",
  logo: "https://codinglatam.dev/og.png",
  description:
    "Socio tecnológico de empresas y equipos: capacitación en IA, agentes a medida y automatización de procesos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es" className="overflow-x-hidden">
      <head>
        <JsonLd data={organizationSchema} />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-3WYMKRCHYH`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3WYMKRCHYH', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D5TU47BC77U3O6ND7K9G');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1589015306249568');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        className={`bg-light-black ${firaCode.className} relative min-h-screen flex flex-col`}
      >
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1589015306249568&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <SessionProvider session={session}>
          <CurrencyProvider>
            <Navbar />
            <PromoBanner />

            {/* <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow"> */}
            {children}
            {/* </main> */}
            <Footer />
          </CurrencyProvider>
        </SessionProvider>
        <div className="bg-white rounded-full w-16 fixed bottom-5 right-4">
          <WhastappButton />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
