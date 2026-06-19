"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Why Big Tech Journals?",
    answer:
      "Most people don't need more content; they need guidance they can trust. We share real journals strategies, and mistakes from people who have actually 'made it', so you can learn from proven journeys.",
  },
  {
    question: "Is this for students or experienced pros?",
    answer:
      "Both. We have dedicated tracks for internships, new grad roles, and experienced hires (L5+ leadership and system design).",
  },
  {
    question: "Can I share my own journey?",
    answer:
      "Yes! If you have a story that can inspire clarity or direction, we want to hear it. Click 'Submit your Story' to contribute.",
  },
  {
    question: "Do you offer mentorship?",
    answer:
      "We are piloting a mentorship program where you can get 1:1 guidance from the authors of our top stories.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-4">
            (FAQ) Questions And Answers
          </h2>
          <p className="text-slate-500">
            Find answers to common questions and get detailed information about
            our platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-slate-900">{faq.question}</span>
                <span className="p-2 bg-slate-100 rounded-full text-slate-500 transition-colors hover:bg-slate-200">
                  {activeIndex === idx ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-500 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
