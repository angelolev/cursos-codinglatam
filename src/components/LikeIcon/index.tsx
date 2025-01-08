"use client";
import { useAuth } from "@/app/auth/auth-context";
import { db } from "@/utils/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { useEffect, useOptimistic, useState, useTransition } from "react";

interface LikeIconProps {
  classId: string;
}

const LikeIcon = ({ classId }: LikeIconProps) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const [liked, setLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [likeDocId, setLikeDocId] = useState<null | string>(null);
  const [likesCount, setLikesCount] = useState<number>(0);

  const [optimisticState, addOptimisticState] = useOptimistic(
    { liked, likesCount },
    (state, newState: { liked: boolean; likesCount: number }) => ({
      ...state,
      ...newState,
    })
  );

  useEffect(() => {
    const initializeLikeState = async () => {
      try {
        const likesRef = collection(db, "likes");
        // Get total likes count
        const countQuery = query(likesRef, where("classId", "==", classId));
        const countSnapshot = await getDocs(countQuery);
        setLikesCount(countSnapshot.size);

        // Check if user has liked
        const userLikeQuery = query(
          likesRef,
          where("userId", "==", user?.uid),
          where("classId", "==", classId)
        );

        const userLikeSnapshot = await getDocs(userLikeQuery);
        if (!userLikeSnapshot.empty) {
          setLiked(true);
          setLikeDocId(userLikeSnapshot.docs[0].id);
        }
      } catch (error) {
        console.error("Error initializing like state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.uid && classId) {
      initializeLikeState();
    }
  }, [user?.uid, classId]);

  const handleLike = async () => {
    if (isLoading || isPending) return;

    startTransition(async () => {
      // Immediately update optimistic state
      addOptimisticState({
        liked: !optimisticState.liked,
        likesCount:
          optimisticState.likesCount + (optimisticState.liked ? -1 : 1),
      });

      try {
        // Only add document if transitioning to liked state
        if (!liked) {
          const docRef = await addDoc(collection(db, "likes"), {
            classId,
            userId: user?.uid,
            createdAt: serverTimestamp(),
          });
          setLikeDocId(docRef.id);
          setLiked(true);
          setLikesCount((prev) => prev + 1);
        } else {
          if (likeDocId) {
            await deleteDoc(doc(db, "likes", likeDocId));
            setLikeDocId(null);
            setLiked(false);
            setLikesCount((prev) => prev - 1);
          }
        }
      } catch (error) {
        console.error("Error adding like:", error);
        // Revert optimistic update on error
        addOptimisticState({
          liked: optimisticState.liked,
          likesCount: optimisticState.likesCount,
        });
      }
    });
  };

  return (
    <div className="mt-4 flex items-center gap-2">
      <svg
        height="32px"
        version="1.1"
        viewBox="0 0 512 512"
        width="32px"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleLike}
      >
        <g id="_x31_66_x2C__Heart_x2C__Love_x2C__Like_x2C__Twitter">
          <g>
            <path
              d="M365.4,59.628c60.56,0,109.6,49.03,109.6,109.47c0,109.47-109.6,171.8-219.06,281.271    C146.47,340.898,37,278.568,37,169.099c0-60.44,49.04-109.47,109.47-109.47c54.73,0,82.1,27.37,109.47,82.1    C283.3,86.999,310.67,59.628,365.4,59.628z"
              className={`${liked ? "fill-red-400" : "fill-[#fff]"}`}
            />
          </g>
        </g>
        <g id="Layer_1" />
      </svg>
      <span className="text-white">{optimisticState.likesCount}</span>
    </div>
  );
};

export default LikeIcon;
