import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      href="/login"
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      Inicia sesión
    </Link>
  );
}
