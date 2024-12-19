import type { Metadata } from "next";
import AuthProviderWrapper from "@/app/auth/auth-provider";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cursos | Coding Latam",
  description: "Aprende HACIENDO proyectos REALES",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`bg-slate-100 dark:bg-light-black ${firaCode.className}`}
      >
        <Navbar />
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
