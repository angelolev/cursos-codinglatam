// app/page.tsx
"use client"; // Mark as a Client Component

import { useEffect, useState } from "react";

interface SubscriptionPlan {
  id: string;
  attributes: {
    name: string;
    price: number;
    slug: string;
  };
}

export default function Suscripcion() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch("/api/subscriptions/plans");
      const data = await response.json();
      setPlans(data.data);
    };
    fetchPlans();
  }, []);

  const handleCheckout = (variantId: string) => {
    // const checkoutUrl = `https://cursoscodinglatam.lemonsqueezy.com/checkout/buy/${variantId}
    // )}`;
    const checkoutUrl =
      "https://cursoscodinglatam.lemonsqueezy.com/buy/a2879d33-3520-4515-8733-65f92fc9222a";

    window.location.href = checkoutUrl;
  };

  return (
    <div className="bg-white">
      <h1>Welcome to My Subscription App</h1>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h2>{plan.attributes.name}</h2>
          <p>${plan.attributes.price / 100} per month</p>
          <button onClick={() => handleCheckout(plan.attributes.slug)}>
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
}
