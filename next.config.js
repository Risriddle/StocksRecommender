/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  output:undefined,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  images: { unoptimized: true },
};

module.exports = nextConfig;

module.exports = {
  webpack: (config) => {
    // Increase timeout to 60 seconds
    config.watchOptions = {
      aggregateTimeout: 60000,
    };
    return config;
  },
}