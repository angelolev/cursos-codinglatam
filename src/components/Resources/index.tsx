import { BookText } from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from "next/link";

interface ResourcesProps {
  classId: string;
}

interface ResourceProps {
  classId: string;
  href: string;
  title: string;
}

async function getClassResources(
  classId: string
): Promise<ResourceProps[] | null> {
  try {
    const resourcesRef = collection(db, "resources");
    const q = query(resourcesRef);

    const querySnapshot = await getDocs(q);

    const resourcesDoc = querySnapshot.docs.find(
      (doc) => doc.data().classId === classId
    );

    if (!resourcesDoc) return null;

    const data = resourcesDoc.data();
    return [
      {
        classId: data.classId,
        href: data.href,
        title: data.title,
      },
    ];
  } catch (error) {
    console.error("Failed to fetch resource:", error);
    return null;
  }
}

export default async function Resources({ classId }: ResourcesProps) {
  const resources = await getClassResources(classId);

  return (
    <>
      {resources?.map((item) => (
        <Link
          href={item.href}
          target="_blank"
          className="flex items-center gap-2"
          key={item.classId}
        >
          <BookText color="#eec048" />
          <span className="text-white/80">{item.title}</span>
        </Link>
      ))}
    </>
  );
}
