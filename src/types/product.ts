export interface ProductProps {
  id: string;
  image: string;
  title: string;
  slug: string;
  description: string;
  format: string[];
  pages: number;
  href: string;
  isFree: boolean;
  createdAt?: Date | null; // Firebase Timestamp converted to Date
}
