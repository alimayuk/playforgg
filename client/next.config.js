const createNextIntlPlugin = require("next-intl/plugin");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mdxeditor/editor"],
  reactStrictMode: true,
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
module.exports = withNextIntl(nextConfig);
