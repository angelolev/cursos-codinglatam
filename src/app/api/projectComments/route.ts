import { UserProps } from "@/types/user";
import { db } from "@/utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Define the type for the request body
interface RequestBody {
  projectId: string;
  user: UserProps;
  comment: string;
  githubLink: string;
  parentId?: string; // Add parentId for replies
}

export async function POST(request: Request) {
  try {
    const { projectId, user, comment, githubLink, parentId }: RequestBody =
      await request.json();

    // Prepare document data, only include parentId if it's defined
    const docData: {
      projectId: string;
      user: UserProps;
      comment: string;
      githubLink: string;
      timestamp: Date;
      parentId?: string;
    } = {
      projectId,
      user,
      comment,
      githubLink,
      timestamp: new Date(),
    };

    // Only add parentId if it's not undefined (for replies)
    if (parentId !== undefined && parentId !== null) {
      docData.parentId = parentId;
    }

    const docRef = await addDoc(collection(db, "projectsComments"), docData);

    return NextResponse.json(
      { id: docRef.id, message: "Document added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json(
      { error: "Failed to add document" },
      { status: 500 }
    );
  }
}
