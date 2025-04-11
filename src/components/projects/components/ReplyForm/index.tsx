"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ReplyFormProps {
  projectId: string;
  parentId: string;
  onReplyComplete?: () => void;
}

export default function ReplyForm({
  projectId,
  parentId,
  onReplyComplete,
}: ReplyFormProps) {
  const [reply, setReply] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const data = {
      projectId,
      parentId,
      user: {
        image: session?.user.image,
        name: session?.user.name,
      },
      comment: reply,
      githubLink: "", // Replies don't need GitHub links
    };

    try {
      const response = await fetch("/api/projectComments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      // Clear the form
      setReply("");

      // Notify parent that reply is complete
      if (onReplyComplete) {
        onReplyComplete();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 ml-10 mb-4 rounded-lg shadow-sm p-4 bg-gray-50"
    >
      <div className="mb-4">
        <textarea
          rows={2}
          className="w-full rounded-md bg-white border-gray-300 shadow-sm p-2 focus-visible:outline-gray-400"
          placeholder="Escribe tu respuesta..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-primary-300 text-white px-3 py-1 rounded-md hover:bg-primary-400 transition-colors cursor-pointer disabled:bg-gray-400 text-sm"
          disabled={isLoading}
        >
          Responder
        </button>
      </div>
    </form>
  );
}
