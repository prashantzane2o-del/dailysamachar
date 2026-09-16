import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DailySamachar.org",
    short_name: "DailySamachar",
    description: "सच खबर, सही दिशा — independent journalism for India and the world.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e30613",
    icons: [{ src: "/Logo.png", sizes: "500x500", type: "image/png" }],
  };
}
