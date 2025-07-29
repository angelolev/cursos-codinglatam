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
    
    // If subscription is cancelled, check if grace period has ended
    if (userData.subscriptionStatus === 'cancelled' && userData.endsAt) {
      try {
        const endDate = new Date(userData.endsAt);
        const now = new Date();
        
        // If grace period has ended, update database and return false
        if (now > endDate) {
          await updateExpiredSubscription(userId);
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
 * Update user subscription to expired status
 */
async function updateExpiredSubscription(userId: string) {
  try {
    const userDocRef = doc(db, "users", userId);
    const { updateDoc } = await import("firebase/firestore");
    
    await updateDoc(userDocRef, {
      isPremium: false,
      subscriptionStatus: 'expired',
      updatedAt: new Date().toISOString()
    });
    
    console.log(`Auto-expired subscription for user ${userId}`);
  } catch (error) {
    console.error("Error updating expired subscription:", error);
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