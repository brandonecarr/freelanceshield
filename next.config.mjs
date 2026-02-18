/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    serverComponentsExternalPackages: ['pdf-parse'],
  },
};

export default nextConfig;
