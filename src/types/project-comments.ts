import { UserProps } from "./user";

export interface ProjectCommentsProps {
  id: string;
  comment: string;
  githubLink: string;
  projectId: string;
  user: UserProps;
  timestamp: Date;
}
