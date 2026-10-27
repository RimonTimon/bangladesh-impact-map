import { useState } from "react";
import { gramsFor, type Gram } from "@/data/villages";

export type UpazilaShape = { name: string; d: string; cx: number; cy: number; trees: number };

// Bounding box of an SVG path made of absolute M/L/Z commands.
export function pathBounds(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX || 1, h = maxY - minY || 1;
  const pad = Math.max(w, h) * 0.08;
  const side = Math.max(w, h) + pad * 2;
  return { ox: minX - (side - w) / 2, oy: minY - (side - h) / 2, side };
}

export function UpazilaMap({
  upazila,
  grams,
  active,
  onHover,
  onPick,
}: {
  upazila: UpazilaShape;
  grams: Gram[];
  active: string | null;
  onHover: (name: string | null) => void;
  onPick: (gram: Gram) => void;
}) {
  const { ox, oy, side } = pathBounds(upazila.d);
  const u = side / 100; // 1 percent of the normalized box in path units
  const dotR = side * 0.014;
  const fontSize = side * 0.032;
  return (
    <svg
      viewBox={`${ox} ${oy} ${side} ${side}`}
      className="w-full max-h-[70vh]"
      role="img"
      aria-label={`Map of ${upazila.name} upazila`}
    >
      <path d={upazila.d} strokeWidth={1.5 * u} className="fill-highlight stroke-background" />
      {grams.map((g) => {
        const px = ox + g.x * u;
        const py = oy + g.y * u;
        const isActive = active === g.name;
        return (
          <g
            key={g.name}
            className="cursor-pointer"
            onMouseEnter={() => onHover(g.name)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onPick(g)}
          >
            <circle
              cx={px}
              cy={py}
              r={isActive ? dotR * 1.5 : dotR}
              className="fill-primary stroke-background"
              strokeWidth={side * 0.004}
            />
            <text
              x={px + dotR * 2}
              y={py + fontSize * 0.35}
              className="pointer-events-none fill-foreground font-semibold"
              style={{ fontSize }}
            >
              {g.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function UpazilaDetail({
  district,
  upazila,
  onBack,
  onSelectGram,
}: {
  district: string;
  upazila: UpazilaShape;
  onBack: () => void;
  onSelectGram: (gram: Gram) => void;
}) {
  const grams = gramsFor(upazila.name, upazila.trees);
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...grams.map((g) => g.trees));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <button
          onClick={onBack}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          ← Back to {district} map
        </button>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{district}</p>
            <h1 className="mt-2 font-display text-5xl">{upazila.name}</h1>
            <p className="mt-2 text-muted-foreground">
              <span className="font-display text-2xl text-primary">{upazila.trees.toLocaleString()}</span> trees planted
              across {grams.length} grams
            </p>
            <UpazilaMap upazila={upazila} grams={grams} active={active} onHover={setActive} onPick={onSelectGram} />
          </section>

          <section className="animate-in fade-in slide-in-from-right-4 duration-700">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Gram · Trees planted
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {grams.map((g) => (
                <li
                  key={g.name}
                  onMouseEnter={() => setActive(g.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => onSelectGram(g)}
                  className={`cursor-pointer rounded-lg px-3 py-4 transition-colors ${active === g.name ? "bg-secondary" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold">{g.name}</span>
                    <span className="font-display text-xl text-primary">🌳 {g.trees.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-map">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(g.trees / max) * 100}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Planted on {g.date} · {g.time}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
