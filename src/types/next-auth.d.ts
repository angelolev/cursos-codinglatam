import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isPremium?: boolean | false;
      aud: string | null;
      // Add any additional user properties you need
    };
  }
}
