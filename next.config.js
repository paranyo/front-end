/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://api.mooluck.xyz/api/:path*',
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
