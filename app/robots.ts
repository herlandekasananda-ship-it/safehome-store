import type { MetadataRoute } from "next";

const BASE_URL = "https://safehome-store.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/cart",
          "/checkout",
          "/account",
          "/search",
          "/*?*sort=",
          "/*?*filter=",
          "/*?*page=",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}