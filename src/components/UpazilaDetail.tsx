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
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Gram · Trees planted
              </h2>
              <span className="text-xs text-muted-foreground">{grams.length} grams</span>
            </div>
            <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {grams.map((g, i) => (
                <li
                  key={g.name}
                  onMouseEnter={() => setActive(g.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => onSelectGram(g)}
                  className={`group cursor-pointer px-5 py-3.5 transition-colors ${
                    i > 0 ? "border-t border-border" : ""
                  } ${active === g.name ? "bg-secondary" : "hover:bg-secondary/60"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 shrink-0 text-center font-display text-sm text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-sm font-semibold">{g.name}</span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-primary">
                          {g.trees.toLocaleString()}
                          <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            trees
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-map">
                          <div
                            className="h-full rounded-full bg-primary/80 transition-all"
                            style={{ width: `${(g.trees / max) * 100}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                          {g.date} · {g.time}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary">
                      →
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
