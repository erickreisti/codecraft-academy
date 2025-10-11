// next.config.js - CONFIGURAÇÃO OTIMIZADA PARA SUPABASE
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "your-production-domain.com"],
    },
  },
  images: {
    remotePatterns: [
      // ✅ Configuração específica para Supabase Storage
      {
        protocol: "https",
        hostname: "gyarobrsaodtkhilrtru.supabase.co",
        pathname: "/storage/v1/object/public/course-images/**",
      },
      {
        protocol: "https",
        hostname: "gyarobrsaodtkhilrtru.supabase.co",
        pathname: "/storage/v1/object/public/post-images/**",
      },
      {
        protocol: "https",
        hostname: "gyarobrsaodtkhilrtru.supabase.co",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
  // Para desenvolvimento, você pode desativar a verificação de imagem
  // (apenas em desenvolvimento, não em produção)
  ...(process.env.NODE_ENV === "development" && {
    images: {
      unoptimized: true,
    },
  }),
};

module.exports = nextConfig;
