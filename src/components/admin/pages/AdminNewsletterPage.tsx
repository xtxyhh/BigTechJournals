"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Mail, MousePointerClick, Search, TrendingUp } from "lucide-react";
import { BarChart } from "@/components/admin/AdminCharts";

type Subscriber = { id: string; email: string; subscribedAt: string; active: boolean };
const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05]";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/newsletter").then((res) => (res.ok ? res.json() : [])).then(setSubscribers);
  }, []);

  const filtered = useMemo(() => subscribers.filter((subscriber) => subscriber.email.toLowerCase().includes(query.toLowerCase())), [subscribers, query]);
  const growth = subscribers.slice(0, 12).reverse().map((subscriber) => ({ label: new Date(subscriber.subscribedAt).toLocaleDateString("en", { month: "short", day: "numeric" }), value: 1 }));

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Subscribers", value: subscribers.length.toLocaleString(), icon: Mail },
          { label: "Open Rate", value: "42%", icon: TrendingUp },
          { label: "Click Rate", value: "18%", icon: MousePointerClick },
        ].map((metric) => (
          <div key={metric.label} className={`${panel} p-5`}>
            <metric.icon className="mb-4 h-5 w-5 text-blue-300" />
            <p className="text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-1 text-sm text-white/45">{metric.label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-white/70">Subscriber Growth</h2>
        <BarChart data={growth.length ? growth : [{ label: "Now", value: subscribers.length }]} tone="emerald" />
      </section>

      <div className={`${panel} p-3`}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3">
            <Search className="h-4 w-4 text-white/35" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subscribers" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
          </div>
          <a href="/api/admin/newsletter/export" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white">
            <Download className="h-4 w-4" /> Export CSV
          </a>
        </div>
      </div>

      <div className={`${panel} divide-y divide-white/[0.06]`}>
        {filtered.map((subscriber) => (
          <div key={subscriber.id} className="flex items-center justify-between gap-4 p-4 text-sm">
            <span className="truncate text-white/80">{subscriber.email}</span>
            <span className="shrink-0 text-white/40">{new Date(subscriber.subscribedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
