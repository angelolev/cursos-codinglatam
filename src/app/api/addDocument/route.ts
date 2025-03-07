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
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { projectId, user, comment, githubLink }: RequestBody =
      await request.json();

    // Add a new document to the "contacts" collection
    const docRef = await addDoc(collection(db, "communityProjects"), {
      projectId,
      user,
      comment,
      githubLink,
      timestamp: new Date(),
    });

    // Return a success response
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
