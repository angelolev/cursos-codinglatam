"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/app/auth/auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

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

interface CourseReviewsProps {
  courseId: string;
}

interface CommentProps {
  name: string | null;
  rating: number;
  comment: string;
  date: string;
}

export function AddCourseReview({ courseId }: CourseReviewsProps) {
  const [newComment, setNewComment] = useState<CommentProps>({
    name: "",
    rating: 0,
    comment: "",
    date: new Date().toISOString(),
  });
  const [hasCommented, setHasCommented] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const checkIfCommented = async () => {
        const reviewRef = doc(db, "reviews", `${courseId}-${user.uid}`);
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
          setNewComment((prevComment) => ({
            ...prevComment,
            name: `${name} ${lastName}`,
          }));
        } else {
          const email = await user.email;
          setNewComment((prevComment) => ({
            ...prevComment,
            name: email,
          }));
        }
      };

      checkIfCommented();
      fetchData();
    }
  }, [user, hasCommented]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, "reviews", `${courseId}-${user.uid}`), {
        ...newComment,
        date: new Date().toISOString(),
      });

      setHasCommented(true);

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
      {!hasCommented && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white/90 mb-8">
            ¿Qué te pareció el curso?
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
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors font-semibold"
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
