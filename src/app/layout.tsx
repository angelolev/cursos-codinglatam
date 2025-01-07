import type { Metadata } from "next";
import AuthProviderWrapper from "@/app/auth/auth-provider";
import { Fira_Code } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

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
      <body className={`bg-light-black ${firaCode.className}`}>
        <AuthProviderWrapper>
          <Navbar />
          <main className="pt-24 mx-auto max-w-7xl px-4">{children}</main>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
