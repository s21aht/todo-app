/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || "http://demo-api.ashikhassan.com" // backend express API
  }
};

module.exports = nextConfig;