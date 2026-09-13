// next.config.ts

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function originFrom(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

const configuredWordPressOrigin = originFrom(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
const configuredPrivateWordPressOrigin = originFrom(process.env.WORDPRESS_API_URL);
const configuredMarketOrigin = originFrom(process.env.MARKET_PROVIDER_URL);
const configuredWeatherOrigin = originFrom(process.env.WEATHER_PROVIDER_URL);
const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  // Added api.dailysamachar.org to allow WordPress media images
  "img-src 'self' data: blob: https://dailysamachar.org https://api.dailysamachar.org https://images.unsplash.com https://secure.gravatar.com",
  "media-src 'self' https://dailysamachar.org https://api.dailysamachar.org",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://twitter.com https://platform.twitter.com",
  "worker-src 'self' blob:",
  [
    "connect-src 'self'",
    "https://dailysamachar.org",
    "https://api.dailysamachar.org",
    "https://api.open-meteo.com",
    "https://geocoding-api.open-meteo.com",
    "https://www.goldapi.io",
    configuredWordPressOrigin,
    configuredPrivateWordPressOrigin,
    configuredMarketOrigin,
    configuredWeatherOrigin,
  ]
    .filter(Boolean)
    .join(" "),
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    // Load CMS images directly in the browser. This prevents Next's
    // server-side optimizer from turning a temporary CMS/TLS outage into
    // repeated /_next/image 404/500 responses.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dailysamachar.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dailysamachar.org", // Added for WordPress API media loading
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/Logo.svg",
        headers: [{ key: "Content-Type", value: "image/png" }],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
