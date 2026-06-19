import Link from "next/link";

interface Company {
  name: string;
  slug: string;
  logo: string | null;
}

interface LogoCloudProps {
  companies?: Company[];
}

const FALLBACK_LOGOS = [
  { name: "Google", slug: "google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", slug: "microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Amazon", slug: "amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta", slug: "meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "Netflix", slug: "netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
];

export default function LogoCloud({ companies }: LogoCloudProps) {
  const logos = companies?.length
    ? companies.filter((c) => c.logo).slice(0, 12)
    : FALLBACK_LOGOS;

  return (
    <section className="py-10 pt-20 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Trusted by engineers from
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo) => (
            <Link
              key={logo.slug}
              href={`/company/${logo.slug}`}
              className="hover:opacity-100 transition-opacity"
            >
              <img
                src={logo.logo!}
                alt={logo.name}
                className="h-6 md:h-8 w-auto object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
