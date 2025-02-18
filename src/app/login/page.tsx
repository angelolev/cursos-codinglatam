"use client";
import LogoDark from "@/components/LogoDark";
import GoogleIcon from "@/components/GoogleIcon";
/* import { Github } from "lucide-react"; */
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleLogin = async (provider: string) => {
    try {
      await signIn(`${provider}`, {
        redirectTo: "/",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center pt-48">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <div className="flex justify-center pb-6">
          <LogoDark />
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleLogin("google")}
            className="w-full bg-indigo-600 text-white p-4 rounded flex items-center gap-4 justify-center"
          >
            <div className="max-w-8">
              <GoogleIcon />
            </div>
            Login con Google
          </button>
          <button
            onClick={() => handleLogin("patreon")}
            className="w-full bg-indigo-600 text-white p-4 rounded flex items-center gap-4 justify-center"
          >
            <div className="max-w-8">{/* <Github /> */}</div>
            Login con Patreon
          </button>
        </div>
      </div>
    </div>
  );
}
