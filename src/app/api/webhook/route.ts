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

  // Handle subscription events
  switch (payload.meta.event_name) {
    case "order_created":
      // Handle order creation
      console.log("Order created:", payload.data);
      break;
    case "subscription_created":
      // Handle new subscription
      console.log("New subscription created:", payload.data);
      const subscription = payload.data;
      const userEmail = subscription.attributes.user_email; // Use email to identify the user
      //   const subscriptionId = subscription.id;

      // Update the user's `isPremium` field in Firestore
      await updateUserPremiumStatus(userEmail, true);
      console.log(`User ${userEmail} is now a premium subscriber.`);
      break;
    case "subscription_updated":
      // Handle subscription update
      console.log("Subscription updated:", payload.data);
      break;
    case "subscription_cancelled":
      // Handle subscription cancellation
      await updateUserPremiumStatus(userEmail, false);
      console.log("Subscription cancelled:", payload.data);
      break;
    default:
      break;
  }

  const redirectUrl = "https://cursos.codinglatam.dev/gracias";
  return NextResponse.redirect(redirectUrl, 303);
}

async function updateUserPremiumStatus(userEmail: string, isPremium: boolean) {
  // Query Firestore to find the user document with the matching email
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", userEmail));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.error(`User with email ${userEmail} not found.`);
    return;
  }

  // Update the `isPremium` field for the user
  const userDoc = querySnapshot.docs[0]; // Get the first matching document
  await updateDoc(userDoc.ref, {
    isPremium: isPremium,
  });

  console.log(`Updated isPremium to ${isPremium} for user ${userEmail}.`);
}
