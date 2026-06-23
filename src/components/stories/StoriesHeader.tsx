import React from "react";
import { motion } from "framer-motion";

export default function StoriesHeader() {
  return (
    <div className="relative overflow-hidden px-4 py-20 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_78%_20%,rgba(34,211,238,0.10),transparent_28%)]" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.p
          className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          Real career intelligence
        </motion.p>
        <motion.h1
          className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Stories
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/68 sm:text-xl"
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
