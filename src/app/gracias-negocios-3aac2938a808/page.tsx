import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Video, Calendar } from "lucide-react";
import { cardClass, TopAccent, WhatsAppIcon } from "@/components/claude-brochure";

export const dynamic = "force-static";

// URL sin listar en ningún lugar del sitio ni en el sitemap: solo se llega
// aquí desde la redirección de Hotmart tras un pago aprobado. No es una
// verificación real (cualquiera con el link exacto podría entrar), así
// que no debe ser la única defensa si el grupo de WhatsApp es sensible.
export const metadata: Metadata = {
  title: "Gracias por tu compra",
  robots: { index: false, follow: false },
};

const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/DwRehCZABQ88kd0xMul6e3?s=cl&p=a&mlu=4&ilr=4";

export default function GraciasClaudeNegociosPage() {
  return (
    <main className="pt-24 pb-16 mx-auto w-full max-w-2xl sm:px-6 px-4 flex-grow min-w-0 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-terminal-green/15 border border-terminal-green/30 mb-6">
        <CheckCircle2 className="h-8 w-8 text-terminal-green" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
        ¡Gracias por inscribirte a Claude para Negocios!
      </h1>
      <p className="text-white/60 mb-10">
        Tu pago fue procesado por Hotmart. En unos minutos te llega el correo
        de confirmación con los detalles — revisa también spam/promociones
        por si acaso. El siguiente paso es unirte al grupo oficial de
        WhatsApp del curso.
      </p>

      <div className={`${cardClass} border-[#25D366]/30 bg-[#25D366]/[0.06] p-6 sm:p-8 mb-10`}>
        <TopAccent />
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15">
          <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white/90">
          Únete al grupo oficial del curso
        </h2>
        <p className="mb-6 text-sm text-white/60">
          Los accesos y materiales se subirán a una carpeta compartida a la
          que tendrás acceso en breve. Todos los avisos importantes se
          comparten primero por este grupo.
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

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/60">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
          <Calendar className="h-4 w-4 text-claude" />
          Clases en vivo desde el 13 de octubre de 2026 (fecha estimada)
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
          <Video className="h-4 w-4 text-claude" />
          Martes y jueves · 8:00 – 10:00 PM (hora Perú)
        </span>
      </div>
    </main>
  );
}
