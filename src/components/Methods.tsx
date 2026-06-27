import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { MagnifyingGlass, Path, CheckCircle } from "@phosphor-icons/react/dist/ssr";

const steps = [
  { icon: MagnifyingGlass, title: "Walk the rows", body: "We survey the whole property by hand, map active runs block by block, and read the damage before we touch anything." },
  { icon: Path, title: "Target the runs", body: "Precise, below-ground control placed directly in active tunnels. No broadcast bait, nothing that drifts toward fruit or soil life." },
  { icon: CheckCircle, title: "Verify quiet", body: "We come back, re-walk the blocks, and confirm the activity is actually gone before we call it done." },
];

export function Methods() {
  return (
    <Section id="methods" eyebrow="How we work" className="border-t border-hairline">
      <Reveal>
        <h2 className="max-w-[18ch] text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
          How we work a property.
        </h2>
      </Reveal>
      <div className="mt-14 flex flex-col">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="flex gap-6 border-t border-hairline py-8">
              <s.icon size={28} weight="light" className="mt-1 shrink-0 text-accent" />
              <div>
                <h3 className="text-xl font-medium text-ink">{s.title}</h3>
                <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
