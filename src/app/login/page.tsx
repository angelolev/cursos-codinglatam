"use client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/auth-context";
import LogoDark from "@/components/LogoDark";
import Loading from "./loading";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import GoogleIcon from "@/components/GoogleIcon";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const { signIn, signInWithGithub, signInWithGoogle, user } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // if (user) {
  //   return null;
  // }

  // const handleEmailLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     await signIn(email, password);
  //     router.push("/perfil");
  //   } catch (error) {
  //     setError("Hubo un error al iniciar sesión");
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      signIn("github");
    } catch (error) {
      console.log(error);
    }
  };

  // const handleGithubLogin = async () => {
  //   try {
  //     await signInWithGithub();
  //     router.push("/perfil");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleLogin = async () => {
    try {
      console.log("ini");
      await signIn("google", {});
      redirect("/");
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
        {/* <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Ingresar
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form> */}

        <div className="mt-4 space-y-2">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-4 rounded flex items-center gap-4 justify-center"
          >
            <div className="max-w-8">
              <GoogleIcon />
            </div>
            Login con Google
          </button>
          {/* <button
            onClick={handleGithubLogin}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            Login with GitHub
          </button> */}
        </div>
      </div>
    </div>
  );
}
