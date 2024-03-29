/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: `ecjxknydscjngkpgdxke.supabase.co` },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["app.localhost:3000"],
    },
  },
};
