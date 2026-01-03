import { db } from "@/utils/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

interface RequestBody {
  email: string;
}

export async function POST(request: Request) {
  try {
    const { email }: RequestBody = await request.json();

    // Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicates
    const waitlistRef = collection(db, "waitlist");
    const q = query(waitlistRef, where("email", "==", normalizedEmail));
    const existingDocs = await getDocs(q);

    if (!existingDocs.empty) {
      return NextResponse.json(
        { error: "Este email ya está registrado en la waitlist" },
        { status: 409 }
      );
    }

    // Add to Firestore
    const docData = {
      email: normalizedEmail,
      timestamp: new Date(),
      source: "waitlist_page",
      status: "pending",
    };

    const docRef = await addDoc(waitlistRef, docData);

    return NextResponse.json(
      { id: docRef.id, message: "Email registrado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return NextResponse.json(
      { error: "Error al procesar tu solicitud" },
      { status: 500 }
    );
  }
}
