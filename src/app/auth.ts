import { db } from "@/utils/firebase";
import { isActivePatron } from "@/utils/patreon";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NextAuth, { Profile } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.profile = profile?.sub;

        const userIsPremium = profile?.sub
          ? await fecthIsPremiumFirebase(profile.sub)
          : false;

        if (userIsPremium) {
          token.isPremium = true;
        } else {
          token.isPremium = await isActivePatron(user?.email ?? "");
        }
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
          isPremium: token.isPremium as boolean,
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

const addUserFirebase = async (profile: Profile) => {
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

const fecthIsPremiumFirebase = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  return userDoc.data()?.isPremium;
};
