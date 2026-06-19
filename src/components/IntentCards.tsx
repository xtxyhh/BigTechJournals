import { Briefcase, Code, GraduationCap, TrendingUp, Zap } from "lucide-react";

const intents = [
    { icon: GraduationCap, label: "I want my first Big Tech internship", color: "bg-blue-50 text-blue-600" },
    { icon: Code, label: "I'm preparing for interviews", color: "bg-indigo-50 text-indigo-600" },
    { icon: Zap, label: "I'm stuck with DSA", color: "bg-amber-50 text-amber-600" },
    { icon: Briefcase, label: "I want to switch to a product company", color: "bg-emerald-50 text-emerald-600" },
    { icon: TrendingUp, label: "I want to grow faster in my tech career", color: "bg-rose-50 text-rose-600" },
];

export default function IntentCards() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {intents.map((intent, idx) => (
                        <div
                            key={idx}
                            className="group p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col items-start gap-4"
                        >
                            <div className={`p-3 rounded-xl ${intent.color}`}>
                                <intent.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">
                                {intent.label}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
