/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // 1) Proxy all /api/* calls to Render
      {
        source: '/api/:path*',
        destination: 'https://pilatesproject-backend-3zu5.onrender.com/:path*',
      },
      // 2) Proxy /uploads/* to Render as well
      {
        source: '/uploads/:path*',
        destination: 'https://pilatesproject-backend-3zu5.onrender.com/uploads/:path*',
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pilatesproject-backend-3zu5.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
