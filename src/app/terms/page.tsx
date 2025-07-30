import { FC } from "react";
import { FileText } from "lucide-react";

const TermsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-white mb-6">Términos de Uso</h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
          Al acceder y utilizar nuestros servicios, aceptas cumplir con los
          siguientes términos y condiciones.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          1. Uso de la Plataforma
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Te comprometes a utilizar la plataforma de manera responsable y a no
          compartir tu cuenta con terceros. El contenido es para tu uso personal
          y no comercial.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          2. Propiedad Intelectual
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Todo el contenido, incluyendo cursos, videos y materiales, es
          propiedad de CodingLatam y está protegido por las leyes de derechos de
          autor.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          3. Limitación de Responsabilidad
        </h2>
        <p className="text-lg text-gray-700">
          No nos hacemos responsables por cualquier daño directo o indirecto que
          pueda resultar del uso de nuestra plataforma.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
