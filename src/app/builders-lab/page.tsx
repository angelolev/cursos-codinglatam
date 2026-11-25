import { connection } from "next/server";
import { BuildersLab } from "./BuildersLab";
import { fundadorCerrado } from "./config";
import { leerCuposRestantes } from "./cupos";

// Los cupos (Firestore) y el estado del precio de lanzamiento se calculan en
// cada visita: un cambio desde /admin se ve en la siguiente carga, y quien
// entra después del cierre ya recibe la página cerrada (sin parpadeo).
export default async function BuildersLabPage() {
  await connection();
  const { cupos } = await leerCuposRestantes();
  return (
    <BuildersLab
      cuposRestantes={cupos}
      cerradoInicial={fundadorCerrado(cupos)}
    />
  );
}
