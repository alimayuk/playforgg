const createNextIntlPlugin = require("next-intl/plugin");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["via.placeholder.com", "localhost"],
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
module.exports = withNextIntl(nextConfig);
