"use client";
import React, { use, useEffect, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  Home,
  BookOpen,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import Logo from "../Logo";
import { useAuth } from "@/app/auth/auth-context";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { DocumentData } from "firebase/firestore";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogout = () => {
    setIsMenuOpen(!isMenuOpen);
    logout();
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSettingsOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };

      fetchData();
    }
  }, [user, profileData]);

  return (
    <nav className="bg-slate-800 shadow-sm fixed w-full z-10">
      {/* Desktop Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <Logo />
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  {profileData?.name ? profileData.name : user?.email}
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
                      href="/"
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home size={20} />
                      <span>Inicio</span>
                    </Link>
                    <Link
                      href="/"
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookOpen size={20} />
                      <span>Mis cursos</span>
                    </Link>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsSettingsOpen(!isSettingsOpen);
                      }}
                    >
                      <Settings size={20} />
                      <span>Setting</span>
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
                          className="w-full flex items-center gap-3 px-7 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4 inline ml-3" />
                          Completar perfil
                        </Link>
                        {/* <Link
                          href="/social-media"
                          className="w-full flex items-center gap-3 px-7 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4 inline ml-3" />
                          Redes sociales
                        </Link> */}
                        <Link
                          href="/dashboard"
                          className="w-full flex items-center gap-3 px-7 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4 inline ml-3" />
                          Cambiar password
                        </Link>
                      </div>
                    )}

                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-gray-50 transition-colors"
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
          {user && (
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

      {/* Mobile menu */}
      {user && isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {user && (
              <div className="px-3 py-2 text-gray-700 border-b">
                <User className="h-4 w-4 inline mr-2" />
                {user?.email}
              </div>
            )}

            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              <Home className="h-4 w-4 inline mr-2" />
              Inicio
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Mis cursos
            </Link>
            <button
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
              }}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Setting
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
                {/* <Link
                  href="/social-media"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 inline mx-3" />
                  Redes sociales
                </Link> */}
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 inline mx-3" />
                  Cambiar password
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
