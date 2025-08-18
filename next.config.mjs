import withPWAInit from "@ducanh2912/next-pwa";

const isProd = process.env.NODE_ENV === 'production';

const withPWA = withPWAInit({
  dest: "public",
  disable: !isProd,
  register: true,         
  // skipWaiting: process.env.NODE_ENV === 'production'   
});


const nextConfig = {
    images: {
        remotePatterns: [],
    },
};
export default withPWA(nextConfig);

