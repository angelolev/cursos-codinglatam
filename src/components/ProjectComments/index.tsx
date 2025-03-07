"use client";
import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ProjectCommentsProps } from "@/types/project-comments";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import LikeMaterial from "../LikeMaterial";

interface ProjectComments {
  projectId: string;
  comments: ProjectCommentsProps[];
}

export default function ProjectComments({
  projectId,
  comments: initialComments,
}: ProjectComments) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newGithubLink, setNewGithubLink] = useState<string>("");
  const [comments, setComments] =
    useState<ProjectCommentsProps[]>(initialComments);

  // Listen for real-time updates
  useEffect(() => {
    const q = query(
      collection(db, "communityProjects"),
      where("projectId", "==", projectId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedComments: ProjectCommentsProps[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedComments.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to Date
        } as ProjectCommentsProps);
      });
      setComments(updatedComments);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setNewComment("");
    setNewGithubLink("");

    const data = {
      projectId,
      user: session?.user,
      comment: newComment,
      githubLink: newGithubLink,
    };

    try {
      const response = await fetch("/api/addDocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white/90 mb-8">
        Proyectos de la comunidad
      </h2>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl shadow-md p-6 mb-8 bg-gray-100"
      >
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Comparte tu solución
          </label>
          <textarea
            id="comment"
            rows={3}
            className="w-full rounded-md bg-white border-gray-500 shadow-sm p-3 focus-visible:outline-gray-400"
            placeholder="Cuéntanos cómo ideaste tu solución..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="githubLink"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Link al repositorio
          </label>
          <input
            type="url"
            id="githubLink"
            className="w-full rounded-md bg-white border-gray-300 shadow-sm p-3 focus-visible:outline-gray-400"
            placeholder="https://github.com/username/repository"
            value={newGithubLink}
            onChange={(e) => setNewGithubLink(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary-300 text-white px-4 py-2 rounded-md hover:bg-primary-400 transition-colors cursor-pointer disabled:bg-gray-400"
          disabled={isLoading}
        >
          Compartir proyecto
        </button>
      </form>

      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start gap-2">
              <Image
                src={comment.user.image}
                alt={comment.user.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
                width={100}
                height={100}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {comment.user.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{comment.comment}</p>
                <a
                  href={comment.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Ver en Github
                </a>
              </div>
              <LikeMaterial color="a5a5a5" guid={comment.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
