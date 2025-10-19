import LikeMaterial from "@/components/LikeMaterial";
import { ProjectCommentsProps } from "@/types/project-comments";
import { Github, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CommentsProps {
  comments: ProjectCommentsProps[];
  onReply?: (parentId: string) => void;
}

// Comment component to handle both top-level and nested comments
const Comment = ({
  comment,
  onReply,
}: {
  comment: ProjectCommentsProps;
  onReply?: (parentId: string) => void;
}) => {
  const [showReplies] = useState(true);

  return (
    <div
      className={`${
        comment.parentId
          ? "ml-10 mt-4 bg-gray-50 rounded-lg p-4 border-l-4 border-primary-200"
          : "bg-white rounded-xl shadow-md p-6"
      }`}
    >
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
            <h3 className="font-semibold text-gray-900">{comment.user.name}</h3>
            <span className="text-sm text-gray-500">
              {new Date(comment.timestamp).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
          <p className="mt-2 text-gray-600">{comment.comment}</p>
          {comment.githubLink && (
            <a
              href={comment.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Github className="h-4 w-4 mr-2" />
              Ver en Github
            </a>
          )}

          {onReply && !comment.parentId && (
            <button
              onClick={() => onReply(comment.id)}
              className="mt-3 ml-4 inline-flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Responder
            </button>
          )}
        </div>
        <LikeMaterial color="a5a5a5" guid={comment.id} />
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={`mt-4 ${showReplies ? "block" : "hidden"}`}>
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Comments({ comments, onReply }: CommentsProps) {
  // Function to build a nested comment tree
  const buildCommentTree = (comments: ProjectCommentsProps[]) => {
    const commentMap = new Map<string, ProjectCommentsProps>();
    const rootComments: ProjectCommentsProps[] = [];

    // First pass: create a map of all comments by ID
    comments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    // Second pass: link replies to their parents
    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent && parent.replies) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="space-y-8">
      {commentTree.map((comment) => (
        <Comment key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
}
