import LikeMaterial from "@/components/LikeMaterial";
import { ProjectCommentsProps } from "@/types/project-comments";
import { Github } from "lucide-react";
import Image from "next/image";

interface CommentsProps {
  comments: ProjectCommentsProps[];
}

export default function Comments({ comments }: CommentsProps) {
  return (
    <div className="space-y-8">
      {comments.map((comment) => {
        return (
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
        );
      })}
    </div>
  );
}
