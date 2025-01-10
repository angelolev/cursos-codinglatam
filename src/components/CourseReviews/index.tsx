import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { reviews } from '@/app/data/reviews';

interface CourseReviewsProps {
  courseId: string;
}

export function CourseReviews({ courseId }: CourseReviewsProps) {
  const courseReviews = reviews.filter(review => review.courseId === courseId);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white/90 mb-8">Opiniones de los estudiantes</h2>
      <div className="space-y-8">
        {courseReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start">
                <div className="relative">
                    <Image src={review.userImage}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        width={48}
                        height={48}
                    />
                </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-gray-600">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}