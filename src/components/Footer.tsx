"use client";
import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-0 border-t-4 border-slate-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-24">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <Link
              href="/"
              className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <span className="font-serif italic font-bold text-xl">B</span>
              </div>
              Big Tech Journals.
            </Link>
            <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
              Empowering engineers with real stories, roadmaps, and insights
              from the industry's best.
            </p>
            <div className="flex gap-4 pt-2">
              {["Twitter", "Linkedin", "Instagram"].map((icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  {icon === "Twitter" && <Twitter className="w-4 h-4" />}
                  {icon === "Linkedin" && <Linkedin className="w-4 h-4" />}
                  {icon === "Instagram" && <Instagram className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer (1 col) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Columns (7 cols total) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-8 text-sm uppercase tracking-widest">
              Platform
            </h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Newsletters
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Authors
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-8 text-sm uppercase tracking-widest">
              Resources
            </h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Interviews
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  System Design
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Resume Guide
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Salary Data
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-bold text-slate-900 mb-8 text-sm uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li>hello@bigtechjournals.com</li>
              <li>+1 (555) 123-4567</li>
              <li className="pt-4 text-xs text-slate-400">
                123 Tech Avenue, Suite 100
                <br />
                San Francisco, CA 94107
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-100 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 font-medium">
          <p>
            &copy; {new Date().getFullYear()} Big Tech Journals. All rights
            reserved.
          </p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-slate-900">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Massive Typography Decoration */}
      <div className="w-full text-center pointer-events-none select-none overflow-hidden leading-none opacity-[0.03]">
        <span className="text-[12vw] md:text-[14vw] font-black text-slate-900 uppercase tracking-tighter whitespace-nowrap block translate-y-[20%]">
          Big Tech Journals
        </span>
      </div>
    </footer>
  );
}
