/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle tesseract.js worker files
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    return config;
  },
}

module.exports = nextConfig
