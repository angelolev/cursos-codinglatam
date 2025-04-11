"use client";
import React, { useEffect, useState } from "react";
import { ProjectCommentsProps } from "@/types/project-comments";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Comments from "../projects/components/Comments";
import AddCommentForm from "../projects/components/AddCommentForm";
import ReplyForm from "../projects/components/ReplyForm";

interface ProjectComments {
  projectId: string;
  comments: ProjectCommentsProps[];
}

export default function ProjectComments({
  projectId,
  comments: initialComments,
}: ProjectComments) {
  const [comments, setComments] =
    useState<ProjectCommentsProps[]>(initialComments);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  // Listen for real-time updates
  useEffect(() => {
    const q = query(
      collection(db, "projectsComments"),
      where("projectId", "==", projectId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedComments: ProjectCommentsProps[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedComments.push({
          id: doc.id,
          ...data,
          parentId: data.parentId || null,
          timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to Date
        } as ProjectCommentsProps);
      });
      setComments(updatedComments);
    });

    return () => unsubscribe();
  }, [projectId]);

  // Handle reply
  const handleReply = (parentId: string) => {
    setReplyingToId(parentId);
  };

  // When reply is complete, reset the replyingToId
  const handleReplyComplete = () => {
    setReplyingToId(null);
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white/90 mb-8">
        Proyectos de la comunidad
      </h2>

      <AddCommentForm projectId={projectId} />
      <Comments comments={comments} onReply={handleReply} />

      {/* Show reply form only for the comment being replied to */}
      {replyingToId && (
        <ReplyForm
          projectId={projectId}
          parentId={replyingToId}
          onReplyComplete={handleReplyComplete}
        />
      )}
    </div>
  );
}
