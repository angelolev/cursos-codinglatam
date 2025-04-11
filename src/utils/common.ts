import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { CourseProps, LiveCourseProps } from "@/types/course";
import { db } from "@/utils/firebase";
import { ProductProps } from "@/types/product";
import { WorkshopProps } from "@/types/workshop";
import { ProjectProps } from "@/types/project";
import { ProjectCommentsProps } from "@/types/project-comments";

export async function getCourseBySlug(
  slug: string
): Promise<CourseProps | null> {
  try {
    // Query to find course by slug
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, where("slug", "==", slug));

    const querySnapshot = await getDocs(q);

    // Check if any course matches the slug
    if (querySnapshot.empty) {
      console.warn(`No course found with slug: ${slug}`);
      return null;
    }

    // Assuming slugs are unique, get the first matching document
    const courseDoc = querySnapshot.docs[0];

    return {
      id: courseDoc.id,
      ...courseDoc.data(),
    } as CourseProps;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    throw new Error(`Failed to fetch course with slug: ${slug}`);
    return null;
  }
}

export async function getLiveCourseBySlug(
  slug: string
): Promise<LiveCourseProps | null> {
  try {
    // Query to find course by slug
    const coursesRef = collection(db, "liveCourses");
    const q = query(coursesRef, where("slug", "==", slug));

    const querySnapshot = await getDocs(q);

    // Check if any course matches the slug
    if (querySnapshot.empty) {
      console.warn(`No course found with slug: ${slug}`);
      return null;
    }

    // Assuming slugs are unique, get the first matching document
    const courseDoc = querySnapshot.docs[0];

    return {
      id: courseDoc.id,
      ...courseDoc.data(),
    } as LiveCourseProps;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    throw new Error(`Failed to fetch course with slug: ${slug}`);
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

export async function getProductBySlug(
  slug: string
): Promise<ProductProps | null> {
  try {
    // Query to find course by slug
    const productsRef = collection(db, "products");
    const q = query(productsRef);

    const querySnapshot = await getDocs(q);

    // Find the course with matching slug
    const productDoc = querySnapshot.docs.find(
      (doc) => doc.data().slug === slug
    );

    if (!productDoc) return null;

    const data = productDoc.data();
    return {
      id: productDoc.id,
      image: data.image,
      title: data.title,
      slug: data.slug,
      format: data.format,
      pages: data.pages,
      href: data.href,
      description: data.description,
      ...data,
    } as ProductProps;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

export async function getWorkshopByslug(
  slug: string
): Promise<WorkshopProps | null> {
  try {
    // Query to find course by slug
    const workshopsRef = collection(db, "workshops");
    const q = query(workshopsRef);

    const querySnapshot = await getDocs(q);

    // Find the course with matching slug
    const wordshopDoc = querySnapshot.docs.find(
      (doc) => doc.data().slug === slug
    );

    if (!wordshopDoc) return null;

    const data = wordshopDoc.data();
    return {
      id: wordshopDoc.id,
      image: data.image,
      title: data.title,
      slug: data.slug,
      description: data.description,
      available: data.available,
      releaseDate: data.releaseDate,
      isFree: data.isFree,
      ...data,
    } as WorkshopProps;
  } catch (error) {
    console.error("Failed to fetch workshop:", error);
    return null;
  }
}

export async function getCourses(): Promise<CourseProps[] | null> {
  try {
    const coursesCollection = collection(db, "courses");
    const querySnapshot = await getDocs(coursesCollection);
    const coursesList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        guid: data.guid,
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        buyLink: data.buyLink,
        available: data.available,
        slug: data.slug,
        duration: data.duration,
        image: data.image,
        level: data.level,
        releaseDate: data.releaseDate,
        testimonialVideo: data.testimonialVideo,
        topics: data.topics || [],
        hasAllClassesAvailable: data.hasAllClassesAvailable,
        length: data.length,
      };
    });
    return coursesList;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

export async function getProducts(): Promise<ProductProps[] | null> {
  try {
    const productsCollection = collection(db, "products");
    const querySnapshot = await getDocs(productsCollection);
    const productsList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        image: data.image,
        slug: data.slug,
        format: data.format,
        pages: data.pages,
        href: data.href,
        isFree: data.isFree,
      };
    });
    return productsList;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

export async function getWorkshops(): Promise<WorkshopProps[] | null> {
  try {
    const workshopsCollection = collection(db, "workshops");

    // First, get available workshops
    const availableQuery = query(
      workshopsCollection,
      where("available", "==", true),
      orderBy("releaseDate", "desc")
    );

    // Then, get non-available workshops
    const nonAvailableQuery = query(
      workshopsCollection,
      where("available", "==", false),
      orderBy("releaseDate", "desc")
    );

    // Execute both queries
    const [availableSnapshot, nonAvailableSnapshot] = await Promise.all([
      getDocs(availableQuery),
      getDocs(nonAvailableQuery),
    ]);

    // Map available workshops
    const availableWorkshops = availableSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      image: doc.data().image,
      slug: doc.data().slug,
      available: doc.data().available,
      releaseDate: doc.data().releaseDate,
      isFree: doc.data().isFree,
    }));

    // Map non-available workshops
    const nonAvailableWorkshops = nonAvailableSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      image: doc.data().image,
      slug: doc.data().slug,
      available: doc.data().available,
      releaseDate: doc.data().releaseDate,
      isFree: doc.data().isFree,
    }));

    // Combine both arrays, available workshops will be first
    return [...availableWorkshops, ...nonAvailableWorkshops];
  } catch (error) {
    console.error("Failed to fetch workshops:", error);
    return null;
  }
}

export const getVideosFromCollection = async (collectionId: string) => {
  const courseCollections = {
    react: {
      collectionId: "ec89bb8c-a703-444c-8f00-70a6f138dfe7",
    },
    javascript: {
      collectionId: "50efd55f-c061-4c22-a2ee-032ad92b2f6c",
    },
    web: {
      collectionId: "80e121f4-0083-444c-bb22-10b89383114d",
    },
  };

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BUNNYNET_API_URL}/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/videos`,
    {
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  const { items } = await data.json();
  const filteredClases = items?.filter(
    (item: { collectionId: string }) =>
      item.collectionId ===
      courseCollections[collectionId as keyof typeof courseCollections]
        .collectionId
  );

  const clases =
    filteredClases?.length > 0 ? orderVideosByTitle(filteredClases) : null;

  return clases;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad with leading zeros if needed
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export async function getLiveCourses(): Promise<LiveCourseProps[] | null> {
  try {
    const coursesCollection = collection(db, "liveCourses");
    const querySnapshot = await getDocs(coursesCollection);
    const coursesList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        available: data.available,
        buyLink: data.buyLink,
        price: data.price,
        discountPrice: data.discountPrice,
        thumbnail: data.thumbnail,
        startDate: data.startDate,
        endDate: data.endDate,
        schedule: data.schedule,
        days: data.days,
        demo: data.demo,
        figmaLink: data.figmaLink,
        topics: data.topics,
        image: data.image,
        instructor: data.instructor,
        temario: data.temario,
        slug: data.slug,
        project: data.project,
        purchaseLink: data.purchaseLink,
      };
    });
    return coursesList;
  } catch (error) {
    console.error("Failed to fetch live courses:", error);
    return null;
  }
}

export async function getProjects(): Promise<ProjectProps[] | null> {
  try {
    const projectsCollection = collection(db, "projects");
    const querySnapshot = await getDocs(projectsCollection);
    const projectsList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        image: data.image,
        duration: data.duration,
        difficulty: data.difficulty,
        stack: data.stack,
        longDescription: data.longDescription,
        features: data.features,
        figmaLink: data.figmaLink,
        slug: data.slug,
      };
    });
    return projectsList;
  } catch (error) {
    console.error("Failed to fetch live courses:", error);
    return null;
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectProps | null> {
  try {
    // Query to find course by slug
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef);

    const querySnapshot = await getDocs(q);

    // Find the course with matching slug
    const projectDoc = querySnapshot.docs.find(
      (doc) => doc.data().slug === slug
    );

    if (!projectDoc) return null;

    return {
      id: projectDoc.id,
      ...projectDoc.data(),
    } as ProjectProps;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function getProjectComments(
  projectId: string
): Promise<ProjectCommentsProps[]> {
  try {
    const projectCommentsRef = collection(db, "projectsComments");

    const q = query(projectCommentsRef, where("projectId", "==", projectId));

    const querySnapshot = await getDocs(q);

    const projectComments: ProjectCommentsProps[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projectComments.push({
        id: doc.id, // Include the document ID
        comment: data.comment,
        githubLink: data.githubLink,
        projectId: data.projectId,
        parentId: data.parentId || null, // Include parentId
        user: data.user,
        timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to JavaScript Date
      });
    });

    return projectComments;
  } catch (error) {
    console.error("Error fetching comments: ", error);
    throw new Error("Failed to fetch comments");
  }
}
