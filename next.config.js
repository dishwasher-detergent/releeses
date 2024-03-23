/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cloud.appwrite.io" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["node-appwrite"],
    serverActions: {
      allowedOrigins: ["app.localhost:3000"],
    },
  },
};
