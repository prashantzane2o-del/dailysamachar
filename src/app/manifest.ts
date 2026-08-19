import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "DailySamachar", short_name: "DailySamachar", description: "Independent journalism for India and the world.", start_url: "/", display: "standalone", background_color: "#fffdfa", theme_color: "#d32f2f", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] }; }
