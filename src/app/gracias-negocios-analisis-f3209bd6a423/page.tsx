import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";
import { cardClass, TopAccent, WhatsAppIcon } from "@/components/claude-brochure";

export const dynamic = "force-static";

// URL sin listar en ningún lugar del sitio ni en el sitemap: solo se llega
// aquí desde la redirección de Hotmart cuando la compra queda "a la espera
// del análisis de crédito" (revisión del banco emisor de la tarjeta). No
// hay una verificación real (cualquiera con el link exacto podría entrar),
// así que no debe ser la única defensa.
export const metadata: Metadata = {
  title: "Tu pago está en revisión",
  robots: { index: false, follow: false },
};

const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/DwRehCZABQ88kd0xMul6e3?s=cl&p=a&mlu=4&ilr=4";

export default function GraciasClaudeNegociosAnalisisPage() {
  return (
    <main className="pt-24 pb-16 mx-auto w-full max-w-2xl sm:px-6 px-4 flex-grow min-w-0 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-claude-deep/15 border border-claude-deep/30 mb-6">
        <ShieldCheck className="h-8 w-8 text-claude" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
        Tu pago está en revisión
      </h1>
      <p className="text-white/60 mb-10">
        Tu banco está haciendo una verificación de seguridad estándar sobre
        el pago con tarjeta. Esto normalmente se resuelve en minutos, y no
        necesitas hacer nada más de tu parte.
      </p>

      <div className={`${cardClass} p-6 sm:p-8 mb-10`}>
        <TopAccent />
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-claude-deep/10">
          <Mail className="h-6 w-6 text-claude" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white/90">
          Revisa tu correo
        </h2>
        <p className="text-sm text-white/60">
          En cuanto tu banco apruebe el pago, te llega un correo con la
          confirmación de tu inscripción a Claude para Negocios.
        </p>
      </div>

      <div className={`${cardClass} border-[#25D366]/30 bg-[#25D366]/[0.06] p-6 sm:p-8`}>
        <TopAccent />
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15">
          <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white/90">
          Únete al grupo oficial del curso
        </h2>
        <p className="mb-6 text-sm text-white/60">
          Puedes unirte mientras se confirma tu pago. Los accesos y
          materiales se subirán a una carpeta compartida a la que tendrás
          acceso en breve.
        </p>
        <Link
          href={WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-[#25D366] px-8 py-4 font-bold text-white shadow-lg shadow-[#25D366]/25 transition-all duration-200 hover:bg-[#1ebe5d] hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Unirme al grupo de WhatsApp
        </Link>
      </div>
    </main>
  );
}
