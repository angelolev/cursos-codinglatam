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
import { db } from "../../utils/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface FormData {
  name: string;
  github: string;
  email: string;
  isPremium: boolean;
  premiumSince: Date | null;
  updatedAt: Date | null;
}

export default function CompleteProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    github: "",
    email: session?.user?.email || "",
    isPremium: false,
    premiumSince: null,
    updatedAt: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!session?.user?.aud) {
          throw new Error("User ID is undefined");
        }

        const docRef = doc(db, "users", session.user.aud);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData({
            name: userData.name || "",
            github: userData.github || "",
            email: session.user.email || "",
            isPremium: userData.isPremium || false,
            premiumSince: userData.premiumSince || null,
            updatedAt: userData.updatedAt || null,
          });
          setIsPremium(userData.isPremium);
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
  }, [session?.user]);

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

  const updateCommetsName = async (userUid: string, name: string) => {
    const commentsRef = collection(db, "comments");

    try {
      const querySnapshot = await getDocs(commentsRef);
      const updatePromises = querySnapshot.docs
        .filter((doc) => doc.id.includes(userUid))
        .map(async (docSnapshot) => {
          const docRef = doc(db, "comments", docSnapshot.id);
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
    if (!session?.user) return;

    const requiredStringFields = {
      name: formData.name,
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
      setLoading(true);
      if (session?.user?.aud) {
        await setDoc(doc(db, "users", session.user.aud), formData);
      } else {
        throw new Error("User ID is undefined");
      }
      await updateReviewName(session?.user?.aud, `${formData.name}`);
      await updateCommetsName(session?.user?.aud, `${formData.name}`);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-t-4 border-primary-300 border-solid rounded-full animate-spin"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <h1 className="text-2xl font-bold mb-6 text-white/90">Mi Perfil</h1>
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
            {!isPremium && (
              <Link
                href="/pro"
                className="text-indigo-500 underline underline-offset-4"
              >
                Ser Pro
              </Link>
            )}
          </div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            maxLength={50}
            value={formData.name}
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
            maxLength={100}
            value={formData.github}
            onChange={handleChange}
            className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-300 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-400 transition-colors cursor-pointer"
        >
          Guardar Perfil
        </button>
      </form>
    </main>
  );
}
