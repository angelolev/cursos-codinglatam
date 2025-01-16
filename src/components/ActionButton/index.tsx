"use client";
import { Play } from "lucide-react";
import Link from "next/link";
import LoginButton from "../LoginButton";
import { useSession } from "next-auth/react";

interface ActionButtonProps {
  href: string;
  label: string;
}

export default function ActionButton({ href, label }: ActionButtonProps) {
  const { data: session } = useSession();
  const user = session?.user;

  console.log(user, "action user");

  if (!user) {
    return (
      <div className="flex flex-col text-center gap-2">
        <LoginButton />
      </div>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      <Play className="h-5 w-5 mr-2" />
      {label}
    </Link>
  );
}
