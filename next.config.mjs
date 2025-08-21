import withPWA from "@ducanh2912/next-pwa";

const isProd = process.env.NODE_ENV === "production";

const withPWAConfigured = withPWA({
  dest: "public",
  disable: !isProd,
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "catchthemoment.s3.eu-central-1.amazonaws.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "**",
      },
    ],
  },
};

export default withPWAConfigured(nextConfig);
