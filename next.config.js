/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://api.mooluck.xyz/:path*',
      },
    ];
  },
};
module.exports = nextConfig;
