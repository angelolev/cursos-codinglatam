"use client";
import { useAuth } from "@/app/auth/auth-context";
import LikeIcon from "../LikeIcon";

interface LikeMaterialProps {
  guid: string;
  label: string;
}

export default function LikeMaterial({ guid, label }: LikeMaterialProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="like flex items-center gap-2">
      <span className="text-white/90">{label}</span>
      <LikeIcon classId={guid} />
    </div>
  );
}
