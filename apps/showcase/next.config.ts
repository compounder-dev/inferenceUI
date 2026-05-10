import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@inferenceui/ui", "@inferenceui/tokens"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "images.nvidia.com" },
      { protocol: "https", hostname: "www.nvidia.com" },
      { protocol: "https", hostname: "www.apple.com" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "assets.raspberrypi.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
