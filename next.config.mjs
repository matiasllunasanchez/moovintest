import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Regla para cachear los tiles de Carto
        source: "/(.*)basemaps.cartocdn.com/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, must-revalidate", // Cachear por 1 semana
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
