import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false,
  },
  // Note: allowedDevOrigins removed as it was causing unrecognized key warnings in this environment.
};

export default nextConfig;
