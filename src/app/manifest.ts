import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Digital Agency`,
    short_name: SITE.name,
    description: SITE.proposition,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0c09",
    theme_color: "#0f0c09",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      // Mark inside the 80% safe zone on a full-bleed background, so
      // Android's circular or squircle mask never clips it.
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
