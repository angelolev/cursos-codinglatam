"use client";
import GoogleIcon from "@/components/GoogleIcon";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleLogin = async (provider: string) => {
    try {
      await signIn(`${provider}`, {
        redirectTo: callbackUrl,
      });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <main className=" mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow flex items-center justify-center pt-24">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <div className="flex justify-center">
          <p>Inicia sesión</p>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleLogin("google")}
            className="w-full bg-indigo-600 text-white p-4 rounded flex items-center gap-4 justify-center cursor-pointer"
          >
            <div className="max-w-8">
              <GoogleIcon />
            </div>
            Entrar con Google
          </button>
        </div>
      </div>
    </main>
  );
}
