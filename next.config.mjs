import withPWA from "@ducanh2912/next-pwa";

const isProd = process.env.NODE_ENV === "production";

const withPWAConfigured = withPWA({
  dest: "public",
  disable: !isProd,
});

const nextConfig = {
  images: {
    domains: ["i.scdn.co"],
  },
};

export default withPWAConfigured(nextConfig);
