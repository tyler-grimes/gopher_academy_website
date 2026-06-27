import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { content } from "@/lib/content";

// TODO: confirm real pricing
const tiers = [
  { name: "Single visit", price: "From $450", note: "One property, one survey and treatment, follow-up included.", featured: false },
  { name: "Season program", price: "From $1,800", note: "Scheduled visits through the growing season with our return guarantee.", featured: true },
  { name: "Estate", price: "Custom", note: "Multi-block and multi-property vineyards. Built around your acreage and calendar.", featured: false },
];

export function Pricing() {
  return (
    <Section id="pricing" className="border-t border-hairline">
      <Reveal>
        <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          What it costs to sleep at night.
        </h2>
        <p className="mt-4 max-w-[55ch] text-muted">Pricing scales with acreage and activity. Figures below are starting points; every estate gets a real number after we walk it.</p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className={`flex h-full flex-col rounded-xl border p-7 ${t.featured ? "border-accent bg-surface shadow-[0_18px_60px_rgba(28,31,29,0.06)]" : "border-hairline"}`}>
              <p className="text-sm font-medium text-muted">{t.name}</p>
              <p className="mt-3 font-mono text-3xl text-ink">{t.price}</p>
              <p className="mt-4 flex-1 leading-relaxed text-muted">{t.note}</p>
              <a href={content.cta.href} className={`mt-7 rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors ${t.featured ? "bg-accent text-on-accent hover:bg-accent-hover" : "border border-hairline text-ink hover:border-ink"}`}>
                {content.cta.label}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
