import { FC } from "react";
import { Shield } from "lucide-react";
import { generatePageMetadata } from "@/utils/metadata";

export const dynamic = 'force-static';

export function generateMetadata() {
  return generatePageMetadata(
    "Política de Privacidad",
    "Conoce cómo manejamos y protegemos tu información personal en Coding Latam. Tu privacidad es importante para nosotros.",
    "/privacy"
  );
}

const PrivacyPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-white mb-6">
          Política de Privacidad
        </h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
          Tu privacidad es importante para nosotros. Aquí te explicamos cómo
          manejamos tus datos.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          1. Información que Recopilamos
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Recopilamos información que nos proporcionas al registrarte, como tu
          nombre y correo electrónico, así como datos sobre tu progreso en los
          cursos.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          2. Uso de la Información
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Utilizamos tus datos para personalizar tu experiencia de aprendizaje,
          procesar pagos y comunicarnos contigo sobre novedades y
          actualizaciones.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          3. Intercambio de Información
        </h2>
        <p className="text-lg text-gray-700">
          No compartimos tu información personal con terceros, excepto cuando es
          necesario para proveer nuestros servicios (por ejemplo, con pasarelas
          de pago).
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
