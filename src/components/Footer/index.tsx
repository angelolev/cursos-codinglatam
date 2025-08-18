import { Github, Linkedin, Instagram, Youtube, Twitch } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-800 px-4 sm:px-6 lg:px-8  mt-12 md:mt-24">
      <div className="max-w-7xl mx-auto text-white py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Coding Latam</h3>
            <p className="text-gray-400 mb-4">
              Aprende HACIENDO proyectos REALES
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com/codinglatam"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://github.com/Coding-Latam"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href="https://youtube.com/@codinglatam"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/65901297"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.twitch.tv/codinglatam"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitch className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Aprendizaje</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cursos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  href="/workshops"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/proyectos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Proyectos
                </Link>
              </li>
              {/* <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Comunidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Learning Paths
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {/* <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li> */}
              <li>
                <Link
                  href="/certifications"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Certificaciones
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://discord.gg/McZHP247Kv"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="/guias"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Guías
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Nosotros</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Acerca de
                </Link>
              </li>
              {/* <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Press Kit
                </Link>
              </li> */}
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2025 Coding Latam. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
