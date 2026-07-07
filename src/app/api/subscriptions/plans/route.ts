// app/api/subscriptions/plans/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  const url = "https://api.lemonsqueezy.com/v1/variants";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}
