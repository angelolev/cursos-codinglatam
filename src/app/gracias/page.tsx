// app/thank-you/page.tsx
"use client"; // Mark as a Client Component

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function ThankYou() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const checkoutId = searchParams.get("checkout_id");

    if (orderId && checkoutId) {
      console.log("Order ID:", orderId);
      console.log("Checkout ID:", checkoutId);

      // You can fetch order details from Lemon Squeezy API here
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Thank You!</h1>
      <p>Your payment was successful. Welcome to the club!</p>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
}
