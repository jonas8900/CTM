import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  register: true,         
  skipWaiting: process.env.NODE_ENV === 'production'   
});


const nextConfig = {
    images: {
        remotePatterns: [],
    },
};
export default withPWA(nextConfig);

