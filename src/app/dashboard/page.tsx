"use client";
import { useState } from "react";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoutes";
import { useAuth } from "../auth/auth-context";

export default function DashboardPage() {
  const user = useProtectedRoute();

  const { updateUserPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      if (await updateUserPassword(currentPassword, newPassword)) {
        setSuccess(true);
      } else {
        setError("Failed to update password");
      }
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cambiar Contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Contraseña Actual
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 text-white bg-[#2a2e33] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 text-white bg-[#2a2e33] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 text-white bg-[#2a2e33] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Actualizar Contraseña
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginTop: "16px" }}>
          Password updated successfully!
        </p>
      )}
    </div>
  );
}
