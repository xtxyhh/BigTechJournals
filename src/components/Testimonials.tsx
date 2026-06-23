"use client";
import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Link from "next/link";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "BigTechJournals Team writes good content and is also very laborious.",

    name: "Ali Haider",

    role: "Quant @ Graviton | Ex-Intern Goldman Sachs",

    avatar: "/images/stories/ali-haider.png",

    storyImage: "/images/stories/ali-haider.png",

    link: "/stories/ali-haider",
  },

  {
    id: 2,

    quote:
      "From resources, roadmap, mistakes to avoid, to my full interview experience - it's all documented. Truly grateful to BigTechJournals for capturing my journey and sharing it with aspiring techies out there! Hope this helps someone who's still figuring things out.",

    name: "Sanya Dureja",

    role: "Software Engineer @ PayPal",

    avatar: "/images/stories/sanya-dureja.png",

    storyImage: "/images/stories/sanya-dureja.png",

    link: "/stories/sanya-dureja",
  },

  {
    id: 3,

    quote:
      "Great initiative to help students who wonder about whom to reach out for guidance. Their 7-minute read journals can clear many common doubts of students.",

    name: "Yash Chauhan",

    role: "Software Engineer @ JP Morgan",

    avatar: "/images/stories/yash-chauhan.png",

    storyImage: "/images/stories/yash-chauhan.png",

    link: "/stories/yash-chauhan",
  },

  {
    id: 4,

    quote:
      "BigTechJournals reached out to feature my journey of cracking Google, which ended up being the very first story on the platform. What I appreciate most is that the team has been showing up regularly and trying to build something meaningful for the tech community.",

    name: "Parishi Thada",

    role: "SDE Intern @ Blinkit | Ex-Intern @ Google",

    avatar: "/images/stories/parishi-thada.png",

    storyImage: "/images/stories/parishi-thada.png",

    link: "/stories/parishi-thada",
  },

  {
    id: 5,

    quote:
      "I had a great experience sharing my story with BigTechJournals. They are really doing a great job in bringing up and articulating such inspiring stories which are helpful to a lot of aspiring engineers.",

    name: "Ayush Kumar Singh",

    role: "SDE-2 @ YAL | Ex-SDE @ Amazon",

    avatar: "/images/stories/ayush-kumar-singh.png",

    storyImage: "/images/stories/ayush-kumar-singh.png",

    link: "/stories/ayush-kumar-singh",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-surface overflow-hidden relative">
      <div className="absolute inset-0 bg-aurora opacity-25 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 relative z-10">
        <span className="text-sm font-semibold text-surface-muted uppercase tracking-wider mb-2 block">
          Testimonials
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Don&apos;t take our word for it!
          <br />
          <span className="text-surface-muted">Hear it from our partners.</span>
        </h2>
      </div>

      <div className="relative w-full overflow-x-hidden">
        <div
          className="flex w-max gap-5 px-4 animate-scroll hover:[animation-play-state:paused]"
          style={
            {
              "--animation-duration": "60s",
              "--animation-direction": "forwards",
            } as React.CSSProperties
          }
        >
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={`original-${item.id}`} item={item} />
          ))}
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={`duplicate-${item.id}`} item={item} />
          ))}
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={`triplicate-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: (typeof TESTIMONIALS)[0] }) {
  return (
    <Link
      href={item.link}
      className="group relative flex h-[460px] w-[min(350px,calc(100vw-2rem))] shrink-0 flex-col overflow-hidden rounded-[24px] border border-surface-border bg-surface-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/35 hover:shadow-card-hover md:w-[400px]"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <Image
          src={item.storyImage}
          alt={item.name}
          fill
          sizes="400px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center pl-1 transition-transform duration-200 group-hover:scale-110">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 p-8 w-full text-white bg-gradient-to-t from-black/80 to-transparent">
          <p className="font-script text-3xl mb-1">{item.name}</p>
          <p className="text-sm opacity-90">{item.role}</p>
        </div>
      </div>

      <div className="relative z-0 flex h-full flex-col justify-between gap-6 group-hover:opacity-0 transition-opacity duration-300">
        <div className="min-h-0 flex-1">
          <div className="mb-6 relative w-12 h-12 rounded-full overflow-hidden border-2 border-surface-border">
            <Image
              src={item.avatar}
              alt={item.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>

          <blockquote className="line-clamp-[9] text-base font-medium leading-7 text-white sm:text-lg">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        </div>

        <div>
          <div className="mb-1 text-2xl font-semibold text-white/78">
            {item.name}
          </div>
          <div className="line-clamp-2 text-sm font-medium leading-5 text-surface-muted">{item.role}</div>
        </div>
      </div>
    </Link>
  );
}
