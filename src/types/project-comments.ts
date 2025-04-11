import { UserProps } from "./user";

export interface ProjectCommentsProps {
  id: string;
  comment: string;
  githubLink: string;
  projectId: string;
  user: UserProps;
  timestamp: Date;
  parentId?: string; // For identifying parent comment (null for top-level comments)
  replies?: ProjectCommentsProps[]; // For nested replies
}
