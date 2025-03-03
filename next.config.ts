import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  missingSuspenseWithCSRBailout: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "vz-fefbc3dc-ab2.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "c10.patreonusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
