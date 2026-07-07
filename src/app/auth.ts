import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NextAuth, { Profile } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// How long (ms) a cached isPremium value is trusted before we re-check Firestore.
const PREMIUM_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async jwt({ token, user, profile }) {
      // On sign-in: capture identity and fetch initial premium status.
      if (user) {
        token.id = user.id;
        token.profile = profile?.sub;

        const userIsPremium = profile?.sub
          ? await fecthIsPremiumFirebase(profile.sub)
          : false;

        token.isPremium = userIsPremium;
        token.premiumCheckedAt = Date.now();
        return token;
      }

      // On subsequent requests: refresh isPremium once the TTL expires so that
      // cancellations/expirations take effect without requiring a re-login.
      // Wrapped in try/catch: if the read fails (e.g. edge runtime), we keep the
      // cached value — never worse than the previous behaviour.
      const checkedAt = (token.premiumCheckedAt as number) ?? 0;
      const userId = token.profile as string | undefined;
      if (userId && Date.now() - checkedAt > PREMIUM_TTL_MS) {
        try {
          token.isPremium = await fecthIsPremiumFirebase(userId);
          token.premiumCheckedAt = Date.now();
        } catch (error) {
          console.error("Failed to refresh isPremium; keeping cached value:", error);
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
      image: profile.picture || profile.avatar_url || "",
      github: "",
      email: profile?.email || "",
      isPremium: false,
      premiumSince: null,
      updatedAt: null,
    };

    await setDoc(userDocRef, userData);
  } else {
    // Update image if it doesn't exist or has changed
    const existingData = userDoc.data();
    if (!existingData.image && (profile.picture || profile.avatar_url)) {
      await setDoc(
        userDocRef,
        { image: profile.picture || profile.avatar_url },
        { merge: true }
      );
    }
  }
};

const fecthIsPremiumFirebase = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  return userDoc.data()?.isPremium;
};
