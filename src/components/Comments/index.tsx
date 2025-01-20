"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface CommentsProps {
  commentId: string;
}

interface CommentProps {
  name: string | null;
  comment: string;
  date: string;
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
          } as CommentProps;
        });

      setComments(filteredComments);
    });

    return () => unsubscribe();
  }, [commentId]);

  return (
    <div className="space-y-8">
      {!(comments.length > 0) && <p>Aún no hay comentarios</p>}
      {comments.map((review) => (
        <div key={review.date} className="bg-white p-4 rounded-lg">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-black/70">{review.name}</h3>
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </span>
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
  );
}
