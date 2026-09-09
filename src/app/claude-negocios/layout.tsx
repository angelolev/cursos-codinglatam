import type { Metadata } from "next";
import Script from "next/script";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Claude para Negocios — Curso en vivo",
    "Aprende a delegarle tu trabajo diario a la IA y a construir tus propios agentes conectados a tus herramientas. 8 sesiones en vivo, 16 horas, sin código y sin conocimientos técnicos previos. Del 6 de octubre al 5 de noviembre de 2026.",
    "/claude-negocios",
    "https://codinglatam.dev/claude-negocios-og.png"
  ),
  keywords: [
    "Claude para Negocios",
    "Claude IA para empresas",
    "curso de IA sin código",
    "productividad con IA",
    "agentes de IA para negocios",
    "automatización con Claude",
    "Coding Latam",
  ],
  alternates: { canonical: "https://codinglatam.dev/claude-negocios" },
};

export default function ClaudeNegociosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Meta Pixel — solo se carga dentro de /claude-negocios, no en el
          resto del sitio (antes vivía en el layout raíz). */}
      <Script id="meta-pixel-claude-negocios" strategy="afterInteractive">
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
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1589015306249568&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {children}
    </>
  );
}
