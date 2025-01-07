"use client";
import React from "react";
import Logo from "../Logo";
import Link from "next/link";
import { useAuth } from "@/app/auth/auth-context";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-800 shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href={"/"}>
              <Logo />
            </Link>
          </div>

          {user ? (
            <div className="flex gap-4 items-center">
              <p className="text-white/70">{user?.email}</p>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors"
                onClick={logout}
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors"
            >
              Acceder
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
