import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      href="/login"
      className="w-full border border-primary-300 text-primary-300 px-6 py-3 rounded-md hover:bg-primary-50 transition-colors"
    >
      Inicia sesión
    </Link>
  );
}
