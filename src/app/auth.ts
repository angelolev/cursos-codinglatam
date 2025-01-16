import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [GitHub, Google],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.profile = profile?.sub;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          aud: token.profile as string,
        },
      };
    },
    async signIn({ profile }) {
      if (profile?.aud) {
        await addUserFirebase(profile);
      }
      return true;
    },
  },
});

const addUserFirebase = async (profile) => {
  const userDocRef = doc(db, "users", profile.sub || "");
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const userData = {
      name: profile.name,
      github: "",
      email: profile?.email || "",
      isPremium: false,
      premiumSince: null,
      updatedAt: null,
    };

    await setDoc(userDocRef, userData);
  }
};
