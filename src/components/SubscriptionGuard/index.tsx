"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isUserPremium } from "@/utils/subscription";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that checks real-time subscription status and protects premium content
 */
export default function SubscriptionGuard({ children, fallback }: SubscriptionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function validateSubscription() {
      if (status === "loading") return;
      
      if (!session?.user?.aud) {
        setHasAccess(false);
        setIsValidating(false);
        return;
      }

      try {
        const premiumStatus = await isUserPremium(session.user.aud);
        setHasAccess(premiumStatus);
        
        // If user lost premium access, redirect to pro page
        if (!premiumStatus) {
          router.push("/pro");
          return;
        }
      } catch (error) {
        console.error("Error validating subscription:", error);
        setHasAccess(false);
      } finally {
        setIsValidating(false);
      }
    }

    validateSubscription();
  }, [session, status, router]);

  // Show loading state while validating
  if (isValidating || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show fallback or redirect if no access
  if (!hasAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Premium Access Required</h2>
          <p className="text-white/70 mb-6">This content requires an active premium subscription.</p>
          <button
            onClick={() => router.push("/pro")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}