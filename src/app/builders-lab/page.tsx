import { connection } from "next/server";
import { BuildersLab } from "./BuildersLab";
import { fundadorCerrado } from "./config";

// El estado del precio de lanzamiento se calcula en cada visita, así quien entra
// después del cierre ya recibe la página cerrada en el HTML (sin parpadeo).
export default async function BuildersLabPage() {
  await connection();
  return <BuildersLab cerradoInicial={fundadorCerrado()} />;
}
