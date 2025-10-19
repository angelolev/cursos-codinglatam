export interface StarterRepoProps {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  githubUrl: string;
  thumbnail: string;
  stack: string[];
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  features?: string[];
  isPremium: boolean;
  slug: string;
  setupTime?: string;
  demoUrl?: string;
  readme?: string;
  createdAt?: Date;
}
