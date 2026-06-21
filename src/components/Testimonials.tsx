"use client";
import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Link from "next/link";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "The lovely team at DesignMe has provided our startup with significant leverage. Their work is exceptionally professional, and Adrian is always attentive to our needs.",
    name: "Patrick Nawrocki",
    role: "UX Manager at Superhabits",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100",
    storyImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    link: "/stories/patrick-nawrocki",
  },
  {
    id: 2,
    quote:
      "DesignMe has greatly exceeded our expectations. The communication is always excellent, the turnaround is extremely quick, and the designs are fresh, innovative, and spot on!",
    name: "Rob West",
    role: "CEO of Kingdom Advisors",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&h=100",
    storyImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    link: "/stories/rob-west",
  },
  {
    id: 3,
    quote:
      "The level of thought they put into each design is amazing. They really understood our brand voice. I'd recommend them to anyone looking for top-tier design work.",
    name: "Sarah Jenkins",
    role: "Product Lead at Spotify",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&h=100",
    storyImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    link: "/stories/sarah-jenkins",
  },
  {
    id: 4,
    quote:
      "Their approach to problem-solving is unique. They don't just design; they think about the user experience deeply. It's been a game-changer for our dashboard.",
    name: "David Chen",
    role: "Senior Engineer at Google",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=100&h=100",
    storyImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    link: "/stories/david-chen",
  },
  {
    id: 5,
    quote:
      "I was skeptical about outsourcing design, but this team proved me wrong. They integrated seamlessly with our devs and delivered assets that were developer-ready.",
    name: "Emily Davis",
    role: "CTO at TechFlow",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=100&h=100",
    storyImage:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    link: "/stories/emily-davis",
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
          className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused] ml-4"
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
      className="block group relative w-[min(350px,calc(100vw-2rem))] md:w-[400px] h-[450px] shrink-0 bg-surface-card rounded-4xl p-8 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-card-hover overflow-hidden cursor-pointer border border-surface-border"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <Image
          src={item.storyImage}
          alt={item.name}
          fill
          sizes="400px"
          className="object-cover"
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

      <div className="relative z-0 h-full flex flex-col justify-between group-hover:opacity-0 transition-opacity duration-300">
        <div className="flex-1">
          <div className="mb-6 relative w-12 h-12 rounded-full overflow-hidden border-2 border-surface-border">
            <Image
              src={item.avatar}
              alt={item.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>

          <blockquote className="text-lg text-white leading-relaxed font-medium">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        </div>

        <div className="mt-8">
          <div className="font-script text-2xl text-surface-muted mb-1">
            {item.name}
          </div>
          <div className="text-sm text-surface-muted font-medium">{item.role}</div>
        </div>
      </div>
    </Link>
  );
}
