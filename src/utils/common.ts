import { collection, getDocs, query } from "firebase/firestore";
import { CourseProps } from "@/types/course";
import { db } from "@/utils/firebase";
import { VideoLibrary } from "@/types/video-library";

export async function getCourseBySlug(
  slug: string
): Promise<CourseProps | null> {
  try {
    // Query to find course by slug
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef);

    const querySnapshot = await getDocs(q);

    // Find the course with matching slug
    const courseDoc = querySnapshot.docs.find(
      (doc) => doc.data().slug === slug
    );

    if (!courseDoc) return null;

    return {
      id: courseDoc.id,
      ...courseDoc.data(),
    } as CourseProps;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

export async function getCourseClasses(
  slug: string
): Promise<VideoLibrary[] | null> {
  try {
    const videoLibraries = await fetch("https://api.bunny.net/videolibrary", {
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_STREAM_KEY || "",
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (!videoLibraries) return null;

    return videoLibraries.filter((item: VideoLibrary) => item.Name === slug);
  } catch (error) {
    console.error("Failed to fetch video librarie:", error);
    return null;
  }
}

export const orderVideosByTitle = (videos: CourseProps[]) => {
  const orderedVideos = videos.sort((a: CourseProps, b: CourseProps) => {
    const matchA = a.title.match(/^\d+/);
    const matchB = b.title.match(/^\d+/);

    if (!matchA) return 1; // Move items without numbers to the end
    if (!matchB) return -1;

    return parseInt(matchA[0]) - parseInt(matchB[0]);
  });

  return orderedVideos;
};
