import { ArrowRight, Quote } from "lucide-react";

export default function Spotlight() {
    return (
        <section className="py-24 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-sm font-semibold mb-6">
                            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                            Weekly Spotlight
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            From Biology Major to Senior Engineer at Netflix
                        </h2>

                        <div className="relative pl-8 mb-8 border-l-4 border-brand-blue/30">
                            <Quote className="absolute -top-1 left-8 text-brand-blue/10 w-12 h-12 -z-10 transform -scale-x-100" />
                            <p className="text-xl text-slate-600 italic leading-relaxed">
                                "The biggest mistake I made was thinking I needed a CS degree to compete. The reality was I just needed to stop learning languages and start building systems."
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                                {/* Placeholder for avatar */}
                                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-xs text-slate-500">JD</div>
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900">Sarah Jenkins</div>
                                <div className="text-slate-500 text-sm">Senior Software Engineer @ Netflix</div>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-blue-hover transition-colors group">
                            Read the full story
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl overflow-hidden relative group cursor-pointer">
                            {/* Abstract visual/Illustration placeholder */}
                            <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-slate-300 font-bold text-2xl tracking-widest uppercase">Spotlight Feature</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
