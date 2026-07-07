import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserSubscriptionData } from "@/types/user";

/**
 * Check if a user has valid premium access based on their subscription data
 */
export async function isUserPremium(userId: string): Promise<boolean> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data() as UserSubscriptionData;
    
    // If not premium in database, return false
    if (!userData.isPremium) {
      return false;
    }
    
    // If subscription is cancelled, check if grace period has ended.
    // This is a read-only gating decision: we return false once the grace
    // period is over. Persisting the "expired" status is handled server-side
    // by the Lemon Squeezy webhook (Admin SDK) — the client must not write to
    // `users` (Firestore rules deny it, and it would be a paywall-bypass vector).
    if (userData.subscriptionStatus === 'cancelled' && userData.endsAt) {
      try {
        const endDate = new Date(userData.endsAt);
        const now = new Date();

        if (now > endDate) {
          return false;
        }
      } catch (error) {
        console.error("Error parsing endsAt date:", userData.endsAt, error);
        // If date parsing fails, assume subscription is still valid
      }
    }

    // For other statuses, trust the database value
    return userData.isPremium;
  } catch (error) {
    console.error("Error checking user premium status:", error);
    return false;
  }
}

/**
 * Get user subscription details
 */
export async function getUserSubscriptionData(userId: string): Promise<UserSubscriptionData | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserSubscriptionData;
  } catch (error) {
    console.error("Error getting user subscription data:", error);
    return null;
  }
}