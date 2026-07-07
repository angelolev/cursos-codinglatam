// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { WebhookPayload } from "@/types/lemon-squeezy";
import { adminDb } from "@/utils/firebaseAdmin";

// Verifies the Lemon Squeezy X-Signature HMAC against the raw request body.
// Uses timingSafeEqual to avoid leaking timing information.
function isValidSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signatureHeader, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  // Read the raw body first — signature is computed over the exact bytes sent.
  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature");

  if (!isValidSignature(rawBody, signature)) {
    console.warn("Webhook rejected: invalid or missing signature.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await handleWebhookEvent(payload);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

async function handleWebhookEvent(payload: WebhookPayload) {
  console.log("Webhook event received:", payload.meta.event_name);

  let userEmail: string;
  const subscriptionData = payload.data;

  // Handle subscription events
  switch (payload.meta.event_name) {
    case "order_created":
      // Handle order creation
      break;
    case "subscription_created":
      // Handle new subscription
      userEmail = subscriptionData.attributes.user_email;

      await updateUserSubscriptionStatus(userEmail, {
        isPremium: true,
        subscriptionId: subscriptionData.id,
        subscriptionStatus: 'active',
        endsAt: subscriptionData.attributes.renews_at || undefined,
        premiumSince: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      break;
    case "subscription_updated":
      // Handle subscription update
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
  const querySnapshot = await adminDb
    .collection("users")
    .where("email", "==", userEmail)
    .get();

  if (querySnapshot.empty) {
    console.error(`User with email ${userEmail} not found.`);
    return;
  }

  // Update the user's subscription data in Firestore
  const userDoc = querySnapshot.docs[0];
  await userDoc.ref.update(subscriptionData);
}
