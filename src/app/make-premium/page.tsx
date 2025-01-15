// components/MakePremium.tsx
"use client";
import { useState } from "react";
import { useAuth } from "../auth/auth-context";

export default function MakePremium() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isPremium } = useAuth();

  const handleUpgradeToPremium = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/make-premium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upgrade to premium");
      }

      // Force token refresh to update claims
      await user.getIdToken(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded">
        You are already a premium user!
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={handleUpgradeToPremium}
        disabled={loading || !user}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Upgrading..." : "Upgrade to Premium"}
      </button>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
