/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    COMPREHELP_SERVER: process.env.COMPREHELP_SERVER,
    GOOGLE_FORM_API_SERVER: process.env.GOOGLE_FORM_API_SERVER
  },
}

module.exports = nextConfig
