/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@uimkit/uikit-react'],
}

module.exports = nextConfig
