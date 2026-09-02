"use client";
import React, { useEffect, useRef, useState } from "react";
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
import {
  ctaPrimary,
  ctaPrimaryCompact,
  ctaSecondary,
  focusRing,
} from "@/components/ui/actions";

// Navegación enfocada en el comprador corporativo. El catálogo de aprendizaje
// (cursos, proyectos, guías) sigue accesible desde el footer y desde el perfil.
const navLinks = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Cómo trabajamos", href: "/#proceso" },
  { label: "Programas", href: "/#programas" },
];

// Enlaces de cuenta, compartidos por el menú de escritorio y el cajón móvil.
const accountLinks = [
  { label: "Mis cursos", href: "/cursos", icon: Play },
  { label: "Mi perfil", href: "/profile", icon: Settings },
];

// El selector de moneda solo aporta donde hay precios en pantalla.
const PRICING_ROUTES = ["/cursos", "/pro", "/workshops", "/guias", "/en-vivo"];

const drawerRowClass = `flex w-full items-center gap-3 py-4 text-base text-white/85 transition-colors hover:text-primary-300 ${focusRing}`;

export function Navbar() {
  // Dos menús distintos, dos estados. Antes compartían uno solo, así que abrir
  // el de usuario en escritorio abría también el cajón móvil.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  const showCurrency = PRICING_ROUTES.some((route) =>
    pathname?.startsWith(route),
  );

  const closeMenus = () => {
    setIsDrawerOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Realmente deseas salir?",
      text: "Tu sesión será cerrada",
      icon: "warning",
      showCancelButton: true,
      // Paleta del sistema: brasa profunda y carbón, nunca el azul por defecto.
      background: "#1e1e1e",
      color: "#ffffff",
      confirmButtonColor: "#a84f15",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Sí, quiero salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        closeMenus();
        signOut({ redirectTo: "/" });
      }
    });
  };

  useEffect(() => {
    closeMenus();
  }, [pathname]);

  // Escape cierra cualquiera de los dos menús.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Un clic fuera cierra el menú de usuario de escritorio.
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isUserMenuOpen]);

  // Con el cajón abierto la página de atrás no debe desplazarse.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDrawerOpen]);

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

  const displayName = profileData?.name ?? session?.user?.name;
  const avatarAlt = profileData?.name ?? session?.user?.email ?? "";

  return (
    <nav className="bg-slate-800 shadow-sm fixed w-full z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className={`rounded-sm ${focusRing}`}>
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="menu flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-sm text-sm text-white/80 transition-colors hover:text-white ${focusRing}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Envuelto en un contenedor porque las clases de acción ya traen
                su propio `display`; ocultarlo aquí evitaría depender del orden
                en que Tailwind emite `hidden` e `inline-flex`. */}
            <div className="hidden md:block">
              <Link
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaPrimaryCompact}
              >
                <CalendarDays className="h-4 w-4" />
                Agendar llamada
              </Link>
            </div>

            {session?.user ? (
              <div className="hidden md:flex items-center gap-4 ">
                {!session.user.isPremium && showCurrency && <CurrencySelector />}
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    className={`flex cursor-pointer items-center gap-2 rounded-full text-white/90 transition-colors hover:text-white ${focusRing}`}
                  >
                    <Image
                      src={session?.user?.image || "/default-avatar.png"}
                      alt={avatarAlt}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <span className="hidden lg:block">{displayName}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] py-1 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.7)]">
                      {accountLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenus}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white ${focusRing}`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="my-1 h-px bg-white/10" />
                      <button
                        type="button"
                        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white ${focusRing}`}
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Salir
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

            {/* Mobile Menu Button — 44px de área táctil */}
            <button
              type="button"
              className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 md:hidden ${focusRing}`}
              onClick={() => setIsDrawerOpen((open) => !open)}
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-menu"
              aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Velo: atenúa la página y permite cerrar tocando fuera del panel. */}
      <div
        aria-hidden
        onClick={closeMenus}
        className={`fixed inset-x-0 bottom-0 top-16 z-30 bg-black/70 transition-[opacity,visibility] duration-200 ease-out motion-reduce:transition-none md:hidden ${
          isDrawerOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Menú móvil — panel opaco justo debajo de la barra. Se queda montado
          para poder animar entrada y salida; cerrado sale del foco y del árbol
          de accesibilidad. */}
      <div
        id="mobile-menu"
        inert={!isDrawerOpen}
        className={`absolute inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-[#161616] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.9)] transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none md:hidden ${
          isDrawerOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {/* Un ámbar muy tenue arriba para que el panel no sea un rectángulo
            negro plano: la misma luz que usa el hero, mucho más baja. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_60%_100%_at_80%_0%,rgba(236,176,51,0.10),transparent_70%)]"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-6">
          <ul className="divide-y divide-white/10 border-b border-white/10">
            {navLinks.map((link) => (
              <li key={link.href}>
                {/* El enlace es un ancla: `pathname` no cambia, así que el
                    cajón tiene que cerrarse a mano. */}
                <Link
                  href={link.href}
                  onClick={closeMenus}
                  className={drawerRowClass}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenus}
              className={`${ctaPrimary} w-full`}
            >
              <CalendarDays className="h-5 w-5" />
              Agendar llamada
            </Link>
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenus}
              className={`${ctaSecondary} w-full`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>
          </div>

          {session?.user && (
            <div className="pt-8">
              <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                <Image
                  src={session?.user?.image || "/default-avatar.png"}
                  alt={avatarAlt}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/90">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {accountLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenus}
                      className={drawerRowClass}
                    >
                      <item.icon className="h-4 w-4 text-white/50" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleLogout}
                className={`${drawerRowClass} cursor-pointer text-white/60 hover:text-white`}
              >
                <LogOut className="h-4 w-4 text-white/50" />
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
