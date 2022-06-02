/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    COMPREHELP_SERVER: process.env.COMPREHELP_SERVER,
    GOOGLE_FORM_API_SERVER: process.env.GOOGLE_FORM_API_SERVER
  },
}

module.exports = nextConfig
