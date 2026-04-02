import { ShieldCheck, XCircle, ExternalLink } from "lucide-react";
import Logo from "@/components/Logo";
import { getCertificateByCode } from "@/utils/common";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { generateCertificateMetadata } from "@/utils/metadata";
import Link from "next/link";

export const revalidate = 3600;

type Params = Promise<{ code: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);

  if (!certificate) {
    return {
      title: "Certificado no encontrado",
      description: "El certificado que buscas no existe o no es válido",
    };
  }

  return generateCertificateMetadata(certificate);
}

export async function generateStaticParams() {
  try {
    const certificatesRef = collection(db, "certificates");
    const querySnapshot = await getDocs(certificatesRef);

    return querySnapshot.docs.map((doc) => ({
      code: doc.data().code,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CertificatePage({ params }: { params: Params }) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);

  if (!certificate || !certificate.isValid) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-24">
        <div className="max-w-md mx-auto text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Certificado no encontrado
          </h1>
          <p className="text-white/50 mb-8">
            El código de verificación no corresponde a ningún certificado
            válido.
          </p>
          <Link
            href="/certificados"
            className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
          >
            Intentar con otro código
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-24">
      {/* Verified badge */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <ShieldCheck className="h-5 w-5 text-green-400" />
        <span className="text-sm font-medium text-green-400">
          Certificado Verificado
        </span>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Certificate frame — double border like a real certificate */}
        <div className="bg-white rounded-sm p-2 md:p-3">
          <div className="border-2 border-gray-300 rounded-sm p-1.5 md:p-2">
            <div className="border border-gray-200 rounded-sm px-6 py-10 md:px-12 md:py-14 text-center">
              {/* Logo */}
              <div className="flex justify-center mb-6 [&_svg]:fill-gray-900 [&_.fill-white]:fill-gray-900 [&_line]:stroke-gray-900">
                <Logo />
              </div>

              {/* Title */}
              <h2 className="text-xs tracking-[0.3em] uppercase text-gray-700 mb-1">
                Certifica a
              </h2>
              {/* <p className="text-sm text-gray-400 mb-8">
                Este certificado se otorga a
              </p> */}

              {/* Student name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200 mx-auto max-w-md">
                {certificate.studentName}
              </h1>

              {/* Body */}
              <p className="text-sm text-gray-500 mb-2">
                Por haber completado exitosamente el programa
              </p>
              <p className="text-xl md:text-3xl font-semibold text-gray-800 mb-10">
                {certificate.courseName}
              </p>

              {/* Date & signature area */}
              <div className="flex items-end justify-center gap-12 md:gap-20 mb-8">
                <div className="text-center">
                  <p className="text-sm text-gray-900 mb-1 pb-1 border-b border-gray-300 px-4">
                    {formatDate(certificate.completionDate)}
                  </p>
                  <p className="text-xs text-gray-400">Fecha</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-900 mb-1 pb-1 border-b border-gray-300 px-4">
                    Angelo Leva
                  </p>
                  <p className="text-xs text-gray-400">Instructor</p>
                </div>
              </div>

              {/* Verification code */}
              <p className="text-xs text-gray-500 font-mono">
                ID: {certificate.code}
              </p>

              {/* Bottom ornament */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
                <div className="w-2 h-2 rotate-45 border border-gray-300" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions below the certificate */}
        <div className="flex flex-col items-center gap-4 mt-8">
          {certificate.certificateUrl && (
            <a
              href={certificate.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Ver Certificado PDF
            </a>
          )}
          <p className="text-xs text-white/25">
            Verificado en{" "}
            <Link
              href="/certificados"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              codinglatam.dev/certificados
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
