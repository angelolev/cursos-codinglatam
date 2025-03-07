export interface ProjectProps {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  difficulty: string;
  stack: string[];
  longDescription?: string;
  features?: string[];
  figmaLink?: string;
  slug: string;
}
