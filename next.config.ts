import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude plugin directory from compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/plugin/**', '**/node_modules'],
    };
    
    return config;
  },
  
  // Exclude plugin from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  
  experimental: {
    // typedRoutes: true, // Disabled for now due to build issues
  },
};

export default nextConfig;
