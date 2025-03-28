/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  swcMinify: true,
  // Configure environment variables
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  // Optional: Configure image domains if you're using next/image
  images: {
    domains: ['your-domain.com'],
  }
}

module.exports = nextConfig 