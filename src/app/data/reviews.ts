export interface Review {
    id: string;
    courseId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    userImage: string;
  }
  
  export const reviews: Review[] = [
    {
      id: "1",
      courseId: "modern-react",
      userName: "John Smith",
      rating: 5,
      comment: "This course completely transformed my understanding of React. The sections on hooks and context were particularly enlightening.",
      date: "2024-02-15",
      userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
    },
    {
      id: "2",
      courseId: "modern-react",
      userName: "Emily Chen",
      rating: 4,
      comment: "Great course content and practical examples. Would have loved more advanced optimization techniques.",
      date: "2024-02-10",
      userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
    },
    {
      id: "3",
      courseId: "typescript-fundamentals",
      userName: "Mike Johnson",
      rating: 5,
      comment: "Perfect introduction to TypeScript. The instructor explains complex concepts in a very accessible way.",
      date: "2024-02-20",
      userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
    }
  ];