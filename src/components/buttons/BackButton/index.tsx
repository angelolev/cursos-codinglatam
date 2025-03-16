import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  label?: string;
  href?: string;
}

export default function BackButton({
  label = "Volver",
  href = "/",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-indigo-400 font-bold hover:text-indigo-500 mb-8"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </Link>
  );
}
