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

interface CourseProjectProps {
  title: string;
  ideas: string[];
}
export interface LiveCourseProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  available: boolean;
  buyLink: string;
  days: string;
  demo: string;
  discountPrice: number;
  price: number;
  figmaLink: string;
  schedule: string;
  startDate: string;
  topics: string[];
  image: string;
  instructor: string;
  temario: string;
  project: CourseProjectProps;
  purchaseLink: string;
}
