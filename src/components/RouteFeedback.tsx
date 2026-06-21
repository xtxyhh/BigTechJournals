import Link from "next/link";

export function PremiumLoading({ label = "Loading" }: { label?: string }) {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-40 animate-pulse rounded-full bg-blue-500/15" />
        <div className="mt-8 h-16 max-w-3xl animate-pulse rounded-3xl bg-white/[0.08]" />
        <div className="mt-4 h-6 max-w-2xl animate-pulse rounded-full bg-white/[0.06]" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">
              <div className="h-40 animate-pulse rounded-3xl bg-white/[0.06]" />
              <div className="mt-5 h-6 animate-pulse rounded-full bg-white/[0.08]" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-white/[0.06]" />
            </div>
          ))}
        </div>
        <p className="sr-only">{label}</p>
      </div>
    </main>
  );
}

export function PremiumErrorState({
  title = "Something went wrong",
  description = "The page could not load cleanly. Please try again.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050816] px-4 text-center text-white">
      <div className="max-w-lg rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-8 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">BigTechJournals</p>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="mt-3 leading-7 text-white/58">{description}</p>
        <Link href="/" className="mt-7 inline-flex rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
          Back home
        </Link>
      </div>
    </main>
  );
}
