"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Swal from "sweetalert2";

interface AddCommentProps {
  commentId: string;
}

interface CommentProps {
  name: string | null;
  comment: string;
  date: string;
}

export function AddComment({ commentId }: AddCommentProps) {
  const [newComment, setNewComment] = useState<CommentProps>({
    name: "",
    comment: "",
    date: new Date().toISOString(),
  });
  const [hasCommented, setHasCommented] = useState(false);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    if (user) {
      const checkIfCommented = async () => {
        const commentRef = doc(db, "comments", `${commentId}-${user.uid}`);
        const commentSnap = await getDoc(commentRef);

        if (commentSnap.exists()) {
          setHasCommented(true);
        } else {
          setHasCommented(false);
        }
      };

      const fetchData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { name, lastName } = docSnap.data();
          if (name && lastName !== "") {
            setNewComment((prevComment) => ({
              ...prevComment,
              name: `${name} ${lastName}`,
            }));
          } else {
            setNewComment((prevComment) => ({
              ...prevComment,
              name: user.email,
            }));
          }
        }
      };

      checkIfCommented();
      fetchData();
    }
  }, [user, hasCommented]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasCommented(true);

    if (!user) return;

    if (!newComment.comment.trim()) {
      setHasCommented(false);
      Swal.fire({
        icon: "warning",
        text: "Debes escribir un comentario",
      });
      return;
    }

    try {
      await setDoc(doc(db, "comments", `${commentId}-${user.uid}`), {
        ...newComment,
        date: new Date().toISOString(),
      });
      setNewComment((prevComment) => ({
        ...prevComment,
        rating: 0,
        comment: "",
        date: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <>
      {user && isPremium && !hasCommented && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment.comment}
            onChange={(e) =>
              setNewComment((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
            maxLength={150}
            placeholder="Escribe tu comentario..."
            className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors w-full font-medium"
          >
            Comentar
          </button>
        </form>
      )}
    </>
  );
}
