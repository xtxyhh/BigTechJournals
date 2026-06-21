"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : "Failed to send");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Get in Touch</span>
            <h1 className="text-4xl font-bold text-[#f8fafc] mt-2">Contact Us</h1>
            <p className="text-[#94a3b8] mt-3">Questions, partnerships, or feedback — we&apos;d love to hear from you.</p>
          </div>

          {status === "success" ? (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-3xl p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#f8fafc]">Message sent!</h2>
              <p className="text-[#94a3b8] mt-2">We&apos;ll respond within 2 business days.</p>
              <button onClick={() => setStatus("idle")} className="mt-6 text-blue-400 font-medium">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#0f172a]/80 backdrop-blur border border-[#1e293b] rounded-3xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Name *</label>
                  <input name="name" required className="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] text-[#f8fafc] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-1">Email *</label>
                  <input name="email" type="email" required className="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] text-[#f8fafc] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Subject *</label>
                <input name="subject" required className="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] text-[#f8fafc] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Message *</label>
                <textarea name="message" required rows={6} className="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] text-[#f8fafc] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y" />
              </div>
              {status === "error" && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={status === "loading"} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors disabled:opacity-50">
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
