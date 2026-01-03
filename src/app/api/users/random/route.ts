import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Cache por 1 hora (3600 segundos)
export const revalidate = 3600;

export async function GET() {
  try {
    // 1. Query usuarios con imagen (Google OAuth usuarios tienen imagen)
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("image", "!=", null));
    const snapshot = await getDocs(q);

    // 2. Mapear a datos seguros (solo nombre e imagen)
    const users = snapshot.docs
      .map((doc) => ({
        name: doc.data().name || "Usuario",
        image: doc.data().image,
      }))
      .filter((u) => u.image); // Doble verificación para asegurar que imagen existe

    // 3. Fisher-Yates shuffle para randomización
    const shuffled = [...users];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 4. Retornar primeros 4 usuarios (usaremos 3 en UI, 1 de backup)
    return NextResponse.json({
      users: shuffled.slice(0, 4),
    });
  } catch (error) {
    console.error("Error fetching random users:", error);
    // Retornar array vacío (no error) para fallback graceful en el frontend
    return NextResponse.json({ users: [] }, { status: 200 });
  }
}
