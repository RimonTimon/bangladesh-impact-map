import { useState } from "react";
import { gramsFor, type Gram } from "@/data/villages";

type UpazilaShape = { name: string; d: string; cx: number; cy: number; trees: number };

// Compute a normalized 0..100 viewBox for a single upazila path so it fills its mini-map.
function useUpazilaViewBox(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX || 1, h = maxY - minY || 1;
  const pad = Math.max(w, h) * 0.06;
  const side = Math.max(w, h) + pad * 2;
  const ox = minX - (side - w) / 2;
  const oy = minY - (side - h) / 2;
  return { viewBox: `${ox} ${oy} ${side} ${side}`, scale: 100 / side, ox, oy };
}

export function UpazilaMap({
  upazila,
  grams,
  active,
  onSelect,
}: {
  upazila: UpazilaShape;
  grams: Gram[];
  active: string | null;
  onSelect: (name: string | null) => void;
}) {
  const { viewBox, scale, ox, oy } = useUpazilaViewBox(upazila.d);
  return (
    <svg viewBox={viewBox} className="w-full max-h-[70vh]" role="img" aria-label={`Map of ${upazila.name} upazila`}>
      <path d={upazila.d} strokeWidth={1.5 * (1 / scale)} className="fill-highlight stroke-background" />
      {grams.map((g) => {
        const cx = ox + (g.x / 100) * (100 / scale) * scale; // placeholder, replaced below
        return null;
      })}
      {grams.map((g) => {
        // gram x/y are percents of the normalized 0..100 box; map back into path coords
        const minX = ox, side = 100 / scale;
        const px = minX + (g.x / 100) * side;
        const py = oy + (g.y / 100) * side;
        const isActive = active === g.name;
        return (
          <g
            key={g.name}
            className="cursor-pointer"
            onMouseEnter={() => onSelect(g.name)}
            onMouseLeave={() => onSelect(null)}
            onClick={() => onSelect(g.name)}
          >
            <circle cx={px} cy={py} r={isActive ? 5 / scale : 3.5 / scale} className="fill-primary stroke-background" strokeWidth={1 / scale} />
            <text
              x={px + 6 / scale}
              y={py + 3 / scale}
              className="pointer-events-none fill-foreground font-semibold"
              style={{ fontSize: 11 / scale }}
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
            <UpazilaMap upazila={upazila} grams={grams} active={active} onSelect={(n) => {
              setActive(n);
              const g = grams.find((x) => x.name === n);
              if (n && g) onSelectGram(g);
            }} />
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
