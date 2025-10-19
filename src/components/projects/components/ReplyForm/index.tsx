"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Send } from "lucide-react";

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
        aud: session?.user?.email || "",
        id: session?.user?.email || "",
        image: session?.user?.image || "",
        name: session?.user?.name || "",
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

      await response.json();

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
          maxLength={200}
          required
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="text-xs text-gray-500">
          {reply.length}/200 caracteres
        </div>
        <button
          type="submit"
          className="bg-primary-300 text-white px-3 py-1 rounded-md hover:bg-primary-400 transition-colors cursor-pointer disabled:bg-gray-400 text-sm inline-flex items-center"
          disabled={isLoading}
        >
          <Send className="h-3 w-3 mr-1" />
          Responder
        </button>
      </div>
    </form>
  );
}
