"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../auth/auth-context";
import { db } from "../../utils/firebase";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  lastName: string;
  github: string;
  email: string;
}

export default function CompleteProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    github: "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData({
            name: userData.name || "",
            lastName: userData.lastName || "",
            github: userData.github || "",
            email: user?.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          text: "Error al cargar los datos del usuario",
        });
      } finally {
      }
    };

    fetchUserData();
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const isFormValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );

    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        text: "Por favor, complete todos los campos",
      });
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), formData);
      await Swal.fire({
        icon: "success",
        text: "Perfil actualizado correctamente",
      });
      router.push("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocurrió un error al actualizar el perfil",
      });
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Completar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Nombres
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Apellidos
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            GitHub
          </label>
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleChange}
            className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Guardar Perfil
        </button>
      </form>
    </div>
  );
}
