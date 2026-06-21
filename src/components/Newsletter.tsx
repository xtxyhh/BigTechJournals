"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";

interface NewsletterProps {
  title?: string;
  description?: string;
}

export default function Newsletter({
  title = "Subscribe",
  description = "Subscribe to our newsletter & stay updated with the latest engineering stories and insights.",
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to subscribe");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px] fill-surface" aria-hidden="true">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 mt-12 md:mt-20">
        <div className="bg-surface-card/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-blue-500/5 relative overflow-hidden border border-white/[0.08]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5" aria-hidden="true">
            <Mail className="absolute top-10 left-10 w-12 h-12 -rotate-12 text-blue-400" />
            <Mail className="absolute bottom-12 right-10 w-14 h-14 -rotate-6 text-blue-400" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {status === "success" ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">You&apos;re subscribed!</h2>
                <p className="text-surface-muted">Check your inbox for a welcome email.</p>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 mx-auto ring-1 ring-blue-500/20">
                    <Mail className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
                  {title}
                </h2>
                <p className="text-surface-muted text-lg max-w-lg mx-auto mb-10">{description}</p>
                <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                  <div className="relative grow">
                    <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-surface-muted" aria-hidden="true" />
                    </div>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full pl-11 pr-4 py-4 bg-surface-elevated border border-white/[0.08] text-white placeholder:text-surface-muted/70 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group whitespace-nowrap disabled:opacity-50"
                  >
                    {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" /></>}
                  </button>
                </form>
                {status === "error" && <p className="text-red-400 text-sm mt-3" role="alert">{errorMsg}</p>}
              </>
            )}
          </div>
        </div>
        <p className="text-surface-muted/70 text-sm text-center mt-8">Join engineers from Google, Meta, Amazon, and more.</p>
      </div>
    </section>
  );
}
