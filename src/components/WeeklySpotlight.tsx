"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring,
} from "framer-motion";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

/* ── types ─────────────────────────────────────────────────── */
interface SpotlightStory {
  id: string; title: string; slug: string;
  excerpt: string; coverImage: string;
  authorName: string; authorRole: string; category: string;
}
interface WeeklySpotlightProps { stories?: SpotlightStory[]; }

/* ─────────────────────────────────────────────────────────────
   AURORA MESH CANVAS  (violet / cyan palette)
───────────────────────────────────────────────────────────── */
function AuroraMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const frameRef  = useRef(0);

  const onMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    window.addEventListener("mousemove", onMove, { passive: true });

    const COLS = 8, ROWS = 5;
    type Node = { bx:number; by:number; ox:number; oy:number; phase:number; speed:number };
    const nodes: Node[] = [];
    for (let r = 0; r <= ROWS; r++)
      for (let c = 0; c <= COLS; c++)
        nodes.push({ bx:0, by:0, ox:0, oy:0, phase: Math.random()*Math.PI*2, speed: 0.25+Math.random()*0.5 });

    let t = 0;
    const tick = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      t += 0.007;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      nodes.forEach((n, i) => {
        n.bx = ((i % (COLS+1)) / COLS) * w;
        n.by = (Math.floor(i / (COLS+1)) / ROWS) * h;
        const dx = mx - n.bx/w, dy = my - n.by/h;
        const pull = Math.max(0, 0.3 - Math.hypot(dx,dy)) * 2.2;
        n.ox = Math.sin(t*n.speed+n.phase)*18 + dx*pull*55;
        n.oy = Math.cos(t*n.speed*0.7+n.phase)*13 + dy*pull*55;
      });
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tl = nodes[r*(COLS+1)+c], tr = nodes[r*(COLS+1)+c+1];
          const bl = nodes[(r+1)*(COLS+1)+c], br = nodes[(r+1)*(COLS+1)+c+1];
          const hue = (c/COLS)*50 + (r/ROWS)*35 + t*18;
          const dist = Math.hypot((tl.bx+br.bx)/(2*w)-mx, (tl.by+br.by)/(2*h)-my);
          const a = Math.max(0.015, 0.13 - dist*0.24);
          const grd = ctx.createLinearGradient(tl.bx+tl.ox,tl.by+tl.oy,br.bx+br.ox,br.by+br.oy);
          grd.addColorStop(0, `hsla(${250+hue},80%,65%,${a})`);
          grd.addColorStop(1, `hsla(${190+hue},85%,62%,${a*0.5})`);
          ctx.beginPath();
          ctx.moveTo(tl.bx+tl.ox,tl.by+tl.oy); ctx.lineTo(tr.bx+tr.ox,tr.by+tr.oy);
          ctx.lineTo(br.bx+br.ox,br.by+br.oy); ctx.lineTo(bl.bx+bl.ox,bl.by+bl.oy);
          ctx.closePath(); ctx.fillStyle = grd; ctx.fill();
          ctx.strokeStyle = `hsla(${220+hue},75%,70%,${a*0.5})`; ctx.lineWidth=0.5; ctx.stroke();
        }
      }
      // Cursor orb
      const gx=mx*w, gy=my*h;
      const orb = ctx.createRadialGradient(gx,gy,0,gx,gy,w*0.38);
      orb.addColorStop(0,"rgba(139,92,246,0.14)"); orb.addColorStop(0.5,"rgba(34,211,238,0.06)"); orb.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=orb; ctx.fillRect(0,0,w,h);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frameRef.current); ro.disconnect(); window.removeEventListener("mousemove",onMove); };
  }, [onMove]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{opacity:0.85}} />;
}

/* ─────────────────────────────────────────────────────────────
   DEEP TILT CARD  (framer-motion spring physics, ±14°)
───────────────────────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y,[-0.5,0.5],[14,-14]),{stiffness:280,damping:28});
  const rotateY = useSpring(useTransform(x,[-0.5,0.5],[-14,14]),{stiffness:280,damping:28});
  const glowX   = useTransform(x,[-0.5,0.5],[0,100]);
  const glowY   = useTransform(y,[-0.5,0.5],[0,100]);

  const onMove = (e: React.MouseEvent|React.TouchEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
    x.set((cx-r.left)/r.width-0.5); y.set((cy-r.top)/r.height-0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref}
      style={{ rotateX, rotateY, transformStyle:"preserve-3d", perspective:1400 }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      onTouchMove={onMove} onTouchEnd={onLeave}
      className={className}
    >
      {/* Dynamic specular highlight follows tilt */}
      <motion.div className="absolute inset-0 rounded-[30px] pointer-events-none z-30"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
          ),
        }} />
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VERTICAL TIMELINE RAIL
───────────────────────────────────────────────────────────── */
function TimelineRail({ total, active, onSelect }: { total:number; active:number; onSelect:(i:number)=>void }) {
  return (
    <div className="hidden lg:flex flex-col items-center gap-0 absolute left-6 top-1/2 -translate-y-1/2">
      {Array.from({length:total}).map((_,i) => (
        <button key={i} onClick={()=>onSelect(i)} className="flex flex-col items-center group">
          {/* Node */}
          <div className="relative w-3 h-3 my-1 flex items-center justify-center cursor-pointer">
            {i===active && (
              <motion.div layoutId="timeline-active-ring"
                className="absolute inset-0 rounded-full"
                style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", boxShadow:"0 0 14px rgba(59,130,246,0.7)" }}
                transition={{type:"spring",stiffness:380,damping:30}} />
            )}
            <div className={`relative z-10 w-2 h-2 rounded-full transition-all duration-300 ${i===active?"bg-white scale-110":"bg-white/20 group-hover:bg-white/50"}`} />
          </div>
          {/* Connector line */}
          {i < total-1 && (
            <div className="w-px h-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10" />
              {i < active && (
                <motion.div className="absolute inset-0"
                  initial={{scaleY:0}} animate={{scaleY:1}}
                  style={{background:"linear-gradient(180deg,#3b82f6,#8b5cf6)",transformOrigin:"top"}}
                  transition={{duration:0.5,delay:0.1}} />
              )}
            </div>
          )}
        </button>
      ))}
      {/* Story number label */}
      <div className="mt-4 text-center">
        <motion.p key={active} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
          className="text-xs font-bold tabular-nums"
          style={{WebkitTextFillColor:"transparent",WebkitBackgroundClip:"text",backgroundImage:"linear-gradient(135deg,#60a5fa,#a78bfa)"}}>
          {String(active+1).padStart(2,"0")}
        </motion.p>
        <p className="text-[9px] text-white/30 uppercase tracking-widest">/ {String(total).padStart(2,"0")}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING 3D DEPTH PANELS (stacked behind the card)
───────────────────────────────────────────────────────────── */
function DepthPanels({ active }: { active: number }) {
  return (
    <>
      {/* Panel 3 — deepest */}
      <motion.div key={`p3-${active}`}
        initial={{opacity:0,scale:0.88,z:-120}} animate={{opacity:0.18,scale:0.9,z:-120}}
        exit={{opacity:0}} transition={{duration:0.6}}
        className="absolute inset-6 rounded-[34px] border border-white/[0.06]"
        style={{transform:"translateZ(-120px)",background:"rgba(8,12,32,0.6)",boxShadow:"0 0 60px rgba(99,102,241,0.12)"}} />
      {/* Panel 2 — mid */}
      <motion.div key={`p2-${active}`}
        initial={{opacity:0,scale:0.93}} animate={{opacity:0.28,scale:0.95}}
        exit={{opacity:0}} transition={{duration:0.5,delay:0.05}}
        className="absolute inset-3 rounded-[32px] border border-white/[0.08]"
        style={{transform:"translateZ(-60px)",background:"rgba(10,14,36,0.7)",boxShadow:"0 0 40px rgba(59,130,246,0.10)"}} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function WeeklySpotlight({ stories = [] }: WeeklySpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile]       = useState(false);
  const [prevIndex, setPrevIndex]     = useState<number|null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check(); window.addEventListener("resize",check);
    return () => window.removeEventListener("resize",check);
  }, []);

  /* Scroll-driven index — untouched logic */
  useEffect(() => {
    if (isMobile||!containerRef.current||!stories.length) return;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = rect.height - window.innerHeight;
      const scrollProgress = Math.max(0,Math.min(1,-rect.top/sectionHeight));
      const newIndex = Math.min(Math.floor(scrollProgress*stories.length),stories.length-1);
      setActiveIndex(Math.max(0,newIndex));
    };
    window.addEventListener("scroll",handleScroll,{passive:true});
    return () => window.removeEventListener("scroll",handleScroll);
  }, [isMobile,stories.length]);

  if (!stories.length) return null;

  const goto = (idx: number) => { setPrevIndex(activeIndex); setActiveIndex(idx); };
  const handleNext = () => goto((activeIndex+1)%stories.length);
  const handlePrev = () => goto((activeIndex-1+stories.length)%stories.length);
  const activeStory = stories[activeIndex];

  /* ════════════════════════════════════════════════════════════
     DESKTOP — scroll-driven cinematic reveal
  ════════════════════════════════════════════════════════════ */
  if (!isMobile) {
    return (
      <section ref={containerRef}
        className="relative bg-[#04050d]"
        style={{ height:`${stories.length*100}vh` }}
      >
        <style jsx>{`
          @keyframes border-spin { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
          @keyframes shimmer-scan { 0%{transform:translateX(-130%)} 100%{transform:translateX(380%)} }
          @keyframes particle-rise { 0%{transform:translateY(0) scale(1);opacity:0} 8%{opacity:1} 88%{opacity:.55} 100%{transform:translateY(-70vh) scale(.3);opacity:0} }
          @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.18);opacity:.15} }
          @keyframes holo-sweep { 0%{transform:translateX(-150%)} 100%{transform:translateX(400%)} }
        `}</style>

        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Aurora mesh */}
          <AuroraMesh />

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,rgba(148,163,250,0.8)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

          {/* Ambient orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-48 left-1/2 -translate-x-[55%] w-[700px] h-[600px] rounded-full bg-violet-600/12 blur-[180px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-[110px]" />
            <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-blue-600/8 blur-[80px] animate-pulse" />
          </div>

          {/* Floating particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(18)].map((_,i) => (
              <div key={i} className="absolute rounded-full"
                style={{
                  width: i%3===0?"3px":"2px", height: i%3===0?"3px":"2px",
                  left:`${4+(i*5.3)%92}%`, bottom:`${(i*11)%22}%`,
                  background: i%3===0?"rgba(167,139,250,0.6)":i%3===1?"rgba(96,165,250,0.5)":"rgba(34,211,238,0.4)",
                  animation:`particle-rise ${7+(i%6)*1.2}s ${(i*0.38)%6}s linear infinite`,
                  filter:"blur(0.4px)",
                }} />
            ))}
          </div>

          {/* Vertical timeline rail */}
          <TimelineRail total={stories.length} active={activeIndex} onSelect={goto} />

          {/* Centre content */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-8 lg:px-16 flex flex-col items-center gap-10">

            {/* Header */}
            <motion.div className="text-center" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/8 mb-5"
                style={{boxShadow:"0 0 24px rgba(139,92,246,0.15)"}}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">Weekly Spotlight</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-3">
                <span className="text-white">Featured </span>
                <span style={{
                  WebkitTextFillColor:"transparent", WebkitBackgroundClip:"text",
                  backgroundImage:"linear-gradient(135deg,#a78bfa 0%,#22d3ee 50%,#60a5fa 100%)",
                  filter:"drop-shadow(0 0 32px rgba(139,92,246,0.6))",
                }}>Stories</span>
              </h2>
              <p className="text-white/40 text-sm tracking-wide">
                {String(activeIndex+1).padStart(2,"0")} of {String(stories.length).padStart(2,"0")} curated journeys — scroll to explore
              </p>
            </motion.div>

            {/* Main card area */}
            <div className="relative w-full max-w-sm" style={{perspective:"1600px", transformStyle:"preserve-3d"}}>

              {/* Spinning gradient border ring */}
              <div className="absolute -inset-[1.5px] rounded-[34px] -z-10"
                style={{
                  background:"linear-gradient(90deg,#8b5cf6,#3b82f6,#22d3ee,#a78bfa,#8b5cf6)",
                  backgroundSize:"300% 100%", animation:"border-spin 4s linear infinite",
                  filter:"blur(1px)", opacity:0.7,
                }} />

              {/* Pulsing outer ring */}
              <div className="absolute -inset-4 rounded-[44px] border border-violet-400/20 pointer-events-none"
                style={{animation:"pulse-ring 3s ease-in-out infinite"}} />

              {/* Depth panels behind */}
              <div style={{transformStyle:"preserve-3d"}}>
                <AnimatePresence mode="wait">
                  <DepthPanels key={activeIndex} active={activeIndex} />
                </AnimatePresence>

                {/* Card with tilt */}
                <AnimatePresence mode="wait">
                  <motion.div key={activeIndex}
                    initial={{opacity:0, rotateX:25, scale:0.88, z:-200}}
                    animate={{opacity:1, rotateX:0, scale:1, z:0}}
                    exit={{opacity:0, rotateX:-15, scale:0.94, z:-100}}
                    transition={{duration:0.65, ease:[0.16,1,0.3,1]}}
                    style={{transformStyle:"preserve-3d"}}
                  >
                    <TiltCard className="relative w-full">
                      {/* Card shell */}
                      <div className="relative rounded-[30px] overflow-hidden border border-white/[0.07]"
                        style={{
                          background:"linear-gradient(150deg,rgba(10,14,38,0.98),rgba(4,6,20,0.99))",
                          boxShadow:"0 40px 100px rgba(99,102,241,0.2), 0 0 0 1px rgba(167,139,250,0.10) inset",
                        }}>

                        {/* Cover */}
                        <div className="relative w-full aspect-[9/14] overflow-hidden">
                          <Image src={safeImageUrl(activeStory.coverImage,DEFAULT_IMAGES.storyCover)}
                            alt={activeStory.title} fill className="object-cover transition-transform duration-700"
                            priority={activeIndex===0} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#04050d] via-[#04050d]/30 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/25 to-transparent" />

                          {/* Scan line */}
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute inset-y-0 w-[28%]"
                              style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)",animation:"shimmer-scan 2.5s ease-in-out infinite"}} />
                          </div>

                          {/* Top badges */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <motion.div key={activeStory.category} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md"
                              style={{boxShadow:"0 0 14px rgba(34,211,238,0.14)"}}>
                              {activeStory.category}
                            </motion.div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/15 bg-black/50">
                              <span className="text-[10px] font-bold text-white/85 tabular-nums tracking-widest">
                                {String(activeIndex+1).padStart(2,"0")}/{String(stories.length).padStart(2,"0")}
                              </span>
                            </div>
                          </div>

                          {/* Bottom overlay content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="h-px w-full mb-4"
                              style={{background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.6),rgba(34,211,238,0.4),transparent)"}} />
                            <motion.h3 key={activeStory.title} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                              transition={{delay:0.15,duration:0.5}}
                              className="text-xl font-bold text-white leading-snug mb-2 line-clamp-2">
                              {activeStory.title}
                            </motion.h3>
                            <motion.p key={activeStory.excerpt} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                              transition={{delay:0.22,duration:0.45}}
                              className="text-xs text-white/45 line-clamp-2 leading-relaxed mb-4">
                              {activeStory.excerpt}
                            </motion.p>

                            {/* Author + CTA */}
                            <motion.div key={activeStory.authorName} initial={{opacity:0}} animate={{opacity:1}}
                              transition={{delay:0.3,duration:0.4}}
                              className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                                  style={{background:"linear-gradient(135deg,#6d28d9,#0ea5e9)",boxShadow:"0 0 12px rgba(109,40,217,0.5)"}}>
                                  {activeStory.authorName.slice(0,2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[11px] font-semibold text-white/90">{activeStory.authorName}</p>
                                  {activeStory.authorRole && <p className="text-[9px] text-white/38">{activeStory.authorRole}</p>}
                                </div>
                              </div>
                              <Link href={`/stories/${activeStory.slug}`}
                                className="group relative flex items-center gap-1.5 overflow-hidden px-4 py-2 rounded-full text-xs font-bold text-white"
                                style={{background:"linear-gradient(135deg,#7c3aed,#2563eb)",boxShadow:"0 4px 18px rgba(109,40,217,0.45)"}}>
                                <span className="pointer-events-none absolute inset-0 -translate-x-full [background:linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.38)_50%,transparent_62%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                                <span className="relative z-10">Read</span>
                                <ArrowRight className="relative z-10 w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* 3D floating bottom rail — sits visually in front at Z+20 */}
                      <div className="relative mt-2 h-[3px] w-full overflow-hidden rounded-full"
                        style={{transform:"translateZ(20px)"}}>
                        <div className="absolute inset-0"
                          style={{background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(34,211,238,0.5),rgba(96,165,250,0.4),transparent)"}} />
                        <div className="absolute inset-y-0 w-1/4"
                          style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)",animation:"shimmer-scan 2.2s ease-in-out infinite"}} />
                      </div>
                    </TiltCard>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Prev / Next nav */}
            <div className="flex items-center gap-6">
              <motion.button whileHover={{scale:1.08}} whileTap={{scale:0.92}} onClick={handlePrev}
                className="p-3 rounded-full border border-white/10 bg-white/5 text-white/55 hover:text-white hover:border-violet-400/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all duration-200">
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Dot rail */}
              <div className="flex items-center gap-2">
                {stories.map((_,idx) => (
                  <button key={idx} onClick={()=>goto(idx)}
                    className="transition-all duration-300 rounded-full cursor-pointer"
                    style={{
                      width: idx===activeIndex?32:6, height:6,
                      background: idx===activeIndex
                        ? "linear-gradient(90deg,#8b5cf6,#22d3ee)"
                        : idx<activeIndex ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.15)",
                      boxShadow: idx===activeIndex ? "0 0 12px rgba(139,92,246,0.65)" : "none",
                    }} />
                ))}
              </div>

              <motion.button whileHover={{scale:1.08}} whileTap={{scale:0.92}} onClick={handleNext}
                className="p-3 rounded-full border border-white/10 bg-white/5 text-white/55 hover:text-white hover:border-violet-400/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all duration-200">
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ════════════════════════════════════════════════════════════
     MOBILE — cinematic Z-axis swipe + deep tilt
  ════════════════════════════════════════════════════════════ */
  const swipeDir = prevIndex !== null && prevIndex < activeIndex ? 1 : -1;

const swipeVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    rotateY: dir * 28,
    z: -180,
    scale: 0.88,
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    z: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    rotateY: dir * -20,
    z: -100,
    scale: 0.93,
  }),
};

return (
    <section className="relative overflow-hidden bg-[#04050d] py-14 px-4">
      <style jsx>{`
        @keyframes border-spin { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes shimmer-scan { 0%{transform:translateX(-130%)} 100%{transform:translateX(380%)} }
        @keyframes particle-rise { 0%{transform:translateY(0) scale(1);opacity:0} 8%{opacity:1} 88%{opacity:.55} 100%{transform:translateY(-70vh) scale(.3);opacity:0} }
        @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.15);opacity:.12} }
      `}</style>

      {/* Background canvas */}
      <AuroraMesh />

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-cyan-500/8 blur-[90px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-600/8 blur-[90px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid-ws" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#a78bfa" strokeWidth="0.5" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid-ws)" />
        </svg>
      </div>

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(14)].map((_,i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width:"2px",height:"2px",
              left:`${4+(i*7.3)%92}%`, bottom:`${(i*10)%20}%`,
              background: i%2===0?"rgba(167,139,250,0.6)":"rgba(34,211,238,0.4)",
              animation:`particle-rise ${7+(i%5)*1.4}s ${(i*0.4)%5}s linear infinite`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto">

        {/* Header */}
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
          transition={{duration:0.7,ease:[0.16,1,0.3,1]}} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/28 bg-violet-500/8 mb-5"
            style={{boxShadow:"0 0 22px rgba(139,92,246,0.14)"}}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
            <span className="text-xs font-bold text-violet-300 uppercase tracking-[0.18em]">Weekly Spotlight</span>
          </div>
          <h2 className="text-[2.6rem] font-extrabold leading-[1.06] tracking-tight text-white mb-3">
            Featured{" "}
            <span style={{
              WebkitTextFillColor:"transparent",WebkitBackgroundClip:"text",
              backgroundImage:"linear-gradient(135deg,#a78bfa 0%,#22d3ee 50%,#60a5fa 100%)",
              filter:"drop-shadow(0 0 24px rgba(139,92,246,0.55))",
            }}>Stories</span>
          </h2>
          <p className="text-sm text-white/35 tracking-wide">
            {String(activeIndex+1).padStart(2,"0")} of {String(stories.length).padStart(2,"0")} curated journeys
          </p>
        </motion.div>

        {/* Card — cinematic Z swipe */}
        <div style={{perspective:"1400px", transformStyle:"preserve-3d"}}>
          <AnimatePresence mode="wait" custom={swipeDir}>
            <motion.div
              key={activeIndex}
              custom={swipeDir}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <TiltCard className="relative w-full">
                {/* Spinning border */}
                <div className="absolute -inset-[1.5px] rounded-[32px] -z-10"
                  style={{
                    background:"linear-gradient(90deg,#8b5cf6,#3b82f6,#22d3ee,#a78bfa,#8b5cf6)",
                    backgroundSize:"300% 100%", animation:"border-spin 4s linear infinite",
                    filter:"blur(1px)", opacity:0.68,
                  }} />
                {/* Pulse ring */}
                <div className="absolute -inset-3 rounded-[40px] border border-violet-400/18 pointer-events-none"
                  style={{animation:"pulse-ring 3s ease-in-out infinite"}} />
                <div className="absolute -inset-5 rounded-[44px] bg-violet-500/7 blur-2xl -z-20" />

                {/* Card shell */}
                <div className="relative rounded-[30px] overflow-hidden border border-white/[0.06]"
                  style={{
                    background:"linear-gradient(150deg,rgba(10,14,38,0.98),rgba(4,6,20,0.99))",
                    boxShadow:"0 30px 80px rgba(99,102,241,0.22), 0 0 0 1px rgba(167,139,250,0.10) inset",
                  }}>

                  <div className="relative w-full aspect-[3/4]">
                    <Image src={safeImageUrl(activeStory.coverImage,DEFAULT_IMAGES.storyCover)}
                      alt={activeStory.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04050d] via-[#04050d]/25 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-transparent" />

                    {/* Scan line */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-y-0 w-[28%]"
                        style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)",animation:"shimmer-scan 3s ease-in-out infinite"}} />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <motion.div key={activeStory.category} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md"
                        style={{boxShadow:"0 0 14px rgba(34,211,238,0.12)"}}>
                        {activeStory.category}
                      </motion.div>
                      <div className="px-3 py-1.5 rounded-full backdrop-blur-md border border-white/15 bg-black/50">
                        <span className="text-[10px] font-bold text-white/85 tabular-nums tracking-widest">
                          {String(activeIndex+1).padStart(2,"0")}/{String(stories.length).padStart(2,"0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div className="px-6 pt-4 pb-6">
                    <div className="h-px w-full mb-4"
                      style={{background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.55),rgba(34,211,238,0.35),transparent)"}} />
                    <motion.h3 key={activeStory.title} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                      transition={{delay:0.1,duration:0.45}}
                      className="text-xl font-bold text-white leading-snug mb-2 line-clamp-2">
                      {activeStory.title}
                    </motion.h3>
                    <motion.p key={activeStory.excerpt} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                      transition={{delay:0.18,duration:0.45}}
                      className="text-sm text-white/42 line-clamp-2 leading-relaxed mb-4">
                      {activeStory.excerpt}
                    </motion.p>
                    <motion.div key={activeStory.authorName} initial={{opacity:0}} animate={{opacity:1}}
                      transition={{delay:0.25,duration:0.4}}
                      className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{background:"linear-gradient(135deg,#6d28d9,#0ea5e9)",boxShadow:"0 0 12px rgba(109,40,217,0.45)"}}>
                          {activeStory.authorName.slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white/90">{activeStory.authorName}</p>
                          {activeStory.authorRole && <p className="text-[10px] text-white/36">{activeStory.authorRole}</p>}
                        </div>
                      </div>
                      <Link href={`/stories/${activeStory.slug}`}
                        className="group relative flex items-center gap-1.5 overflow-hidden px-4 py-2 rounded-full text-xs font-bold text-white"
                        style={{background:"linear-gradient(135deg,#7c3aed,#2563eb)",boxShadow:"0 4px 18px rgba(109,40,217,0.42)"}}>
                        <span className="pointer-events-none absolute inset-0 -translate-x-full [background:linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.38)_50%,transparent_62%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                        <span className="relative z-10">Read Story</span>
                        <ChevronRight className="relative z-10 w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* 3D bottom rail */}
                <div className="relative mt-2 h-[3px] w-full overflow-hidden rounded-full" style={{transform:"translateZ(20px)"}}>
                  <div className="absolute inset-0"
                    style={{background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.6),rgba(34,211,238,0.5),transparent)"}} />
                  <div className="absolute inset-y-0 w-1/4"
                    style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)",animation:"shimmer-scan 2.4s ease-in-out infinite"}} />
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
          transition={{delay:0.3,duration:0.6}} className="mt-8 flex items-center gap-4">
          <motion.button whileTap={{scale:0.88}} onClick={handlePrev}
            className="p-3 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-violet-400/35 hover:shadow-[0_0_18px_rgba(139,92,246,0.2)] transition-all duration-200">
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 flex items-center justify-center gap-2">
            {stories.map((_,idx) => (
              <button key={idx} onClick={()=>goto(idx)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: idx===activeIndex?30:6, height:6,
                  background: idx===activeIndex
                    ? "linear-gradient(90deg,#8b5cf6,#22d3ee)"
                    : "rgba(255,255,255,0.16)",
                  boxShadow: idx===activeIndex?"0 0 12px rgba(139,92,246,0.65)":"none",
                }} />
            ))}
          </div>

          <motion.button whileTap={{scale:0.88}} onClick={handleNext}
            className="p-3 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-violet-400/35 hover:shadow-[0_0_18px_rgba(139,92,246,0.2)] transition-all duration-200">
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <p className="text-center text-[10px] text-white/16 tracking-widest uppercase mt-5">
          Tilt to reveal depth · tap dots to jump
        </p>
      </div>
    </section>
  );
}