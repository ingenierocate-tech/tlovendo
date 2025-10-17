/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Habilita soporte para la carpeta /app
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { dev }) => {
    if (dev) config.cache = false; // workaround HMR cache
    return config;
  },
};

module.exports = nextConfig;
