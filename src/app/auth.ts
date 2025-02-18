import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import NextAuth, { Profile } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Patreon from "next-auth/providers/patreon";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Patreon({
      authorization: { params: { scope: "identity identity[email]" } },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.profile = profile?.sub;
        token.isPremium = profile?.sub
          ? await fecthIsPremiumFirebase(profile.sub)
          : false;
      }
      return token;
    },

    async signIn({ user, account }) {
      if (account?.provider === "patreon" && account.access_token) {
        try {
          // Fetch the user's email and check if they are a patron
          const userResponse = await fetch(
            "https://www.patreon.com/api/oauth2/v2/identity?fields%5Buser%5D=email",
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          const userData = await userResponse.json();
          const userEmail = userData.data.attributes.email;

          const patronsResponse = await fetch(
            `https://www.patreon.com/api/oauth2/v2/campaigns/4891214/members?include=user&fields[member]=patron_status,last_charge_status,last_charge_date,email&fields[user]=email`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          const patronsData = await patronsResponse.json();

          const patrons = patronsData?.data;
          console.log("patreones");

          patrons.map((x) => console.log(x.attributes.patron_status));

          const isPatron = patrons.some(
            (patron: any) => patron.attributes.email === userEmail
          );

          user.isPatron = isPatron; // Attach Patreon status to the user object
          return true; // Allow sign-in
        } catch (error) {
          console.error("Error fetching Patreon data:", error);
          return false; // Deny sign-in
        }
      }
      return false; // Deny sign-in for other providers
    },
    async session({ session, user }) {
      // Attach the user's Patreon status to the session
      session.user.isPatron = user.isPatron;
      return session;
    },
    // async session({ session, token }) {
    //   return {
    //     ...session,
    //     user: {
    //       ...session.user,
    //       id: token.id as string,
    //       aud: token.profile as string,
    //       isPremium: token.isPremium as boolean,
    //     },
    //   };
    // },
    // async signIn({ profile }) {
    //   if (profile?.aud) {
    //     await addUserFirebase(profile);
    //   }
    //   return true;
    // },
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
