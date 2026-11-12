import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BAKONG_ACCOUNT_ID:
      process.env.NEXT_PUBLIC_BAKONG_ACCOUNT_ID ||
      process.env.BAKONG_ACCOUNT_ID ||
      "",
    NEXT_PUBLIC_BAKONG_MERCHANT_NAME:
      process.env.NEXT_PUBLIC_BAKONG_MERCHANT_NAME ||
      process.env.BAKONG_MERCHANT_NAME ||
      "",
  },
  experimental: {
    agentFeedback: true,
    cpus: 1,
  },
};

export default nextConfig;
