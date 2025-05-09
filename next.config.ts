/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // 1) Proxy all /api/* calls
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:3000/:path*',
      },
      // 2) Proxy /uploads/* so your <img src="/uploads/…"> works
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:3000/uploads/:path*',
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
