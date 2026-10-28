import { useState } from "react";
import { gramsFor, type Gram } from "@/data/villages";
import { Shell } from "@/components/Shell";
import { Legend, Stat } from "@/components/DistrictDetail";
import { bnNum } from "@/data/bn";

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
  const max = Math.max(1, ...grams.map((g) => g.trees));
  const planted = grams.filter((g) => g.trees > 0).length;
  const pick = (g: Gram) => g.trees > 0 && onSelectGram(g);
  const { ox, oy, side } = pathBounds(upazila.d);
  const u = side / 100;

  return (
    <Shell onBack={onBack} backLabel={`${district} জেলা`}>
      <div className="mx-auto grid h-full max-w-6xl grid-rows-[minmax(0,1fr)_auto] gap-3 px-4 pb-2 sm:px-8 lg:grid-cols-2 lg:grid-rows-1 lg:gap-10">
        <section className="flex min-h-0 flex-col animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">{district} জেলা</p>
              <h1 className="truncate font-display text-2xl sm:text-3xl">{upazila.name} উপজেলা</h1>
            </div>
            <Legend />
          </div>
          <svg viewBox={`${ox} ${oy} ${side} ${side}`} className="mt-2 min-h-0 w-full flex-1" role="img" aria-label={`${upazila.name} উপজেলার মানচিত্র`}>
            <path d={upazila.d} strokeWidth={1.5 * u} className="fill-highlight/85 stroke-background" />
            {grams.map((g) => {
              const on = g.trees > 0;
              const px = ox + g.x * u, py = oy + g.y * u;
              const r = (active === g.name ? 2.2 : 1.5) * u;
              return (
                <g key={g.name} className={on ? "cursor-pointer" : ""} onMouseEnter={() => setActive(g.name)} onMouseLeave={() => setActive(null)} onClick={() => pick(g)}>
                  <circle cx={px} cy={py} r={r} className={`${on ? "fill-primary" : "fill-map"} stroke-background transition-all`} strokeWidth={0.4 * u} />
                  <text x={px + 3 * u} y={py + 1.1 * u} className="pointer-events-none fill-primary-foreground font-semibold" style={{ fontSize: 3.2 * u }}>
                    {g.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        <section className="flex min-h-0 flex-col lg:justify-center animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="মোট গাছ" value={bnNum(upazila.trees)} />
            <Stat label="রোপিত গ্রাম" value={`${bnNum(planted)}/${bnNum(grams.length)}`} />
            <Stat label="বাকি গ্রাম" value={bnNum(grams.length - planted)} />
          </div>
          <ul className="mt-3 rounded-2xl bg-card p-1.5 shadow-soft">
            {grams.map((g) => {
              const on = g.trees > 0;
              return (
                <li
                  key={g.name}
                  onMouseEnter={() => setActive(g.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => pick(g)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${on ? "cursor-pointer" : ""} ${
                    active === g.name ? "bg-secondary" : "hover:bg-secondary/50"
                  }`}
                >
                  <i className={`h-2 w-2 shrink-0 rounded-full ${on ? "bg-primary" : "bg-map-hover"}`} />
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-[13px] font-semibold ${on ? "" : "text-muted-foreground"}`}>{g.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground">{on ? `${g.date} · ${g.time}` : "পরিকল্পিত এলাকা"}</div>
                  </div>
                  {on ? (
                    <>
                      <span className="hidden h-1 w-14 shrink-0 overflow-hidden rounded-full bg-map sm:block">
                        <span className="block h-full rounded-full bg-primary/70" style={{ width: `${(g.trees / max) * 100}%` }} />
                      </span>
                      <span className="w-14 shrink-0 text-right text-[13px] font-semibold tabular-nums text-primary">{bnNum(g.trees)}</span>
                      <span className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary">→</span>
                    </>
                  ) : (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">এখনো রোপণ হয়নি</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
