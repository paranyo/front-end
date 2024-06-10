/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://localhost:4000/:path*',
      },
    ];
  },
};
module.exports = nextConfig;
