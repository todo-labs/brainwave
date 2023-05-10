/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "de"],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ["picsum.photos", "images.unsplash.com", "images.pexels.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default config;
