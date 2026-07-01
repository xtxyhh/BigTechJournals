"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export interface FooterSettings {
  footerTagline?: string;
  contactEmail?: string;
  contactPhone?: string | null;
  contactAddress?: string | null;
  socialTwitter?: string | null;
  socialLinkedin?: string | null;
  socialInstagram?: string | null;
}

export default function Footer({
  settings = {},
}: {
  settings?: FooterSettings;
}) {
  const tagline = settings.footerTagline ?? "Empowering engineers with real stories, roadmaps, and insights from the industry's best.";
  const email = settings.contactEmail ?? "hello@bigtechjournals.com";

  const socials = [
    { icon: Twitter, href: settings.socialTwitter, label: "Twitter" },
    { icon: Linkedin, href: settings.socialLinkedin, label: "LinkedIn" },
    { icon: Instagram, href: settings.socialInstagram, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-surface pt-24 pb-0 border-t border-white/[0.08] overflow-hidden relative">
      {/* Ambient glow blobs */}
      <div className="absolute -top-32 left-[10%] w-[28rem] h-[28rem] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-[5%] w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="group text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <Image
                src="/images/logo/logo-dark.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-blue-500/40"
              />
              BigTechJournals
            </Link>
            <p className="text-surface-muted text-lg leading-relaxed max-w-sm">{tagline}</p>
            {socials.length > 0 && (
              <div className="flex gap-4 pt-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-surface-card border border-white/[0.08] flex items-center justify-center text-surface-muted transition-all duration-300 hover:scale-110 hover:bg-brand-blue hover:text-white hover:border-brand-blue hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-1" />

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-8 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-surface-muted font-medium">
              <li><Link href="/stories" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Stories</Link></li>
              <li><Link href="/stories" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Categories</Link></li>
              <li><Link href="/submit" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Submit Story</Link></li>
              <li><Link href="/company/google" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Companies</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-8 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-surface-muted font-medium">
              <li><Link href="/category/interview-prep" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Interview Prep</Link></li>
              <li><Link href="/category/dsa" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">DSA</Link></li>
              <li><Link href="/category/internships" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Internships</Link></li>
              <li><Link href="/category/career-switch" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Career Switch</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-8 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4 text-surface-muted font-medium">
              <li><a href={`mailto:${email}`} className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">{email}</a></li>
              {settings.contactPhone && <li>{settings.contactPhone}</li>}
              <li><Link href="/contact" className="inline-block hover:text-accent-blue hover:translate-x-1 transition-all duration-200">Send a message →</Link></li>
              {settings.contactAddress && (
                <li className="pt-4 text-xs text-surface-muted/70 whitespace-pre-line">{settings.contactAddress}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.08] py-8 flex flex-col md:flex-row justify-between items-center text-sm text-surface-muted/70 font-medium">
          <p>&copy; {new Date().getFullYear()} Big Tech Journals. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/contact" className="hover:text-white hover:underline underline-offset-4 transition-all duration-200">Contact</Link>
            <Link href="/submit" className="hover:text-white hover:underline underline-offset-4 transition-all duration-200">Write for us</Link>
          </div>
        </div>
      </div>

      <div className="w-full text-center pointer-events-none select-none overflow-hidden leading-none opacity-[0.04]">
        <span className="text-[12vw] md:text-[14vw] font-black uppercase tracking-tighter whitespace-nowrap block translate-y-[20%] bg-clip-text text-transparent bg-[linear-gradient(110deg,rgba(255,255,255,0.15),rgba(255,255,255,0.9),rgba(255,255,255,0.15))] [background-size:300%_100%] animate-aurora">
          Big Tech Journals
        </span>
      </div>
    </footer>
  );
}