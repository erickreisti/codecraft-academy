/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gyarobrsaodtkhilrtru.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gyarobrsaodtkhilrtru.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
