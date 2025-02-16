/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  output:undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;

