/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend URL
        destination: "https://brothers-qcfb.vercel.app/api/v1/:path*", // backend URL
      },
    ];
  },
};

export default nextConfig;
