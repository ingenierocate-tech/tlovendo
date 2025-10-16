/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Solo imágenes locales - eliminados dominios externos (drive.google.com, etc.)
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { dev }) => {
    if (dev) config.cache = false; // workaround HMR cache
    return config;
  },
};

module.exports = nextConfig;