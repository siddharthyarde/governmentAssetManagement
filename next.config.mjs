/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gams/types", "@gams/lib", "@gams/i18n", "@gams/ui"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
