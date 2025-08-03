import React from "react";
import { CheckCircle2, PartyPopper } from "lucide-react";

export const dynamic = 'force-static';

export default function ThankYou() {
  return (
    <div className="pt-48 pb-16 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-white/90 mb-4">
            Gracias por tu compra!!!
            <PartyPopper className="h-8 w-8 inline-block text-yellow-500" />
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Bienvenido al grupo de estudio. Tu viaje para convertirte en un
            desarrollador excepcional comienza ahora.
          </p>
        </div>
      </div>
    </div>
  );
}
