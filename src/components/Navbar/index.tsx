"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  Settings,
  User,
  ChevronDown,
  Rocket,
  Play,
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

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

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
        signOut({ redirectTo: "/login" });
      }
    });
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSettingsOpen(false);
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
          <div className="menu gap-12  flex items-center">
            <Link
              href="/proyectos"
              className="text-white/90 flex gap-2 items-center"
            >
              <Rocket size={18} />
              Proyectos
            </Link>
            <Link
              href="/en-vivo"
              className="hidden text-white/90 md:flex items-center gap-2"
            >
              <Play size={18} />
              Cursos en vivo
            </Link>
            {session?.user ? (
              <div className="hidden md:flex items-center gap-4 ">
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
                    {profileData?.name
                      ? profileData?.name
                      : session?.user?.name}
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
                        href="/perfil"
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
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Ingresar
              </Link>
            )}

            {/* Mobile Menu Button */}
            {session?.user && (
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
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {session?.user && isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {session?.user && (
              <div className="px-3 py-2 text-gray-700 border-b flex items-center gap-2">
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
            )}

            <button
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
              }}
            >
              <User className="h-4 w-4 inline mr-2" />
              Mi Perfil
              <ChevronDown
                size={16}
                className={`ml-2 transform transition-transform ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSettingsOpen && (
              <div className="bg-white py-1">
                <Link
                  href="/perfil"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 inline mx-3" />
                  Completar perfil
                </Link>
              </div>
            )}
            <button
              className="w-full mt-2 flex items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
