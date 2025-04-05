/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    NETWORK: process.env.NETWORK,
  },
  publicRuntimeConfig: {
    network: process.env.NETWORK,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig;