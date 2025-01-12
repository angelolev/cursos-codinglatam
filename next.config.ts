import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    ],
  },
};

export default nextConfig;
