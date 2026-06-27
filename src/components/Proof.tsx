import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { content } from "@/lib/content";

export function Proof() {
  return (
    <Section id="proof" className="border-t border-hairline">
      <Reveal>
        <h2 className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          Quiet ground, happy growers.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3">
        {content.testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <figure className="flex h-full flex-col justify-between bg-bg p-7">
              <blockquote className="line-clamp-3 leading-relaxed text-ink">{t.quote}</blockquote>
              <figcaption className="mt-6 text-sm text-muted">
                {t.name}, {t.role}
                <br />
                {t.estate}, {t.region}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
