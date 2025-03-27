"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface CommentsProps {
  commentId: string;
}

interface CommentProps {
  name: string | null;
  comment: string;
  date: string;
  photoURL?: string;
}

export function Comments({ commentId }: CommentsProps) {
  const [comments, setComments] = useState<CommentProps[]>([]);

  useEffect(() => {
    const commentsRef = collection(db, "comments");

    const unsubscribe = onSnapshot(commentsRef, (querySnapshot) => {
      const filteredComments = querySnapshot.docs
        .filter((doc) => doc.id.startsWith(commentId + "-"))
        .map((doc) => {
          const data = doc.data();
          return {
            name: data.name,
            comment: data.comment,
            date: data.date,
            photoURL: data.photoURL,
          } as CommentProps;
        });

      setComments(filteredComments);
    });

    return () => unsubscribe();
  }, [commentId]);

  return (
    <div className="space-y-8">
      {!(comments.length > 0) && (
        <p className="text-white/90">Aún no hay comentarios</p>
      )}
      {comments.map((review) => (
        <div key={review.date} className="bg-white p-4 rounded-lg">
          <div className="flex w-full">
            <div className="mr-3 flex-shrink-0">
              {review.photoURL ? (
                <Image
                  src={review.photoURL}
                  alt={`${review.name}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    {review.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-black/70">{review.name}</h3>
                <span className="text-[12px] text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <div className="w-full">
                <p className="text-gray-600 text-[13px] whitespace-normal break-words">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
