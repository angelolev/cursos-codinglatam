"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown,
  Play,
  CalendarDays,
} from "lucide-react";
import Logo from "../Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { DocumentData } from "firebase/firestore";
import Swal from "sweetalert2";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import CurrencySelector from "../CurrencySelector";
import { WhatsAppIcon } from "@/components/claude-brochure/primitives";
import {
  CALENDAR_URL,
  CONTACT_WHATSAPP_URL,
} from "@/components/home/constants";

// Navegación enfocada en el comprador corporativo. El catálogo de aprendizaje
// (cursos, proyectos, guías) sigue accesible desde el footer y desde el perfil.
const navLinks = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Cómo trabajamos", href: "/#proceso" },
  { label: "Programas", href: "/#programas" },
];

// El selector de moneda solo aporta donde hay precios en pantalla.
const PRICING_ROUTES = ["/cursos", "/pro", "/workshops", "/guias", "/en-vivo"];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  const showCurrency = PRICING_ROUTES.some((route) =>
    pathname?.startsWith(route),
  );

  const handleLogout = () => {
    Swal.fire({
      title: "¿Realmente deseas salir?",
      text: "Tu sesión será cerrada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsMenuOpen(!isMenuOpen);
        signOut({ redirectTo: "/" });
      }
    });
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (session?.user) {
      if (session?.user?.aud) {
        const docRef = doc(db, "users", session?.user?.aud);
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setProfileData(doc.data());
          }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      }
    }
  }, [session?.user]);

  return (
    <nav className="bg-slate-800 shadow-sm fixed w-full z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="menu flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-primary-300"
            >
              <CalendarDays className="h-4 w-4" />
              Agendar llamada
            </Link>

            {session?.user ? (
              <div className="hidden md:flex items-center gap-4 ">
                {!session.user.isPremium && showCurrency && <CurrencySelector />}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 text-white/90 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <Image
                        src={session?.user?.image || "/default-avatar.png"}
                        alt={
                          profileData?.name
                            ? profileData?.name
                            : session?.user?.email
                        }
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    </div>
                    <span className="hidden lg:block">
                      {profileData?.name
                        ? profileData?.name
                        : session?.user?.name}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        isMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        href="/cursos"
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Play className="h-4 w-4 inline" />
                        Mis cursos
                      </Link>
                      <Link
                        href="/profile"
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 inline" />
                        Mi perfil
                      </Link>

                      <button
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut size={20} />
                        <span>Salir</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              showCurrency && (
                <div className="hidden md:flex items-center gap-4">
                  <CurrencySelector />
                </div>
              )
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 space-y-1 bg-white border-t pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 border-b border-gray-200 flex py-2 px-3 gap-2 items-center"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 mt-3 flex items-center justify-center gap-2 rounded-md bg-primary-400 px-4 py-2.5 text-sm font-semibold text-zinc-950"
            >
              <CalendarDays className="h-4 w-4" />
              Agendar llamada
            </Link>
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 mt-2 flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>

            {session?.user && (
              <>
                <div className="px-3 py-2 text-gray-700 border-b border-t flex items-center gap-2">
                  <div className="relative">
                    <Image
                      src={session?.user?.image || "/default-avatar.png"}
                      alt={
                        profileData?.name
                          ? profileData?.name
                          : session?.user?.email
                      }
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>
                  {profileData?.name ? profileData?.name : session?.user?.name}
                </div>

                <Link
                  href="/cursos"
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Play className="h-4 w-4 inline" />
                  Mis cursos
                </Link>
                <Link
                  href="/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 inline" />
                  Mi perfil
                </Link>
                <button
                  className="w-full mt-2 flex items-center border-t pb-3 border-gray-200 px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
