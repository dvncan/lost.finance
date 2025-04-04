/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = nextConfig