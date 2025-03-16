"use client";
import { Crown } from "lucide-react";

export default function SubscriptionButton() {
  const handleCheckout = () => {
    const checkoutUrl = `https://cursoscodinglatam.lemonsqueezy.com/checkout/buy/c36b9bc2-a598-4b21-9442-924f771c8e8b`;

    window.location.href = checkoutUrl;
  };

  return (
    <button
      onClick={handleCheckout}
      className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-primary-300 hover:bg-primary-400 transition-colors cursor-pointer"
    >
      <Crown className="h-5 w-5 mr-2" />
      Quiero ser Pro
    </button>
  );
}
