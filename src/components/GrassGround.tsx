"use client";
import { motion, useTransform, useReducedMotion, type MotionValue } from "motion/react";

// Deterministic pseudo-random in [0,1) from an integer seed, so the layout is
// identical on server and client (no hydration mismatch).
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Fixed 2-decimal format. Math.sin differs in the last FP digits between the
// Node SSR runtime and the browser, so coordinates MUST be rounded to a stable
// string or the SVG paths won't match on hydration.
const f = (n: number) => n.toFixed(2);

const W = 1200;
const H = 330;
const GROUND = 140; // soil line: blades root here and grow up, roots grow down
const BLADES = 60;
const ROOTS = 20;
const LIP = GROUND + 16; // depth of the darker front dirt lip

// Soil surface: gentle upward-only mounds, shared by the back soil and the
// front lip so the two line up exactly.
const SOIL_TOP =
  `M0 ${GROUND} ` +
  `Q ${f(W * 0.12)} ${GROUND - 9} ${f(W * 0.25)} ${GROUND} ` +
  `Q ${f(W * 0.37)} ${GROUND - 6} ${f(W * 0.5)} ${GROUND} ` +
  `Q ${f(W * 0.62)} ${GROUND - 10} ${f(W * 0.75)} ${GROUND} ` +
  `Q ${f(W * 0.87)} ${GROUND - 6} ${W} ${GROUND}`;

type Blade = { i: number; d: string; fill: string; tipY: number; h: number; start: number; end: number; delay: string };

const blades: Blade[] = Array.from({ length: BLADES }, (_, i) => {
  const r1 = rand(i);
  const r2 = rand(i + 91);
  const r3 = rand(i + 197);
  const x = ((i + 0.5) / BLADES) * W + (r1 - 0.5) * 12;
  const h = 46 + r1 * 74; // max < GROUND so tips stay inside the band
  const lean = (r2 - 0.5) * h * 0.9; // strong bend, proportional to height
  const w = 11 + r3 * 9; // fatter base reads as a leaf, not a spike
  const tipY = GROUND - h;
  const fill = r1 > 0.62 ? "var(--color-grass-light)" : r1 < 0.32 ? "var(--color-grass-dark)" : "var(--color-grass)";
  const start = r3 * 0.2;
  const end = Math.min(start + 0.35, 0.5); // grass mostly grown by mid-scroll
  // Curved leaf: both edges arc toward the lean direction so the blade bends.
  const d =
    `M ${f(x - w)} ${GROUND} ` +
    `C ${f(x - w + lean * 0.5)} ${f(GROUND - h * 0.4)} ${f(x + lean - w * 0.5)} ${f(GROUND - h * 0.82)} ${f(x + lean)} ${f(tipY)} ` +
    `C ${f(x + lean + w * 0.3)} ${f(GROUND - h * 0.7)} ${f(x + w + lean * 0.5)} ${f(GROUND - h * 0.35)} ${f(x + w)} ${GROUND} Z`;
  return { i, d, fill, tipY, h, start, end, delay: (r2 * 1.8).toFixed(2) };
});

// Static soil texture: small spec stones scattered below the front lip so the
// dirt reads as dirt, not a flat fill. Deterministic + f()ed so SSR and client
// render identical strings.
const STONE_FILLS = ["var(--color-rock)", "var(--color-rock-light)", "var(--color-soil-dark)"];
type Speck = { x: string; y: string; r: string; fill: string };
const SPECKS: Speck[] = Array.from({ length: 46 }, (_, i) => ({
  x: f(rand(i + 300) * W),
  y: f(LIP + 8 + rand(i + 360) * (H - LIP - 16)),
  r: f(1 + rand(i + 410) * 2),
  fill: STONE_FILLS[Math.floor(rand(i + 450) * STONE_FILLS.length)],
}));

type Root = { j: number; main: string; branch1: string; branch2: string; start: number; end: number };

// Open centerline paths defined top (surface) -> down, so animating pathLength
// 0 -> 1 draws the tip reaching downward (a real "growing" feel, not a stretch).
const roots: Root[] = Array.from({ length: ROOTS }, (_, j) => {
  const rx = ((j + 0.5) / ROOTS) * W + (rand(j + 11) - 0.5) * 26;
  const rlen = 90 + rand(j + 33) * 120;
  const sway = (rand(j + 57) - 0.5) * 74;
  const tipX = rx + sway;
  const tipY = GROUND + rlen;
  const main = `M ${f(rx)} ${GROUND} C ${f(rx + sway * 0.25)} ${f(GROUND + rlen * 0.35)} ${f(tipX - 3)} ${f(GROUND + rlen * 0.72)} ${f(tipX)} ${f(tipY)}`;
  const b1x = rx + sway * 0.3;
  const b1y = GROUND + rlen * 0.4;
  const branch1 = `M ${f(b1x)} ${f(b1y)} C ${f(b1x - 14)} ${f(b1y + 14)} ${f(b1x - 22)} ${f(b1y + 30)} ${f(b1x - 26)} ${f(b1y + 48)}`;
  const b2x = rx + sway * 0.55;
  const b2y = GROUND + rlen * 0.6;
  const branch2 = `M ${f(b2x)} ${f(b2y)} C ${f(b2x + 14)} ${f(b2y + 12)} ${f(b2x + 22)} ${f(b2y + 28)} ${f(b2x + 26)} ${f(b2y + 44)}`;
  const start = 0.34 + rand(j + 71) * 0.26;
  const end = Math.min(start + 0.46, 1);
  return { j, main, branch1, branch2, start, end };
});

function GrassBlade({ b, progress, grown }: { b: Blade; progress: MotionValue<number>; grown: boolean }) {
  // Grow by revealing the (undistorted) blade through a rectangular clip window
  // that scales up from the soil line — the mirror of how roots draw downward.
  // The blade path never scales, so its curve keeps its shape the whole way up.
  const reveal = useTransform(progress, [b.start, b.end], [0, 1], { clamp: true });
  const clipId = `blade-${b.i}`;
  return (
    <g className="grass-blade" style={{ "--sway-delay": `${b.delay}s` } as React.CSSProperties}>
      <clipPath id={clipId}>
        <motion.rect
          x={0}
          y={f(b.tipY)}
          width={W}
          height={f(b.h)}
          style={{ scaleY: grown ? 1 : reveal, transformBox: "fill-box", transformOrigin: "bottom center" }}
        />
      </clipPath>
      <path d={b.d} fill={b.fill} clipPath={`url(#${clipId})`} />
    </g>
  );
}

function RootStrand({ r, progress, grown }: { r: Root; progress: MotionValue<number>; grown: boolean }) {
  const span = r.end - r.start;
  // The taproot draws first; the branches sprout a little later, so the root
  // reaches down and then puts out tendrils.
  const mainPL = useTransform(progress, [r.start, r.start + span * 0.6], [0, 1], { clamp: true });
  const b1PL = useTransform(progress, [r.start + span * 0.4, r.start + span * 0.85], [0, 1], { clamp: true });
  const b2PL = useTransform(progress, [r.start + span * 0.55, r.end], [0, 1], { clamp: true });
  return (
    <g fill="none" stroke="var(--color-root)" strokeLinecap="butt">
      <motion.path d={r.main} strokeWidth={5} style={{ pathLength: grown ? 1 : mainPL }} />
      <motion.path d={r.branch1} strokeWidth={3} style={{ pathLength: grown ? 1 : b1PL }} />
      <motion.path d={r.branch2} strokeWidth={3} style={{ pathLength: grown ? 1 : b2PL }} />
    </g>
  );
}

// Cartoon gopher peeking up at the soil line, centered on `cx`. Drawn in user
// units; paws sit on GROUND, head above. Pops up via translateY as you scroll.
function Gopher({ cx, progress, grown }: { cx: number; progress: MotionValue<number>; grown: boolean }) {
  const y = useTransform(progress, [0.16, 0.32], [150, 0], { clamp: true });
  return (
    <motion.g style={{ y: grown ? 0 : y }}>
      {/* paws gripping the soil line */}
      <ellipse cx={cx - 40} cy={GROUND - 4} rx={17} ry={10} fill="var(--color-gopher)" />
      <ellipse cx={cx + 40} cy={GROUND - 4} rx={17} ry={10} fill="var(--color-gopher)" />
      {/* ears */}
      <circle cx={cx - 40} cy={GROUND - 124} r={16} fill="var(--color-gopher)" />
      <circle cx={cx + 40} cy={GROUND - 124} r={16} fill="var(--color-gopher)" />
      <circle cx={cx - 40} cy={GROUND - 124} r={8} fill="var(--color-gopher-dark)" />
      <circle cx={cx + 40} cy={GROUND - 124} r={8} fill="var(--color-gopher-dark)" />
      {/* head / body blob */}
      <ellipse cx={cx} cy={GROUND - 68} rx={60} ry={72} fill="var(--color-gopher)" />
      {/* muzzle / belly highlight */}
      <ellipse cx={cx} cy={GROUND - 44} rx={38} ry={40} fill="var(--color-gopher-light)" />
      {/* eyes */}
      <circle cx={cx - 23} cy={GROUND - 84} r={9.5} fill="#FFFFFF" />
      <circle cx={cx + 23} cy={GROUND - 84} r={9.5} fill="#FFFFFF" />
      <circle cx={cx - 21} cy={GROUND - 83} r={4.6} fill="var(--color-gopher-dark)" />
      <circle cx={cx + 25} cy={GROUND - 83} r={4.6} fill="var(--color-gopher-dark)" />
      {/* nose */}
      <ellipse cx={cx} cy={GROUND - 58} rx={9} ry={6.5} fill="var(--color-gopher-dark)" />
      {/* two buck teeth (the 2px gap between them shows the muzzle as a divider) */}
      <rect x={cx - 9} y={GROUND - 53} width={8} height={18} rx={2} fill="#FFFFFF" />
      <rect x={cx + 1} y={GROUND - 53} width={8} height={18} rx={2} fill="#FFFFFF" />
    </motion.g>
  );
}

/** Cartoon grass that grows from bare dirt as `progress` (a scroll MotionValue)
 *  goes 0 -> 1: blades sprout up first, then a gopher peeks and roots reach down.
 *  Reduced motion shows the full grown scene. */
export function GrassGround({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const grown = !!reduce;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[36vh] max-h-[330px] min-h-[230px] w-full">
        <defs>
          {/* clip the gopher to above the soil line so it hides in its hole */}
          <clipPath id="gopher-clip">
            <rect x={0} y={-H} width={W} height={GROUND + H} />
          </clipPath>
        </defs>
        {/* soil: mounded top that never dips below the ground line */}
        <path d={`${SOIL_TOP} L ${W} ${H} L 0 ${H} Z`} fill="var(--color-soil)" />
        {/* soil texture: small spec stones */}
        {SPECKS.map((s, i) => (
          <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.r} fill={s.fill} />
        ))}
        {/* roots draw downward into the soil */}
        {roots.map((r) => (
          <RootStrand key={r.j} r={r} progress={progress} grown={grown} />
        ))}
        {/* blades */}
        {blades.map((b) => (
          <GrassBlade key={b.i} b={b} progress={progress} grown={grown} />
        ))}
        {/* darker front dirt lip: grass blades and roots sprout from behind it */}
        <path d={`${SOIL_TOP} L ${W} ${LIP} L 0 ${LIP} Z`} fill="var(--color-soil-dark)" />
        {/* gopher pops up in front of the grass, clipped to the soil line */}
        <g clipPath="url(#gopher-clip)">
          <Gopher cx={W * 0.64} progress={progress} grown={grown} />
        </g>
      </svg>
    </div>
  );
}
