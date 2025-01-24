"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface ReviewsProps {
  reviewId: string;
}

interface courseReviewsProps {
  name: string | null;
  rating: number;
  comment: string;
  date: string;
}

export function Reviews({ reviewId }: ReviewsProps) {
  const [courseReviews, setCourseReviews] = useState<courseReviewsProps[]>([]);

  useEffect(() => {
    const reviewsRef = collection(db, "reviews");

    const unsubscribe = onSnapshot(reviewsRef, (querySnapshot) => {
      const filteredReviews = querySnapshot.docs
        .filter((doc) => doc.id.startsWith(reviewId + "-"))
        .map((doc) => {
          const data = doc.data();
          return {
            name: data.name,
            rating: data.rating,
            comment: data.comment,
            date: data.date,
          } as courseReviewsProps;
        });

      setCourseReviews(filteredReviews);
    });

    return () => unsubscribe();
  }, [reviewId]);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white/90 mb-8">
        Opiniones de los estudiantes
      </h2>
      <div className="space-y-8">
        {!(courseReviews.length > 0) && (
          <p className="text-white/90">Aún no hay opiniones</p>
        )}
        {courseReviews.map((review) => (
          <div key={review.date} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{review.name}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="w-full">
                <p className="text-gray-600 whitespace-normal break-words">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
