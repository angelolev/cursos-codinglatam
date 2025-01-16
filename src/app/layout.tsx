import type { Metadata } from "next";
import AuthProviderWrapper from "@/app/auth/auth-provider";
import { Fira_Code } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import WhastappButton from "@/components/WhastappButton";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aprende a programar HACIENDO proyectos | Coding Latam",
  description: "Aprende HACIENDO proyectos REALES",
  openGraph: {
    title: "Cursos | Coding Latam",
    description: "Aprende HACIENDO proyectos REALES",
    url: "https://cursos.codinglatam.dev",
    siteName: "Coding Latam",
    images: [
      {
        url: "https://cursos.codinglatam.dev/og.png",
        width: 1200,
        height: 630,
        alt: "Coding Latam og image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className={`bg-light-black ${firaCode.className} relative`}>
        <AuthProviderWrapper>
          <SessionProvider>
            <Navbar />

            <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0">
              {children}
            </main>
          </SessionProvider>
          <div className="bg-white rounded-full max-w-16 fixed w-full bottom-5 right-4">
            <WhastappButton />
          </div>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
