"use client";
import { useAuth } from "@/app/auth/auth-context";
import { Download } from "lucide-react";
import Link from "next/link";
import RegisterButton from "../RegisterButton";

interface ActionButtonProps {
  href: string;
  label: string;
}

export default function ActionButton({ href, label }: ActionButtonProps) {
  const { user } = useAuth();

  if (!user) {
    return <RegisterButton />;
  }

  return (
    <Link
      href={href}
      target="_blank"
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      <Download className="h-5 w-5 mr-2" />
      {label}
    </Link>
  );
}
