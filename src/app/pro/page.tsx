import Link from "next/link";

export default function ProPage() {
  return (
    <div className="flex flex-col gap-6 items-center mx-auto pt-12">
      <h1 className="text-2xl text-white/90">
        Necesitas ser Pro para ver este contenido
      </h1>
      <Link
        href="https://www.patreon.com/c/codinglatam/membership"
        target="_blank"
        className="text-white font-bold bg-primary-300 hover:bg-primary-400 px-6 py-3 w-fit rounded-lg"
      >
        Convertirte en Pro
      </Link>
      <Link className="text-white underline underline-offset-2" href="/">
        Volver al Inicio
      </Link>
    </div>
  );
}
