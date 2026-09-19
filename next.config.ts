import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // DUMMY: foto speaker sementara dari Unsplash.
    // Hapus setelah foto asli dari client masuk ke folder public/.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;