"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  Home,
  BookOpen,
  Settings,
  User,
} from "lucide-react";
import Logo from "../Logo";
import { useAuth } from "@/app/auth/auth-context";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogout = () => {
    setIsMenuOpen(!isMenuOpen);
    logout();
  };

  useEffect(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [pathname, searchParams]);

  return (
    <nav className="bg-slate-800 shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href={"/"}>
              <Logo />
            </Link>
          </div>

          {/* Desktop menu */}
          {user && (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link href="/dashboard" className="text-white/90">
                {user?.email}
              </Link>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </button>
            </div>
          )}
          {!user && (
            <Link
              href={"/login"}
              className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors"
            >
              Ingresar
            </Link>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X color="#fff" className="h-6 w-6" />
              ) : (
                <Menu color="#fff" className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
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
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </Link>
            {user ? (
              <button
                className="w-full mt-2 flex items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </button>
            ) : (
              <Link
                href={"/login"}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
