/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gams/types", "@gams/lib", "@gams/i18n", "@gams/ui"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
