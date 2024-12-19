"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../auth/auth-context";

// Login Page Component
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        <form onSubmit={handleEmailLogin}>
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
            Login
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded"
          >
            Login with Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
