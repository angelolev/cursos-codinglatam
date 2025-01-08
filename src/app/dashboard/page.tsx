"use client";
import { useState } from "react";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoutes";
import { useAuth } from "../auth/auth-context";

export default function DashboardPage() {
  const user = useProtectedRoute();

  const { logout, updateUserPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUserPassword(currentPassword, newPassword);
      setSuccess(true);
      setError("");
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-black font-bold text-2xl mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome, {user?.email}!</p>
        <form onSubmit={handleSubmit} className="grid mt-6">
          <h2 className="text-black font-bold text-xl mb-2">
            Cambia tu contraseña
          </h2>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Contraseña actual"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div className="my-2 flex flex-col gap-4 md:justify-between md:flex-row-reverse">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              {isLoading ? "Cargando..." : "Actualizar contraseña"}
            </button>
            <button
              onClick={logout}
              className="text-white p-2 rounded bg-red-600"
            >
              Salir
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && (
            <p style={{ color: "green" }}>Password updated successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}
