import Link from "next/link";
import { ArrowRight, Home, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type RouteStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  action?: () => void;
  actionLabel?: string;
};

export function RouteState({
  eyebrow = "BigTechJournals",
  title,
  description,
  primaryHref = "/stories",
  primaryLabel = "Explore stories",
  secondaryHref = "/",
  secondaryLabel = "Back home",
  action,
  actionLabel = "Try again",
}: RouteStateProps) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#050816] px-4 py-24 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <section className="relative w-full max-w-2xl rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">{eyebrow}</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/62 sm:text-lg">{description}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {action ? (
            <button
              type="button"
              onClick={action}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              {actionLabel}
            </button>
          ) : (
            <Link
              href={primaryHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 sm:w-auto"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <Link
            href={secondaryHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/72 transition hover:border-blue-400/35 hover:text-white sm:w-auto"
          >
            <Home className="h-4 w-4" />
            {secondaryLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}

export function RouteSkeleton({ label = "Loading" }: { label?: string }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] px-4 py-24 text-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 h-12 w-48 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl sm:p-8">
            <div className="h-5 w-36 animate-pulse rounded-full bg-blue-400/20" />
            <div className="mt-6 h-14 max-w-3xl animate-pulse rounded-2xl bg-white/[0.08]" />
            <div className="mt-4 h-14 max-w-2xl animate-pulse rounded-2xl bg-white/[0.07]" />
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-3xl bg-white/[0.055]" />
              ))}
            </div>
          </section>
          <aside className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">
            <div className="h-4 w-24 animate-pulse rounded-full bg-white/[0.08]" />
            <div className="mt-5 space-y-3">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className={cn("h-12 animate-pulse rounded-2xl bg-white/[0.055]", item === 2 && "w-3/4")} />
              ))}
            </div>
          </aside>
        </div>
        <p className="sr-only">{label}</p>
      </div>
    </main>
  );
}
