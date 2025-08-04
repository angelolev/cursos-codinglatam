import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/utils/common";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "6");

    const allProducts = await getProducts();
    
    if (!allProducts) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    const paginatedProducts = allProducts.slice(offset, offset + limit);
    const hasMore = offset + limit < allProducts.length;

    return NextResponse.json({
      products: paginatedProducts,
      hasMore,
      totalCount: allProducts.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}