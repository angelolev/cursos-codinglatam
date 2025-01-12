"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoutes";
import { useAuth } from "../auth/auth-context";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const user = useProtectedRoute();

  const { updateUserPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  /*   const [isLoading, setIsLoading] = useState<boolean>(false); */

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /*   setIsLoading(true); */

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        text: "Las contraseñas no coinciden",
      });
    } else {
      if (await updateUserPassword(currentPassword, newPassword)) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Swal.fire({
          icon: "success",
          text: "Se ha actualizado la contraseña correctamente",
        });
        redirect("/");
      } else {
        Swal.fire({
          icon: "error",
          text: "Ocurrió un error al actualizar la contraseña",
        });
      }
    }
    /*     setIsLoading(false); */
  };

  /*if (isLoading) return <p>Loading...</p>; */

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
            className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            required
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
            className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            required
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
            className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Actualizar Contraseña
        </button>
      </form>
    </div>
  );
}
