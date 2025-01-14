import { Star, StarHalf } from "lucide-react";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";

interface AverageRatingProps {
  reviewId: string;
}

export async function AverageRating({ reviewId }: AverageRatingProps) {
  const getAverageRating = async (reviewId: string) => {
    const reviewsRef = collection(db, "reviews");
    const coursePrefix = `${reviewId}-`;

    const q = query(
      reviewsRef,
      where(documentId(), ">=", coursePrefix),
      where(documentId(), "<", coursePrefix + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    let totalRating = 0;
    let count = 0;

    querySnapshot.forEach((doc) => {
      const rating = doc.data().rating;
      if (rating) {
        totalRating += rating;
        count++;
      }
    });

    const averageRating = count > 0 ? totalRating / count : 0;
    return { averageRating, totalRatings: count };
  };

  const { averageRating, totalRatings } = await getAverageRating(reviewId);

  const rating = Number(averageRating.toFixed(1));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={20} className="fill-yellow-500 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <StarHalf size={20} className="fill-yellow-500 text-yellow-500" />
        )}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <Star key={`empty-${i}`} size={20} className="text-gray-400" />
        ))}
      </div>
      <span className="text-yellow-500 font-medium">{rating}</span>
      <span className="text-gray-400">
        (
        {totalRatings === 1
          ? `${totalRatings} opinión`
          : `${totalRatings} opiniones`}
        )
      </span>
    </div>
  );
}
