import Image from "next/image";

import alignet from "@/assets/logos/alignet.webp";
import ayesa from "@/assets/logos/ayesa.svg";
import aynitech from "@/assets/logos/aynitech.svg";
import bw2 from "@/assets/logos/bw2.svg";
import crehana from "@/assets/logos/crehana.webp";
import culqi from "@/assets/logos/culqi-logo.png";
import encora from "@/assets/logos/encora_logo_green.svg";
import enotria from "@/assets/logos/enotria.webp";
import gys from "@/assets/logos/gys.png";
import idsLatam from "@/assets/logos/ids-latam.png";
import igp from "@/assets/logos/igp.webp";
import labofta from "@/assets/logos/labofta.svg";
import laPositiva from "@/assets/logos/la-positiva.webp";
import upc from "@/assets/logos/logo_upc_red.png";
import intelica from "@/assets/logos/logo-intelica.svg";
import neuralab from "@/assets/logos/neuralab-logo.webp";
import nisum from "@/assets/logos/nisum-technologies-logo.webp";
import pci from "@/assets/logos/pci-energy-solutions.svg";
import periferia from "@/assets/logos/periferia-it-group.webp";
import perpetual from "@/assets/logos/perpetual-technologies-logo-footer.svg";
import qtc from "@/assets/logos/qtc.webp";
import singular from "@/assets/logos/singular-tech.webp";
import softtek from "@/assets/logos/SofttekLogo-4web.svg";
import tramarsa from "@/assets/logos/tramarsa.svg";

import type { StaticImageData } from "next/image";

interface Logo {
  src: StaticImageData | string;
  alt: string;
  white?: boolean;
}

const logos: Logo[] = [
  { src: alignet, alt: "Alignet" },
  { src: ayesa, alt: "Ayesa" },
  { src: aynitech, alt: "Aynitech" },
  { src: bw2, alt: "BW2" },
  { src: crehana, alt: "Crehana" },
  { src: culqi, alt: "Culqi", white: true },
  { src: encora, alt: "Encora" },
  { src: enotria, alt: "Enotria", white: true },
  { src: gys, alt: "GYS" },
  { src: idsLatam, alt: "IDS Latam" },
  { src: igp, alt: "IGP" },
  { src: labofta, alt: "Labofta" },
  { src: laPositiva, alt: "La Positiva" },
  { src: upc, alt: "UPC", white: true },
  { src: intelica, alt: "Intelica", white: true },
  { src: neuralab, alt: "Neuralab" },
  { src: nisum, alt: "Nisum Technologies" },
  { src: pci, alt: "PCI Energy Solutions" },
  { src: periferia, alt: "Periferia IT Group" },
  { src: perpetual, alt: "Perpetual Technologies" },
  { src: qtc, alt: "QTC" },
  { src: singular, alt: "Singular Tech", white: true },
  { src: softtek, alt: "Softtek" },
  { src: tramarsa, alt: "Tramarsa" },
];

const row1 = logos.slice(0, 12);
const row2 = logos.slice(12);

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <div className="flex-none flex items-center justify-center h-[80px] mx-8">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={160}
        height={64}
        className={`object-contain max-h-[64px] w-auto opacity-60 transition-opacity duration-300 hover:opacity-100 ${logo.white ? "brightness-0 invert" : ""}`}
      />
    </div>
  );
}

export default function CompanyLogos() {
  return (
    <section className="mb-24">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
          Equipos de estas empresas ya se han formado con nosotros
        </p>
      </div>

      {/* El desvanecido de los bordes se hace con máscara y no con un degradado
          encima: el suelo lleva gradientes y grano, así que un overlay de color
          plano dejaría un corte visible. */}
      <div className="company-logos-track group relative overflow-hidden">
        {/* Fila 1 — avanza hacia la izquierda */}
        <div className="flex mb-8 company-logos-marquee">
          {row1.map((logo, i) => (
            <LogoItem key={`r1a-${i}`} logo={logo} />
          ))}
          {row1.map((logo, i) => (
            <LogoItem key={`r1b-${i}`} logo={logo} />
          ))}
        </div>

        {/* Fila 2 — avanza hacia la derecha */}
        <div className="flex company-logos-marquee-reverse">
          {row2.map((logo, i) => (
            <LogoItem key={`r2a-${i}`} logo={logo} />
          ))}
          {row2.map((logo, i) => (
            <LogoItem key={`r2b-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
