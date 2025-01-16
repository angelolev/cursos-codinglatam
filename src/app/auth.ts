import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [GitHub, Google],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    async signIn({ user }) {
      if (user?.id) {
        // Run your function here
        /*  await yourFunction(user.id); */

        await addUserFirebase(user);
      }
      return true;
    },
  },
});

const addUserFirebase = async (user) => {
  console.log("inicio fire", user);
  const userDocRef = doc(db, "users", user.id || "");
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    console.log("docu exist");
  } else {
    console.log("else");
    const userData = {
      name: user.name,
      github: "",
      email: user?.email || "",
      isPremium: false,
      premiumSince: null,
      updatedAt: null,
    };

    await setDoc(doc(db, "users", user?.id || ""), userData);
  }
};
