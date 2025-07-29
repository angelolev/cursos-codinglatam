// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { WebhookPayload } from "@/types/lemon-squeezy";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/utils/firebase";

export async function POST(request: Request) {
  const payload: WebhookPayload = await request.json();
  console.log("Webhook payload:", payload);

  let userEmail: string;
  const subscriptionData = payload.data;

  // Handle subscription events
  switch (payload.meta.event_name) {
    case "order_created":
      // Handle order creation
      console.log("Order created:", payload.data);
      break;
    case "subscription_created":
      // Handle new subscription
      console.log("New subscription created:", subscriptionData);
      userEmail = subscriptionData.attributes.user_email;
      
      await updateUserSubscriptionStatus(userEmail, {
        isPremium: true,
        subscriptionId: subscriptionData.id,
        subscriptionStatus: 'active',
        endsAt: subscriptionData.attributes.renews_at || undefined,
        premiumSince: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`User ${userEmail} is now a premium subscriber.`);
      break;
    case "subscription_updated":
      // Handle subscription update
      console.log("Subscription updated:", subscriptionData);
      userEmail = subscriptionData.attributes.user_email;
      
      await updateUserSubscriptionStatus(userEmail, {
        isPremium: subscriptionData.attributes.status === 'active',
        subscriptionId: subscriptionData.id,
        subscriptionStatus: subscriptionData.attributes.status,
        endsAt: subscriptionData.attributes.ends_at || subscriptionData.attributes.renews_at || undefined,
        updatedAt: new Date().toISOString()
      });
      break;
    case "subscription_cancelled":
      // Handle subscription cancellation - keep access until ends_at
      console.log("Subscription cancelled:", subscriptionData);
      userEmail = subscriptionData.attributes.user_email;
      
      await updateUserSubscriptionStatus(userEmail, {
        isPremium: true, // Keep access during grace period
        subscriptionId: subscriptionData.id,
        subscriptionStatus: 'cancelled',
        endsAt: subscriptionData.attributes.ends_at || undefined,
        updatedAt: new Date().toISOString()
      });
      break;
    case "subscription_expired":
      // Handle subscription expiration - remove access
      console.log("Subscription expired:", subscriptionData);
      userEmail = subscriptionData.attributes.user_email;
      
      await updateUserSubscriptionStatus(userEmail, {
        isPremium: false,
        subscriptionId: subscriptionData.id,
        subscriptionStatus: 'expired',
        endsAt: subscriptionData.attributes.ends_at || undefined,
        updatedAt: new Date().toISOString()
      });
      break;
    case "subscription_payment_failed":
      // Handle payment failure
      console.log("Subscription payment failed:", subscriptionData);
      userEmail = subscriptionData.attributes.user_email;
      
      await updateUserSubscriptionStatus(userEmail, {
        isPremium: subscriptionData.attributes.status !== 'expired', // Keep access unless expired
        subscriptionId: subscriptionData.id,
        subscriptionStatus: 'unpaid',
        endsAt: subscriptionData.attributes.ends_at || undefined,
        updatedAt: new Date().toISOString()
      });
      break;
    case "subscription_paused":
      // Handle subscription pause
      console.log("Subscription paused:", subscriptionData);
      userEmail = subscriptionData.attributes.user_email;
      
      await updateUserSubscriptionStatus(userEmail, {
        isPremium: false,
        subscriptionId: subscriptionData.id,
        subscriptionStatus: 'paused',
        endsAt: subscriptionData.attributes.ends_at || undefined,
        updatedAt: new Date().toISOString()
      });
      break;
    case "subscription_unpaused":
      // Handle subscription unpause
      console.log("Subscription unpaused:", subscriptionData);
      userEmail = subscriptionData.attributes.user_email;
      
      await updateUserSubscriptionStatus(userEmail, {
        isPremium: true,
        subscriptionId: subscriptionData.id,
        subscriptionStatus: 'active',
        endsAt: subscriptionData.attributes.renews_at || undefined,
        updatedAt: new Date().toISOString()
      });
      break;
    default:
      console.log("Unhandled webhook event:", payload.meta.event_name);
      break;
  }

  const redirectUrl = "https://codinglatam.dev/gracias";
  return NextResponse.redirect(redirectUrl, 303);
}

async function updateUserSubscriptionStatus(userEmail: string, subscriptionData: {
  isPremium: boolean;
  subscriptionId?: string;
  subscriptionStatus?: string;
  endsAt?: string | null;
  premiumSince?: string | null;
  updatedAt?: string | null;
}) {
  // Query Firestore to find the user document with the matching email
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", userEmail));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.error(`User with email ${userEmail} not found.`);
    return;
  }

  // Update the user's subscription data in Firestore
  const userDoc = querySnapshot.docs[0];
  await updateDoc(userDoc.ref, subscriptionData);

  console.log(`Updated subscription status for user ${userEmail}:`, subscriptionData);
}
