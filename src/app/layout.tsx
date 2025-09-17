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
