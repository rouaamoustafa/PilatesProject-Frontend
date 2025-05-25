// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        // Proxy /api/* to your local NestJS backend on port 3000
        // Use 127.0.0.1 instead of localhost to force IPv4
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:3000/api/:path*",
        },
      ];
    }

    // Production: proxy to remote backend URL
    return [
      {
        source: "/api/:path*",
        destination: "https://pilatesproject-backend-3zu5.onrender.com/api/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dogjmwbludxifciuvnfh.supabase.co",
        pathname: "/storage/v1/object/public/gym-owners/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;