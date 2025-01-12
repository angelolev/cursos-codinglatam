import Link from "next/link";

export default function RegisterButton() {
  return (
    <Link
      target="_blank"
      href="https://www.patreon.com/c/codinglatam/membership"
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      Regístrate
    </Link>
  );
}
