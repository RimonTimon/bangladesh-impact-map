import { useState } from "react";
import data from "@/data/upazilas.json";

type Upazila = { name: string; d: string; cx: number; cy: number; trees: number };
const all = data as Record<string, { w: number; h: number; upazilas: Upazila[] }>;

export function DistrictDetail({ name, onBack }: { name: string; onBack: () => void }) {
  const district = all[name];
  const [active, setActive] = useState<string | null>(null);
  if (!district) return null;
  const total = district.upazilas.reduce((s, u) => s + u.trees, 0);
  const max = Math.max(...district.upazilas.map((u) => u.trees));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <button
          onClick={onBack}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          ← Back to Bangladesh map
        </button>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <h1 className="font-display text-5xl">{name}</h1>
            <p className="mt-2 text-muted-foreground">
              <span className="font-display text-2xl text-primary">{total.toLocaleString()}</span> trees planted across{" "}
              {district.upazilas.length} upazilas
            </p>
            <svg viewBox={`0 0 ${district.w} ${district.h}`} className="mt-6 w-full max-h-[75vh]" role="img" aria-label={`Map of ${name}`}>
              {district.upazilas.map((u) => (
                <path
                  key={u.name}
                  d={u.d}
                  onMouseEnter={() => setActive(u.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(u.name)}
                  strokeWidth={1.5}
                  className={`cursor-pointer stroke-background transition-colors duration-300 ${
                    active === u.name ? "fill-highlight-strong" : "fill-highlight hover:fill-highlight-strong"
                  }`}
                >
                  <title>{u.name}</title>
                </path>
              ))}
              {district.upazilas.map((u) => (
                <text
                  key={u.name}
                  x={u.cx}
                  y={u.cy}
                  textAnchor="middle"
                  className="pointer-events-none fill-primary-foreground text-[11px] font-semibold"
                >
                  {u.name}
                </text>
              ))}
            </svg>
          </section>

          <section className="animate-in fade-in slide-in-from-right-4 duration-700">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Upazila · Trees planted
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {district.upazilas.map((u) => (
                <li
                  key={u.name}
                  onMouseEnter={() => setActive(u.name)}
                  onMouseLeave={() => setActive(null)}
                  className={`rounded-lg px-3 py-4 transition-colors ${active === u.name ? "bg-secondary" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold">{u.name}</span>
                    <span className="font-display text-xl text-primary">🌳 {u.trees.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-map">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(u.trees / max) * 100}%` }} />
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
