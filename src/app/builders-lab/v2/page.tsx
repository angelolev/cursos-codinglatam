import { connection } from "next/server";
import { BuildersLabV2 } from "./BuildersLabV2";
import { fundadorCerrado } from "../config";
import { leerCuposRestantes } from "../cupos";

// Misma lógica que /builders-lab: cupos desde Firestore y estado del precio
// de lanzamiento calculados en cada visita.
export default async function BuildersLabV2Page() {
  await connection();
  const { cupos } = await leerCuposRestantes();
  return (
    <BuildersLabV2
      cuposRestantes={cupos}
      cerradoInicial={fundadorCerrado(cupos)}
    />
  );
}
