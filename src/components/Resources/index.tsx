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

    const resourcesDocs = querySnapshot.docs.filter(
      (doc) => doc.data().classId === classId
    );

    if (!resourcesDocs) return null;

    const resources = resourcesDocs.map((doc) => {
      const data = doc.data();
      return {
        classId: data.classId,
        href: data.href,
        title: data.title,
      };
    });

    return resources;
  } catch (error) {
    console.error("Failed to fetch resource:", error);
    return null;
  }
}

export default async function Resources({ classId }: ResourcesProps) {
  const resources = await getClassResources(classId);

  if (resources?.length === 0) {
    return (
      <p className="text-white/90">Pronto agregaremos recursos para ti!</p>
    );
  }

  return (
    <>
      {resources?.map((item) => (
        <Link
          href={item.href}
          target="_blank"
          className="flex items-center gap-2 mb-4"
          key={item.title}
        >
          <BookText size={24} color="#eec048" />
          <span className="w-full text-white/80">{item.title}</span>
        </Link>
      ))}
    </>
  );
}
