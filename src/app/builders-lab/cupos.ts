// Lectura de los cupos restantes desde Firestore (solo servidor).
import { adminDb } from "@/utils/firebaseAdmin";
import {
  BUILDERS_LAB_DOC_PATH,
  CUPOS_RESTANTES_RESPALDO,
  normalizarCupos,
} from "./config";

export type CuposRestantes = {
  cupos: number;
  // "respaldo": Firestore falló o el documento no existe todavía.
  fuente: "firestore" | "respaldo";
  updatedAt: string | null;
};

export async function leerCuposRestantes(): Promise<CuposRestantes> {
  try {
    const snap = await adminDb.doc(BUILDERS_LAB_DOC_PATH).get();
    const cupos = normalizarCupos(snap.get("cuposRestantes"));
    if (cupos !== null) {
      const updatedAt = snap.get("updatedAt")?.toDate?.() as Date | undefined;
      return {
        cupos,
        fuente: "firestore",
        updatedAt: updatedAt?.toISOString() ?? null,
      };
    }
  } catch (error) {
    console.error("Error leyendo los cupos del Builders Lab:", error);
  }
  return { cupos: CUPOS_RESTANTES_RESPALDO, fuente: "respaldo", updatedAt: null };
}
