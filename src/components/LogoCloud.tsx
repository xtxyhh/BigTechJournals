"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Company {
  name: string;
  slug: string;
  logo: string | null;
}

interface LogoCloudProps {
  companies?: Company[];
}

const commonsFile = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

const TRUSTED_COMPANIES = [
  { name: "Adobe", slug: "adobe", logo: commonsFile("Adobe logo and wordmark (2017).svg") },
  { name: "Amazon", slug: "amazon", logo: commonsFile("Amazon logo.svg") },
  { name: "Apple", slug: "apple", logo: commonsFile("Apple logo black.svg") },
  { name: "Atlassian", slug: "atlassian", logo: commonsFile("Atlassian logo 2011.svg") },
  { name: "Barclays", slug: "barclays", logo: commonsFile("Barclays Bank (Deutschland) logo.svg") },
  { name: "Citadel", slug: "citadel", logo: commonsFile("Citadel LLC Logo.svg") },
  { name: "Deloitte", slug: "deloitte", logo: commonsFile("Logo of Deloitte.svg") },
  { name: "Goldman Sachs", slug: "goldman-sachs", logo: commonsFile("Goldman Sachs logo.svg") },
  { name: "Google", slug: "google", logo: commonsFile("Google 2015 logo.svg") },
  { name: "IBM", slug: "ibm", logo: commonsFile("IBM logo.svg") },
  { name: "JPMorgan", slug: "jpmorgan", logo: commonsFile("JPMorgan logo.svg") },
  { name: "Meesho", slug: "meesho", logo: "/company-logos/meesho.svg" },
  { name: "Microsoft", slug: "microsoft", logo: commonsFile("Microsoft logo (2012).svg") },
  { name: "Morgan Stanley", slug: "morgan-stanley", logo: commonsFile("Morgan Stanley Logo 1.svg") },
  { name: "NetApp", slug: "netapp", logo: commonsFile("NetApp logo.svg") },
  { name: "Oracle", slug: "oracle", logo: commonsFile("Oracle logo.svg") },
  { name: "PayPal", slug: "paypal", logo: commonsFile("PayPal 2024.svg") },
  { name: "Visa", slug: "visa", logo: commonsFile("Visa Inc. logo (2021–present).svg") },
  { name: "Walmart", slug: "walmart", logo: commonsFile("Walmart logo (2008).svg") },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function LogoTile({ company }: { company: Company }) {
  const [failed, setFailed] = useState(!company.logo);

  return (
    <Link
      href={`/company/${company.slug}`}
      className="group/logo relative flex h-11 w-28 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/25 hover:bg-white/[0.07] sm:w-32 md:h-12 md:w-36"
      aria-label={`${company.name} stories`}
    >
      {failed ? (
        <span className="truncate text-center text-xs font-semibold text-white/75 transition-colors group-hover/logo:text-white">
          {company.name}
        </span>
      ) : (
        <Image
          src={company.logo!}
          alt={company.name}
          fill
          sizes="(min-width: 768px) 144px, 128px"
          className="object-contain px-4 py-3 opacity-75 grayscale invert transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 group-hover/logo:invert-0"
          onError={() => setFailed(true)}
        />
      )}
    </Link>
  );
}

export default function LogoCloud({ companies }: LogoCloudProps) {
  const dbCompanies = new Map((companies ?? []).map((company) => [normalize(company.name), company]));
  const logos = TRUSTED_COMPANIES.map((company) => {
    const match = dbCompanies.get(normalize(company.name));
    return {
      ...company,
      slug: match?.slug ?? company.slug,
      logo: company.logo,
    };
  });

  return (
    <section className="border-b border-surface-border bg-surface/50 py-8 backdrop-blur-sm sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-surface-muted uppercase tracking-widest mb-8">
          Trusted by engineers from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
          {logos.map((logo) => (
            <LogoTile key={logo.slug} company={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
