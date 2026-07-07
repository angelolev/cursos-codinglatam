import { adminDb } from "@/utils/firebaseAdmin";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "angelokta7@gmail.com";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const querySnapshot = await adminDb
      .collection("waitlist")
      .orderBy("timestamp", "desc")
      .get();

    const waitlistEntries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        timestamp: data.timestamp?.toDate?.() || data.timestamp,
        source: data.source || "waitlist_page",
        status: data.status || "pending",
      };
    });

    return NextResponse.json(
      { entries: waitlistEntries, total: waitlistEntries.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos de la waitlist" },
      { status: 500 }
    );
  }
}
