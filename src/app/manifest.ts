import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BigTechJournals",
    short_name: "BTJ",
    description: "Real Big Tech journeys, interview experiences, preparation guides, and resources.",
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/images/logo/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/images/logo/logo-light.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
