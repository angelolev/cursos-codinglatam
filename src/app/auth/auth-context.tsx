"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/utils/firebase";

// Authentication Context Type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string } | undefined>;
}

// Create Authentication Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  logout: async () => {},
  updateUserPassword: async () => ({ success: false, message: "" }),
});

// Authentication Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Authentication Methods
  const signIn = async (email: string, password: string) => {
    try {
      // await signInWithEmailAndPassword(auth, email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // Enviar el token al servidor para establecer la cookie
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        console.log("Cookie establecida exitosamente.");
      } else {
        console.error("Error al establecer la cookie.");
      }
    } catch (error) {
      console.error("Sign In Error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign Up Error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      // Llama a tu API para eliminar la cookie
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        console.log("Session cookie removed");
        // Opcional: Redirige al usuario a la página de login
        window.location.href = "/login";
      } else {
        console.error("Failed to remove session cookie");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      if (!user) {
        throw new Error("No user is currently logged in");
      }

      const email = user.email;
      if (!email) {
        throw new Error("User email is null");
      }
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    logout,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for using authentication
export const useAuth = () => {
  return useContext(AuthContext);
};
