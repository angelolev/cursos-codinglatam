// app/api/subscriptions/plans/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  const url = "https://api.lemonsqueezy.com/v1/variants";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}
