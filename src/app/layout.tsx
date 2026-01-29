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

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = generateSiteMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es">
      <head>
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
      </head>
      <body
        className={`bg-light-black ${firaCode.className} relative min-h-screen flex flex-col`}
      >
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
        <div className="bg-white rounded-full max-w-16 fixed w-full bottom-5 right-4">
          <WhastappButton />
        </div>
      </body>
    </html>
  );
}
