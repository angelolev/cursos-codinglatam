"use client";
import { useEffect, useState } from "react";
import { CIERRE_FUNDADOR } from "./config";

// Cierra el precio de lanzamiento en vivo si la fecha vence con la página
// abierta. El estado inicial viene del servidor (fecha y cupos).
export function useFundadorCerrado(cerradoInicial: boolean) {
  const [cerrado, setCerrado] = useState(cerradoInicial);
  useEffect(() => {
    if (cerrado) return;
    const ms = CIERRE_FUNDADOR.getTime() - Date.now();
    if (ms <= 0) {
      setCerrado(true);
      return;
    }
    // setTimeout no admite más de ~24,8 días; por encima no hace falta.
    if (ms > 2_147_483_647) return;
    const id = setTimeout(() => setCerrado(true), ms);
    return () => clearTimeout(id);
  }, [cerrado]);
  return cerrado;
}
