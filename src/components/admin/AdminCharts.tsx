"use client";

import { cn } from "@/lib/utils";

export type ChartPoint = {
  label: string;
  value: number;
};

type SparklineProps = {
  data: ChartPoint[];
  className?: string;
  tone?: "blue" | "emerald" | "violet" | "amber";
};

const tones = {
  blue: "from-blue-400 to-cyan-300",
  emerald: "from-emerald-400 to-teal-300",
  violet: "from-violet-400 to-fuchsia-300",
  amber: "from-amber-300 to-orange-400",
};

export function Sparkline({ data, className, tone = "blue" }: SparklineProps) {
  const values = data.length ? data.map((point) => point.value) : [0];
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
      const y = 90 - (value / max) * 72;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={cn("relative h-44 overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4", className)}>
      <div className={cn("absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t opacity-20", tones[tone])} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="relative h-full w-full">
        <defs>
          <linearGradient id={`line-${tone}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="currentColor" />
          </linearGradient>
        </defs>
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" className="text-blue-300" />
        {values.map((value, index) => {
          const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
          const y = 90 - (value / max) * 72;
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="1.8" className="fill-white" />;
        })}
      </svg>
    </div>
  );
}

export function BarChart({ data, className, tone = "blue" }: SparklineProps) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <div className={cn("flex h-44 items-end gap-2 rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4", className)}>
      {data.map((point) => (
        <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div
            className={cn("w-full rounded-t-lg bg-gradient-to-t transition-all duration-500", tones[tone])}
            style={{ height: `${Math.max((point.value / max) * 100, 8)}%` }}
            title={`${point.label}: ${point.value}`}
          />
          <span className="max-w-full truncate text-[10px] text-white/45">{point.label}</span>
        </div>
      ))}
    </div>
  );
}
