"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface AddCommentFormProps {
  projectId: string;
}

export default function AddCommentForm({ projectId }: AddCommentFormProps) {
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newGithubLink, setNewGithubLink] = useState<string>("");
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setNewComment("");
    setNewGithubLink("");

    const data = {
      projectId,
      user: {
        image: session?.user.image,
        name: session?.user.name,
      },
      comment: newComment,
      githubLink: newGithubLink,
    };

    try {
      const response = await fetch("/api/projectComments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await response.json();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
