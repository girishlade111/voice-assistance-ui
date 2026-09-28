/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/voice-assistance-ui',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig