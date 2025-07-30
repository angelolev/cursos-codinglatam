"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useSession } from "next-auth/react";
import Image from "next/image";
import LikeMaterial from "../LikeMaterial";

interface CommentsProps {
  commentId: string;
}

interface CommentProps {
  id: string;
  name: string | null;
  comment: string;
  date: string;
  photoURL?: string;
  replies?: CommentProps[];
}

export function Comments({ commentId }: CommentsProps) {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const commentsRef = collection(db, "comments");

    const unsubscribe = onSnapshot(commentsRef, (querySnapshot) => {
      // Get main comments
      const mainComments = querySnapshot.docs
        .filter(
          (doc) => doc.id.startsWith(commentId + "-") && !doc.data().parentId
        )
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            comment: data.comment,
            date: data.date,
            photoURL: data.photoURL,
            replies: [],
          } as CommentProps;
        });

      // Get replies
      const replies = querySnapshot.docs
        .filter(
          (doc) => doc.id.startsWith(commentId + "-") && doc.data().parentId
        )
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            comment: data.comment,
            date: data.date,
            photoURL: data.photoURL,
            parentId: data.parentId,
          };
        });

      // Attach replies to their parent comments
      replies.forEach((reply) => {
        const parentComment = mainComments.find(
          (comment) => comment.id === reply.parentId
        );
        if (parentComment && parentComment.replies) {
          parentComment.replies.push(reply);
        } else {
          console.log(
            `Could not find parent comment with ID: ${reply.parentId}`
          ); // Debug log
        }
      });

      // Sort replies by date
      mainComments.forEach((comment) => {
        if (comment.replies) {
          comment.replies.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
      });

      setComments(mainComments);
    });

    return () => unsubscribe();
  }, [commentId]);

  const handleReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return;

    try {
      // Create a unique ID for the reply that includes the commentId format
      // This will ensure it passes the filter condition
      const uniqueReplyId = `${commentId}-reply-${Date.now()}`;

      const replyData = {
        parentId, // This is the key field that links to the parent comment
        name: session.user?.name,
        comment: replyContent,
        date: new Date().toISOString(),
        photoURL: session.user?.image,
      };

      console.log(`Adding reply to parent: ${parentId}`, replyData);
      console.log(`Generated reply ID: ${uniqueReplyId}`);

      // Use doc() with a specific ID instead of addDoc()
      // This lets you control the document ID instead of letting Firestore generate it
      await setDoc(doc(db, "comments", uniqueReplyId), replyData);

      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="space-y-2">
      {!(comments.length > 0) && (
        <p className="text-white/90">Aún no hay comentarios</p>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="bg-black/60 p-4 rounded-lg">
          <div className="flex w-full">
            <div className="mr-3 flex-shrink-0">
              {comment.photoURL ? (
                <div className="flex flex-col justify-center items-center gap-2">
                  <Image
                    src={comment.photoURL}
                    alt={`${comment.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  <LikeMaterial guid={`comment-${comment.id}`} color="c8d6e5" />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-white/90 text-sm">
                      {comment.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <LikeMaterial guid={`comment-${comment.id}`} color="c8d6e5" />
                </div>
              )}
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-semibold text-white/90">
                  {comment.name}
                </h3>
                <span className="text-[12px] text-white/60">
                  {new Date(comment.date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="w-full">
                <p className="text-white/70 text-[13px] whitespace-normal break-words">
                  {comment.comment}
                </p>
              </div>

              {/* Action buttons row */}
              <div className="flex items-center mt-2 space-x-4">
                {session && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-sm text-indigo-500 text-left cursor-pointer"
                  >
                    Responder
                  </button>
                )}
              </div>

              {replyingTo === comment.id && (
                <div className="mt-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-2 border border-white/70 rounded text-sm text-white/90"
                    placeholder="Escribe una respuesta..."
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="px-3 py-1 text-xs text-white bg-indigo-500 rounded cursor-pointer"
                      disabled={!replyContent.trim()}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {/* Display replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-transparent rounded-lg">
                      <div className="flex w-full">
                        <div className="mr-3 flex-shrink-0">
                          {reply.photoURL ? (
                            <Image
                              src={reply.photoURL}
                              alt={`${reply.name}'s profile`}
                              className="w-8 h-8 rounded-full object-cover"
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 text-xs">
                                {reply.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white/90 text-sm">
                              {reply.name}
                            </h3>
                            <span className="text-[10px] text-white/60">
                              {new Date(reply.date).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="w-full">
                            <p className="text-white/70 text-[13px] whitespace-normal break-words">
                              {reply.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
