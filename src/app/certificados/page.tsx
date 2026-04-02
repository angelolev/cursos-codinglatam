"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Search } from "lucide-react";

export default function CertificadosPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) {
      router.push(`/certificados/${trimmed}`);
    }
  }

  return (
    <div className="container mx-auto px-4 py-28 flex-1 flex flex-col justify-center">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-400/10 mb-5">
            <ShieldCheck className="h-7 w-7 text-primary-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Verificar Certificado
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Ingresa el código de verificación para comprobar la autenticidad de
            un certificado de Coding Latam.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ej: a3bx9k2m"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-400 transition-colors font-mono text-center text-lg tracking-[0.2em]"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim()}
            className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-300 text-white text-sm rounded-xl font-medium hover:bg-primary-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Verificar
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          El código se encuentra en la parte inferior de tu certificado.
        </p>
      </div>
    </div>
  );
}
