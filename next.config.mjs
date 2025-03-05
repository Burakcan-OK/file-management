/** @type {import('next').NextConfig} */
const nextConfig = {env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default nextConfig;
