import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { buildOrganizationJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BigTechJournals - Learn From People Who Cracked Big Tech",
    template: "%s | BigTechJournals",
  },
  description:
    "Real journeys. Interview experiences. Preparation guides. Resources. Everything in one place to help you crack Big Tech.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://bigtechjournals.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BigTechJournals",
    images: ["/images/logo/logo-dark.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo/logo-dark.png"],
  },
  icons: {
    icon: "/images/logo/favicon.png",
    apple: "/images/logo/logo-light.png",
  },
  manifest: "/manifest.webmanifest",
  applicationName: "BigTechJournals",
  appleWebApp: {
    title: "BigTechJournals",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
        </head>
        <body
          className={`${inter.variable} ${outfit.variable} antialiased bg-surface text-white font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
