import React from "react";
import { Users, BookOpen, GraduationCap, Briefcase } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  description: string;
  stats: {
    count: string;
    audience: string;
    outcomes: string;
  };
}

export default function CategoryHeader({
  title,
  description,
  stats,
}: CategoryHeaderProps) {
  return (
    <div className="relative py-16 md:py-20 px-6 overflow-hidden bg-slate-50/50">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6 tracking-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-xl text-slate-600 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
          {description}
        </p>

        {/* Context Strip */}
        <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-blue" />
            <span className="text-slate-700">{stats.count}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-blue" />
            <span className="text-slate-700">{stats.audience}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-blue" />
            <span className="text-slate-700">{stats.outcomes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
