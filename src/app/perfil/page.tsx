"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../auth/auth-context";
import { db } from "../../utils/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  name: string;
  lastName: string;
  github: string;
  email: string;
  isPremium: boolean;
  premiumSince: Date | null;
  updatedAt: Date | null;
}

export default function CompleteProfile() {
  const { user, isPremium } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    github: "",
    email: user?.email || "",
    isPremium: false,
    premiumSince: null,
    updatedAt: null,
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const RegisterUser = async () => {
      const userData = {
        name: "",
        lastName: "",
        github: "",
        email: user.email || "",
        isPremium: false,
        premiumSince: null,
        updatedAt: null,
      };

      try {
        await setDoc(doc(db, "users", user.uid), userData);
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };

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
            isPremium: userData.isPremium || false,
            premiumSince: userData.premiumSince || null,
            updatedAt: userData.updatedAt || null,
          });
        } else {
          await RegisterUser();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          text: "Error al cargar los datos del usuario",
        });
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

  const updateReviewName = async (userUid: string, name: string) => {
    const reviewsRef = collection(db, "reviews");

    try {
      const querySnapshot = await getDocs(reviewsRef);
      const updatePromises = querySnapshot.docs
        .filter((doc) => doc.id.includes(userUid))
        .map(async (docSnapshot) => {
          const docRef = doc(db, "reviews", docSnapshot.id);
          try {
            await updateDoc(docRef, {
              name: name,
            });
          } catch (updateError) {
            console.error(
              `Error actualizando documento ${docSnapshot.id}:`,
              updateError
            );
          }
        });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error en la operación:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const requiredStringFields = {
      name: formData.name,
      lastName: formData.lastName,
      github: formData.github,
      email: formData.email,
    };

    const isFormValid = Object.values(requiredStringFields).every(
      (value) => value && value.trim() !== ""
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
      await updateReviewName(user.uid, `${formData.name} ${formData.lastName}`);
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
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-400">Suscripción:</span>
            <span
              className={
                isPremium
                  ? "bg-blue-500 text-white px-2 py-1 rounded-lg"
                  : "bg-green-500 text-white px-2 py-1 rounded-lg"
              }
            >
              {isPremium ? "Pro" : "Gratuita"}
            </span>
            <Link
              href="https://www.patreon.com/c/codinglatam/membership"
              target="_blank"
              className="text-indigo-500 underline underline-offset-4"
            >
              Ser Pro
            </Link>
          </div>
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
          className="w-full bg-primary-300 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-400 transition-colors"
        >
          Guardar Perfil
        </button>
      </form>
    </div>
  );
}
