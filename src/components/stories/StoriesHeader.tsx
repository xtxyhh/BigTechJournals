import React from "react";
import { motion } from "framer-motion";

export default function StoriesHeader() {
  return (
    <div className="relative py-20 px-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 mix-blend-multiply filter animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 mix-blend-multiply filter animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Stories
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Real tech journeys, not advice written after success.
        </motion.p>
      </div>
    </div>
  );
}
