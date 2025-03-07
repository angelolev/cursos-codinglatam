"use client";
import { useSession } from "next-auth/react";
import LikeIcon from "../LikeIcon";

interface LikeMaterialProps {
  guid: string;
  label?: string;
  color: string;
}

export default function LikeMaterial({
  guid,
  label,
  color,
}: LikeMaterialProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="like flex items-center gap-2">
      {label && <span className="text-white/90">{label}</span>}
      <LikeIcon color={color} classId={guid} />
    </div>
  );
}
