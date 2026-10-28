import { useState } from "react";
import data from "@/data/upazilas.json";
import { Shell } from "@/components/Shell";
import { bnNum, DISTRICT_BN } from "@/data/bn";

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
  const bn = DISTRICT_BN[name] ?? name;
  const total = district.upazilas.reduce((s, u) => s + u.trees, 0);
  const max = Math.max(1, ...district.upazilas.map((u) => u.trees));
  const planted = district.upazilas.filter((u) => u.trees > 0).length;
  const pick = (u: Upazila) => u.trees > 0 && onSelectUpazila(u);

  return (
    <Shell onBack={onBack} backLabel="বাংলাদেশের মানচিত্র">
      <div className="mx-auto grid h-full max-w-6xl grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 px-4 pb-2 sm:px-8 lg:grid-cols-2 lg:grid-rows-1 lg:gap-10">
        <section className="flex min-h-0 flex-col animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="font-display text-2xl sm:text-3xl">{bn} জেলা</h1>
            <Legend />
          </div>
          <svg viewBox={`0 0 ${district.w} ${district.h}`} className="mt-2 min-h-0 w-full flex-1" role="img" aria-label={`${bn} জেলার মানচিত্র`}>
            {district.upazilas.map((u) => {
              const on = u.trees > 0;
              return (
                <path
                  key={u.name}
                  d={u.d}
                  onMouseEnter={() => setActive(u.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => pick(u)}
                  strokeWidth={1.5}
                  className={`stroke-background transition-colors duration-300 ${
                    on
                      ? `cursor-pointer ${active === u.name ? "fill-highlight-strong" : "fill-highlight"}`
                      : active === u.name ? "fill-map-hover" : "fill-map"
                  }`}
                >
                  <title>{u.name}</title>
                </path>
              );
            })}
            {district.upazilas.map((u) => (
              <text
                key={u.name}
                x={u.cx}
                y={u.cy}
                textAnchor="middle"
                className={`pointer-events-none text-[11px] font-semibold ${u.trees > 0 ? "fill-primary-foreground" : "fill-muted-foreground"}`}
              >
                {u.name}
              </text>
            ))}
          </svg>
        </section>

        <section className="flex min-h-0 flex-col lg:justify-center animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="grid shrink-0 grid-cols-3 gap-2">
            <Stat label="মোট গাছ" value={bnNum(total)} />
            <Stat label="রোপিত উপজেলা" value={`${bnNum(planted)}/${bnNum(district.upazilas.length)}`} />
            <Stat label="বাকি" value={bnNum(district.upazilas.length - planted)} />
          </div>
          <ul className="mt-3 min-h-0 overflow-y-auto rounded-2xl bg-card p-1.5 shadow-soft">
            {district.upazilas.map((u) => {
              const on = u.trees > 0;
              return (
                <li
                  key={u.name}
                  onMouseEnter={() => setActive(u.name)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => pick(u)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-1.5 transition-colors ${on ? "cursor-pointer" : ""} ${
                    active === u.name ? "bg-secondary" : "hover:bg-secondary/50"
                  }`}
                >
                  <i className={`h-2 w-2 shrink-0 rounded-full ${on ? "bg-highlight" : "bg-map-hover"}`} />
                  <span className={`min-w-0 flex-1 truncate text-[13px] font-medium ${on ? "" : "text-muted-foreground"}`}>{u.name}</span>
                  {on ? (
                    <>
                      <span className="hidden h-1 w-16 shrink-0 overflow-hidden rounded-full bg-map sm:block">
                        <span className="block h-full rounded-full bg-primary/70" style={{ width: `${(u.trees / max) * 100}%` }} />
                      </span>
                      <span className="w-16 shrink-0 text-right text-[13px] font-semibold tabular-nums">{bnNum(u.trees)}</span>
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

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-3 py-2 shadow-soft">
      <div className="truncate font-display text-base text-primary sm:text-lg">{value}</div>
      <div className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{label}</div>
    </div>
  );
}

export function Legend() {
  return (
    <div className="flex shrink-0 items-center gap-3 text-[10px] text-muted-foreground sm:text-[11px]">
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-highlight" /> রোপিত</span>
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-map-hover" /> রোপণ বাকি</span>
    </div>
  );
}
