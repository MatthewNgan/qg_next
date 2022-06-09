/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    COMPREHELP_SERVER: process.env.COMPREHELP_SERVER,
    BACKEND_SERVER: process.env.BACKEND_SERVER
  },
}

module.exports = nextConfig
