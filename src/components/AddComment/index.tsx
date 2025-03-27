"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

interface AddCommentProps {
  commentId: string;
}

interface CommentProps {
  name: string | null;
  comment: string;
  date: string;
  photoURL?: string;
}

export function AddComment({ commentId }: AddCommentProps) {
  const [newComment, setNewComment] = useState<CommentProps>({
    name: "",
    comment: "",
    date: new Date().toISOString(),
    photoURL: "",
  });
  const [hasCommented, setHasCommented] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (session) {
      const checkIfCommented = async () => {
        const commentRef = doc(db, "comments", `${commentId}-${user?.aud}`);
        const commentSnap = await getDoc(commentRef);

        if (commentSnap.exists()) {
          setHasCommented(true);
        } else {
          setHasCommented(false);
        }
      };

      const fetchData = async () => {
        const docRef = doc(db, "users", user?.aud || "");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { name } = docSnap.data();
          if (name !== "") {
            setNewComment((prevComment) => ({
              ...prevComment,
              name: name,
              photoURL: user?.image || "",
            }));
          } else {
            setNewComment((prevComment) => ({
              ...prevComment,
              name: user?.email || "",
              photoURL: user?.image || "",
            }));
          }
        }
      };

      checkIfCommented();
      fetchData();
    }
  }, [session, hasCommented, commentId, user?.aud, user?.image, user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasCommented(true);

    if (!session) return;

    if (!newComment.comment.trim()) {
      setHasCommented(false);
      Swal.fire({
        icon: "warning",
        text: "Debes escribir un comentario",
      });
      return;
    }

    try {
      await setDoc(doc(db, "comments", `${commentId}-${user?.aud}`), {
        ...newComment,
        photoURL: user?.image || "",
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
      {session && user && !hasCommented && (
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
            placeholder="Escribe un comentario..."
            className="w-full p-3 rounded-lg bg-white/90 text-black/70 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-6 py-4 bg-primary-300 text-white rounded-lg hover:bg-primary-400 transition-colors w-full font-medium cursor-pointer"
          >
            Comentar
          </button>
        </form>
      )}
    </>
  );
}
