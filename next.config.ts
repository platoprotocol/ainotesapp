import type { NextConfig } from "next";

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/ainotes' : '';

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default nextConfig;
