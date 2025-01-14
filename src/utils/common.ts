import { collection, getDocs, query } from "firebase/firestore";
import { CourseProps } from "@/types/course";
import { db } from "@/utils/firebase";
import { ProductProps } from "@/types/product";
import { WorkshopProps } from "@/types/workshop";

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
        topics: data.topics || [],
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
    const querySnapshot = await getDocs(workshopsCollection);
    const workshopsList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        image: data.image,
        slug: data.slug,
        available: data.available,
        releaseDate: data.releaseDate,
        isFree: data.isFree,
      };
    });
    return workshopsList;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}
