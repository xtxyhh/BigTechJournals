"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
}

export default function SubmitPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/companies").then((r) => r.json()),
    ]).then(([cats, comps]) => {
      setCategories(cats);
      setCompanies(comps);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/submissions", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="pt-32 max-w-lg mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Story Received!</h1>
          <p className="text-surface-muted">We&apos;ll review your submission and email you within 5–7 business days.</p>
          <button onClick={() => setSuccess(false)} className="mt-6 text-brand-blue font-medium">Submit another story</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-brand-blue uppercase tracking-widest">Share Your Journey</span>
            <h1 className="text-4xl font-bold text-white mt-2">Submit Your Story</h1>
            <p className="text-surface-muted mt-3">Help others learn from your Big Tech journey. All submissions are reviewed by our editorial team.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface-card rounded-3xl border border-surface-border shadow-sm p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Name *</label>
                <input name="name" required className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Email *</label>
                <input name="email" type="email" required className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">LinkedIn Profile</label>
              <input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Phone Number</label>
                <input name="phone" type="tel" className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Experience</label>
                <input name="experience" placeholder="0-2 years, Intern, SDE-1..." className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Current Company</label>
                <input name="currentCompany" className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Current Role</label>
                <input name="currentRole" className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">College</label>
                <input name="college" className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Graduation Year</label>
                <input name="graduationYear" inputMode="numeric" placeholder="2026" className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Story Title *</label>
              <input name="storyTitle" required className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Category</label>
                <select name="categoryId" className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-muted mb-1">Company</label>
                <select name="companyId" className="w-full px-4 py-2.5 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white">
                  <option value="">Select company</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Resume (PDF/DOC, max 5MB)</label>
              <input name="resume" type="file" accept=".pdf,.doc,.docx" className="w-full text-sm text-surface-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-surface-elevated file:text-white hover:file:bg-white/[0.1]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Story * (Markdown supported)</label>
              <textarea name="storyContent" required rows={12} placeholder="Tell your story... What happened? What did you learn? What would you do differently?" className="w-full px-4 py-3 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Interview Process</label>
              <textarea name="interviewProcess" rows={6} placeholder="Rounds, questions, timelines, interview format..." className="w-full px-4 py-3 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Resources Used</label>
              <textarea name="resourcesUsed" rows={5} placeholder="Courses, sheets, books, videos, mocks, communities..." className="w-full px-4 py-3 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Tips</label>
              <textarea name="tips" rows={5} placeholder="Practical advice and mistakes to avoid..." className="w-full px-4 py-3 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Timeline</label>
              <textarea name="timeline" rows={5} placeholder="Preparation timeline, application dates, rounds, offer..." className="w-full px-4 py-3 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-muted mb-1">Notes for Editors</label>
              <textarea name="notes" rows={3} placeholder="Anything else we should know?" className="w-full px-4 py-3 border border-surface-border bg-surface-elevated rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-white resize-y" />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-surface-elevated text-white font-medium rounded-full hover:bg-white/[0.1] transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Story
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
