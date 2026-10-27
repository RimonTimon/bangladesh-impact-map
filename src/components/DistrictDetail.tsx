import { useState } from "react";
import data from "@/data/upazilas.json";

export type Upazila = { name: string; d: string; cx: number; cy: number; trees: number };
const all = data as Record<string, { w: number; h: number; upazilas: Upazila[] }>;

export function DistrictDetail({
  name,
  onBack,
  onSelectUpazila,
}: {
  name: string;
  onBack: () => void;
  onSelectUpazila: (u: Upazila) => void;
}) {
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
            <h1 className="font-display text-4xl">{name}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              <span className="font-semibold tabular-nums text-primary">{total.toLocaleString()}</span> trees planted
              across {district.upazilas.length} upazilas
            </p>
            <svg
              viewBox={`0 0 ${district.w} ${district.h}`}
              className="mt-6 w-full max-h-[75vh]"
              role="img"
              aria-label={`Map of ${name}`}
            >
              {district.upazilas.map((u) => (
                <path
                  key={u.name}
                  d={u.d}
                  onMouseEnter={() => setActive(u.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => onSelectUpazila(u)}
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
            <div className="flex items-baseline justify-between gap-4 px-1">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Upazila
              </h2>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Trees planted
              </span>
            </div>
            <ul className="mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {district.upazilas.map((u, i) => (
                <li
                  key={u.name}
                  onMouseEnter={() => setActive(u.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => onSelectUpazila(u)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors ${
                    i > 0 ? "border-t border-border" : ""
                  } ${active === u.name ? "bg-secondary" : "hover:bg-secondary/50"}`}
                >
                  <span className="w-4 shrink-0 text-[10px] tabular-nums text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-[13px] font-medium ${
                      active === u.name ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {u.name}
                  </span>
                  <span className="hidden h-[3px] w-16 shrink-0 overflow-hidden rounded-full bg-map sm:block">
                    <span
                      className="block h-full rounded-full bg-primary/70"
                      style={{ width: `${(u.trees / max) * 100}%` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right text-[13px] font-semibold tabular-nums">
                    {u.trees.toLocaleString()}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 border-t border-border bg-secondary/40 px-4 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Total
                </span>
                <span className="text-[13px] font-semibold tabular-nums text-primary">{total.toLocaleString()}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
