import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";
import { auth } from "@/app/auth";
import {
  BUILDERS_LAB_DOC_PATH,
  CUPOS_TOTALES,
  normalizarCupos,
} from "@/app/builders-lab/config";
import { leerCuposRestantes } from "@/app/builders-lab/cupos";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "angelokta7@gmail.com";

async function esAdmin() {
  const session = await auth();
  return session?.user?.email === ADMIN_EMAIL;
}

// GET - Cupos restantes actuales (solo admin)
export async function GET() {
  if (!(await esAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized - Admin access only" },
      { status: 403 }
    );
  }
  const actual = await leerCuposRestantes();
  return NextResponse.json({ ...actual, cuposTotales: CUPOS_TOTALES });
}

// PUT - Actualiza los cupos restantes (solo admin)
export async function PUT(request: Request) {
  if (!(await esAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized - Admin access only" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const cupos = normalizarCupos(
    (body as { cuposRestantes?: unknown })?.cuposRestantes
  );
  if (cupos === null) {
    return NextResponse.json(
      {
        error: `cuposRestantes debe ser un entero entre 0 y ${CUPOS_TOTALES}`,
      },
      { status: 400 }
    );
  }

  try {
    const now = new Date();
    await adminDb
      .doc(BUILDERS_LAB_DOC_PATH)
      .set({ cuposRestantes: cupos, updatedAt: now }, { merge: true });
    return NextResponse.json({
      cupos,
      fuente: "firestore",
      updatedAt: now.toISOString(),
      cuposTotales: CUPOS_TOTALES,
    });
  } catch (error) {
    console.error("Error actualizando los cupos del Builders Lab:", error);
    return NextResponse.json(
      { error: "No se pudieron guardar los cupos" },
      { status: 500 }
    );
  }
}
