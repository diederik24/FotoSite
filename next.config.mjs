/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images unoptimized voor Vercel (betere compatibiliteit)
  images: {
    unoptimized: true,
  },
  // Static export alleen voor productie builds
  // Voor development wordt dit uitgeschakeld zodat alles goed werkt
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
  } : {}),
};

export default nextConfig;
