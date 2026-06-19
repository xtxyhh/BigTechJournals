import JournalCard from "./JournalCard";
import { ArrowRight } from "lucide-react";

const topics = [
  "Logic Building", "System Design", "Leadership", "Startups", "Web Development", "Design to Code", "View All"
];

const topicJournals = [
    {
    title: "Understanding Microservices Architecture",
    preview: "Break down the monolith. A beginner's guide to distributed systems.",
    author: "Emma Watson",
    date: "Aug 10, 2024",
    category: "System Design",
    company: "Netflix", 
    role: "Architect",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Network abstract
  },
  {
    title: "The Art of Code Review",
    preview: "How to give and receive feedback without hurting egos.",
    author: "Liam Neeson",
    date: "Aug 12, 2024",
    category: "Leadership",
    company: "Apple", 
    role: "Tech Lead",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // People talking
  },
  {
    title: "React Server Components Explained",
    preview: "Why they matter and how they change the way we build apps.",
    author: "Sophia Turner",
    date: "Aug 15, 2024",
    category: "Web Dev",
    company: "Vercel", 
    role: "DevRel",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // React logo/code
  }
];

export default function Topics() {
  return (
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
                 <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Topics</span>
                 <h2 className="text-3xl font-bold text-slate-900 mb-6">That Match For You</h2>
                 
                 <div className="flex flex-wrap gap-2">
                     {topics.map((topic, idx) => (
                         <button 
                            key={idx}
                            className={`px-6 py-2.5 rounded-full border text-sm font-bold transition-all ${idx === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue'}`}
                         >
                             {topic}
                         </button>
                     ))}
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {topicJournals.map((journal, idx) => (
                    <JournalCard key={idx} {...journal} />
                 ))}
            </div>
             
             <div className="mt-12 text-center">
                <button className="text-brand-blue font-bold hover:text-brand-blue-hover inline-flex items-center gap-1 transition-colors">
                    View all latest posts <ArrowRight className="w-4 h-4"/>
                </button>
            </div>
        </div>
    </section>
  );
}
