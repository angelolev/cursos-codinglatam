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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <button onClick={logout}>Logout</button>
      <p>Cambia tu contraseña</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <button type="submit">
          {isLoading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && (
          <p style={{ color: "green" }}>Password updated successfully!</p>
        )}
      </form>
    </div>
  );
}
