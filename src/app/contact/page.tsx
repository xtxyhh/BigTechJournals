import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with the BigTechJournals team.",
  path: "/contact",
});

export { default } from "./ContactPage";
