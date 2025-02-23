export interface CourseProps {
  id: string;
  guid: string;
  title: string;
  description: string;
  shortDescription: string;
  buyLink: string;
  available: boolean;
  slug: string;
  duration: string;
  image: string;
  level: string;
  releaseDate: string;
  testimonialVideo: string;
  topics: string[];
  hasAllClassesAvailable: boolean;
  length: number;
}
