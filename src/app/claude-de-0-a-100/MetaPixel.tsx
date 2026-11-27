"use client";
import { useEffect } from "react";
import Script from "next/script";

const PIXEL_ID = "1589015306249568";
// Pixel de la cuenta publicitaria que corre los anuncios (294521562). Los
// anuncios solo pueden atribuir conversiones y armar públicos con pixeles
// de su cuenta, así que los eventos se envían a ambos.
const ADS_PIXEL_ID = "1099535653834248";

type Fbq = (...args: unknown[]) => void;

// Meta Pixel solo para /claude-de-0-a-100: registra la visita (PageView) y
// cada clic en un enlace de WhatsApp como "Contact", para medir cuántas
// personas que llegan desde los anuncios pasan a escribir por WhatsApp.
export function MetaPixel() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest?.('a[href*="wa.me/"]');
      if (!link) return;
      const fbq = (window as unknown as { fbq?: Fbq }).fbq;
      fbq?.("track", "Contact", {
        content_name: "Claude de 0 a 100",
        content_category: "Curso en vivo",
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <Script id="meta-pixel-claude-de-0-a-100" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('init', '${ADS_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
