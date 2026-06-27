"use client";
import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "motion/react";
import { content } from "@/lib/content";
import { GrassGround } from "./GrassGround";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const rise = (delay: number) =>
    reduce
      ? { initial: false }
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden px-6 pt-16 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <motion.p {...rise(0)} className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Sonoma County gopher control
          </motion.p>
          <motion.h1 {...rise(0.08)} className="text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-6xl">
            We teach gophers a lesson.
          </motion.h1>
          <motion.p {...rise(0.16)} className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
            Mechanical trapping that clears pocket gophers out of your lawn, garden, and yard. No poison, no bait, no gas,
            so it stays safe around your pets, your kids, and everything you grow.
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-4">
            <a href={content.cta.href} className="rounded-full bg-accent px-7 py-3 font-medium text-on-accent transition-colors hover:bg-accent-hover active:scale-[0.98]">
              {content.cta.label}
            </a>
            <a href="#methods" className="rounded-full border border-hairline px-7 py-3 font-medium text-ink transition-colors hover:border-ink">
              See how it works
            </a>
          </motion.div>
        </div>
      </div>
      <GrassGround progress={scrollYProgress} />
    </section>
  );
}
