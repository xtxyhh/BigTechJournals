"use client";
import React from "react";
import { Mail, Send } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Creative Wave Divider (Transition from slate-50) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] md:h-[100px] fill-slate-50"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 mt-12 md:mt-20">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden border border-slate-100">
          {/* Background Decorative Icons (Scattered Effect) - subtle inside the card */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <Mail className="absolute top-10 left-10 w-12 h-12 -rotate-12" />
            <Mail className="absolute top-8 right-20 w-8 h-8 rotate-12" />
            <Mail className="absolute bottom-12 left-20 w-10 h-10 rotate-45" />
            <Mail className="absolute bottom-20 right-10 w-14 h-14 -rotate-6" />
            <Mail className="absolute top-1/2 left-4 w-6 h-6 rotate-180" />
            <Mail className="absolute top-1/3 right-8 w-9 h-9 -rotate-45" />
            <Mail className="absolute bottom-8 left-1/3 w-7 h-7 rotate-12" />
            <Mail className="absolute top-4 left-1/2 w-5 h-5 -rotate-6" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Main Icon */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-12 h-12 text-brand-blue" />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 uppercase tracking-tight mb-4">
              Subscribe
            </h2>

            <p className="text-slate-500 text-lg max-w-lg mx-auto mb-10">
              Subscribe to our newsletter & stay updated with the latest
              engineering stories and insights.
            </p>

            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <div className="relative grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                Submit{" "}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-slate-500 text-sm text-center mt-8">
          Join 10,000+ engineers from top companies.
        </p>
      </div>
    </section>
  );
}
