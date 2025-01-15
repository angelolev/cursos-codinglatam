"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/app/auth/auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Swal from "sweetalert2";

function StarRating({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`transition-transform ${
            onRatingChange ? "hover:scale-110" : ""
          } focus:outline-none`}
          onMouseEnter={() => onRatingChange && setHoverRating(star)}
          onMouseLeave={() => onRatingChange && setHoverRating(0)}
          onClick={() => onRatingChange && onRatingChange(star)}
          disabled={!onRatingChange}
        >
          <Star
            className={`w-6 h-6 transition-colors duration-200 ${
              (hoverRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

interface ReviewsProps {
  reviewId: string;
}

interface CommentProps {
  name: string | null;
  rating: number;
  comment: string;
  date: string;
}

export function AddReview({ reviewId }: ReviewsProps) {
  const [newComment, setNewComment] = useState<CommentProps>({
    name: "",
    rating: 0,
    comment: "",
    date: new Date().toISOString(),
  });
  const [hasCommented, setHasCommented] = useState(false);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    if (user) {
      const checkIfCommented = async () => {
        const reviewRef = doc(db, "reviews", `${reviewId}-${user.uid}`);
        const reviewSnap = await getDoc(reviewRef);

        if (reviewSnap.exists()) {
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
      await setDoc(doc(db, "reviews", `${reviewId}-${user.uid}`), {
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
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white/90 mb-8">
            ¿Te gustó el contenido?
          </h2>
          <div className="bg-white rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium text-black mb-1">
                  Calificación
                </label>
                <StarRating
                  rating={newComment.rating}
                  onRatingChange={(rating) =>
                    setNewComment((prev) => ({ ...prev, rating }))
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-black mb-1">
                  Comentario
                </label>
                <textarea
                  value={newComment.comment}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
                  rows={4}
                  maxLength={250}
                  placeholder="Escribe tu comentario..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors font-semibold"
              >
                Comentar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
