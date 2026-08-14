import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";

// Cache por 1 hora (3600 segundos)
export const revalidate = 3600;

export async function GET() {
  try {
    const snapshot = await adminDb.collection("certificates").count().get();

    return NextResponse.json({ count: snapshot.data().count });
  } catch (error) {
    console.error("Error counting certificates:", error);
    // Retornar null (no error) para fallback graceful en el frontend
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
