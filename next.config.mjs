/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export alleen voor productie builds
  // Voor development wordt dit uitgeschakeld zodat alles goed werkt
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? {
    output: 'export',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  } : {}),
};

export default nextConfig;
