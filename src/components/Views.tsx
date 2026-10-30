import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Shell, type Crumb } from "@/components/Shell";
import { bnNum, DISTRICTS, pathBounds, recordDetails, type Area, type Unit } from "@/data/areas";
import p1 from "@/assets/plantation-1.jpg";
import p2 from "@/assets/plantation-2.jpg";
import p3 from "@/assets/plantation-3.jpg";
import p4 from "@/assets/plantation-4.jpg";
import p5 from "@/assets/plantation-5.jpg";
import p6 from "@/assets/plantation-6.jpg";
import video from "@/assets/plantation-video.mp4.asset.json";

const PHOTOS = [p1, p2, p3, p4, p5, p6];
const grid = "mx-auto grid h-full max-w-6xl gap-3 px-4 pb-2 sm:px-8 lg:grid-cols-2 lg:grid-rows-1 lg:gap-10";

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-3 py-2 shadow-soft">
      <div className="truncate font-num text-base font-bold text-primary sm:text-lg">{value}</div>
      <div className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{label}</div>
    </div>
  );
}

export function Legend({ city }: { city?: boolean }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground sm:text-[11px]">
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-highlight" /> রোপিত</span>
      {city && <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-city" /> সিটি কর্পোরেশন</span>}
      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-map-hover" /> রোপণ বাকি</span>
    </div>
  );
}

function Row({ name, sub, trees, max, active, onHover, onClick, tag }: {
  name: string; sub?: string | undefined; trees: number; max: number; active: boolean; tag?: string | undefined;
  onHover: (on: boolean) => void; onClick: () => void;
}) {
  const on = trees > 0;
  return (
    <li
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={() => on && onClick()}
      className={`group flex items-center gap-3 rounded-xl px-3 py-1.5 transition-colors ${on ? "cursor-pointer" : ""} ${active ? "bg-secondary" : "hover:bg-secondary/50"}`}
    >
      <i className={`h-2 w-2 shrink-0 rounded-full ${on ? (tag ? "bg-city" : "bg-highlight") : "bg-map-hover"}`} />
      <div className="min-w-0 flex-1">
        <div className={`truncate text-[13px] font-semibold ${on ? "" : "text-muted-foreground"}`}>{name}</div>
        {sub && <div className="truncate text-[10px] text-muted-foreground">{sub}</div>}
      </div>
      {tag && <span className="hidden shrink-0 rounded-full bg-city/15 px-2 py-0.5 text-[10px] font-semibold text-city sm:inline">{tag}</span>}
      {on ? (
        <>
          <span className="hidden h-1 w-14 shrink-0 overflow-hidden rounded-full bg-map sm:block">
            <span className="block h-full rounded-full bg-primary/70" style={{ width: `${(trees / max) * 100}%` }} />
          </span>
          <span className="w-14 shrink-0 text-right font-num text-[13px] font-bold text-primary">{bnNum(trees)}</span>
          <span className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary">→</span>
        </>
      ) : (
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">এখনো রোপণ হয়নি</span>
      )}
    </li>
  );
}

// ---------------- District: upazilas + city corporation ----------------
export function DistrictView({ name, bn, crumbs, onSelect }: { name: string; bn: string; crumbs: Crumb[]; onSelect: (a: Area) => void }) {
  const d = DISTRICTS[name];
  const [active, setActive] = useState<string | null>(null);
  if (!d) return null;
  const areas = [...d.upazilas].sort((a, b) => Number(!!b.city) - Number(!!a.city) || b.trees - a.trees);
  const total = areas.reduce((s, a) => s + a.trees, 0);
  const max = Math.max(1, ...areas.map((a) => a.trees));
  const ups = areas.filter((a) => !a.city);
  const hasCity = areas.some((a) => a.city);

  return (
    <Shell crumbs={crumbs}>
      <div className={`${grid} grid-rows-[minmax(0,1fr)_minmax(0,1fr)]`}>
        <section className="flex min-h-0 flex-col animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="font-display text-xl font-bold sm:text-3xl">{bn} জেলা</h1>
            <Legend city={hasCity} />
          </div>
          <svg viewBox={`0 0 ${d.w} ${d.h}`} className="mt-2 min-h-0 w-full flex-1" role="img" aria-label={`${bn} জেলার মানচিত্র`}>
            {d.upazilas.map((a) => {
              const on = a.trees > 0, hot = active === a.name;
              const fill = a.city ? (hot ? "fill-city-strong" : "fill-city") : on ? (hot ? "fill-highlight-strong" : "fill-highlight") : hot ? "fill-map-hover" : "fill-map";
              return (
                <path key={a.name} d={a.d} strokeWidth={1.5} onMouseEnter={() => setActive(a.name)} onMouseLeave={() => setActive(null)}
                  onClick={() => on && onSelect(a)} className={`stroke-background transition-colors duration-300 ${on ? "cursor-pointer" : ""} ${fill}`}>
                  <title>{a.name}</title>
                </path>
              );
            })}
            {d.upazilas.filter((a) => !a.city).map((a) => (
              <text key={a.name} x={a.cx} y={a.cy} textAnchor="middle" className={`pointer-events-none text-[11px] font-semibold ${a.trees > 0 ? "fill-primary-foreground" : "fill-muted-foreground"}`}>
                {a.name}
              </text>
            ))}
          </svg>
        </section>
        <section className="flex min-h-0 flex-col lg:justify-center animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="grid shrink-0 grid-cols-3 gap-2">
            <Stat label="মোট গাছ" value={bnNum(total)} />
            <Stat label="রোপিত উপজেলা" value={`${bnNum(ups.filter((a) => a.trees > 0).length)}/${bnNum(ups.length)}`} />
            <Stat label="সিটি কর্পোরেশন" value={bnNum(areas.length - ups.length)} />
          </div>
          <ul className="mt-3 min-h-0 overflow-y-auto rounded-2xl bg-card p-1.5 shadow-soft">
            {areas.map((a) => (
              <Row key={a.name} name={a.name} sub={a.city ? "ওয়ার্ডভিত্তিক রোপণ" : "উপজেলা · ইউনিয়নভিত্তিক রোপণ"} tag={a.city ? "সিটি" : undefined}
                trees={a.trees} max={max} active={active === a.name} onHover={(o) => setActive(o ? a.name : null)} onClick={() => onSelect(a)} />
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}

// ---------------- Upazila (unions) / Union (grams) / City (wards) ----------------
export function AreaView({ title, subtitle, area, units, focus, childLabel, crumbs, onSelect }: {
  title: string; subtitle: string; area: Area; units: Unit[]; focus?: Unit; childLabel: string; crumbs: Crumb[]; onSelect: (u: Unit) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const { ox, oy, side } = pathBounds(area.d);
  const u = side / 100;
  const total = units.reduce((s, x) => s + x.trees, 0);
  const max = Math.max(1, ...units.map((x) => x.trees));
  const planted = units.filter((x) => x.trees > 0).length;
  const wards = units[0]?.kind === "ward";

  return (
    <Shell crumbs={crumbs}>
      <div className={`${grid} grid-rows-[minmax(0,1fr)_minmax(0,1fr)]`}>
        <section className="flex min-h-0 flex-col animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
              <h1 className="truncate font-display text-xl font-bold sm:text-3xl">{title}</h1>
            </div>
            <Legend />
          </div>
          {wards ? (
            <div className="mt-3 grid min-h-0 flex-1 content-start gap-1.5 overflow-y-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(3rem, 1fr))" }}>
              {units.map((w, i) => {
                const on = w.trees > 0;
                return (
                  <button key={w.name} title={w.name} onMouseEnter={() => setActive(w.name)} onMouseLeave={() => setActive(null)} onClick={() => on && onSelect(w)}
                    className={`aspect-square rounded-lg font-num text-sm font-bold transition-all ${on ? "bg-highlight text-primary-foreground hover:bg-highlight-strong" : "cursor-default bg-map text-muted-foreground"} ${active === w.name ? "scale-105 ring-2 ring-primary/40" : ""}`}>
                    {bnNum(i + 1)}
                  </button>
                );
              })}
            </div>
          ) : (
            <svg viewBox={`${ox} ${oy} ${side} ${side}`} className="mt-2 min-h-0 w-full flex-1" role="img" aria-label={`${title} মানচিত্র`}>
              <path d={area.d} strokeWidth={0.5 * u} className={`${focus ? "fill-map" : "fill-highlight/80"} stroke-background`} />
              {focus && <circle cx={focus.x} cy={focus.y} r={18 * u} className="fill-highlight/45" />}
              {units.map((g) => {
                const on = g.trees > 0, hot = active === g.name;
                return (
                  <g key={g.name} className={on ? "cursor-pointer" : ""} onMouseEnter={() => setActive(g.name)} onMouseLeave={() => setActive(null)} onClick={() => on && onSelect(g)}>
                    <circle cx={g.x} cy={g.y} r={(hot ? 2.4 : 1.7) * u} className={`${on ? "fill-primary" : "fill-map-hover"} stroke-background transition-all`} strokeWidth={0.5 * u} />
                    <text x={g.x + 3 * u} y={g.y + 1.1 * u} className="pointer-events-none fill-foreground stroke-background font-semibold" style={{ fontSize: 3.2 * u, paintOrder: "stroke", strokeWidth: 0.8 * u }}>
                      {g.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </section>
        <section className="flex min-h-0 flex-col lg:justify-center animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="grid shrink-0 grid-cols-3 gap-2">
            <Stat label="মোট গাছ" value={bnNum(total)} />
            <Stat label={`রোপিত ${childLabel}`} value={`${bnNum(planted)}/${bnNum(units.length)}`} />
            <Stat label={`বাকি ${childLabel}`} value={bnNum(units.length - planted)} />
          </div>
          <ul className="mt-3 min-h-0 overflow-y-auto rounded-2xl bg-card p-1.5 shadow-soft">
            {[...units].sort((a, b) => b.trees - a.trees).map((g) => (
              <Row key={g.name} name={g.name} sub={g.trees ? `${g.date} · ${g.time}` : "পরিকল্পিত এলাকা"} trees={g.trees} max={max}
                active={active === g.name} onHover={(o) => setActive(o ? g.name : null)} onClick={() => onSelect(g)} />
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}

// ---------------- Plantation record (gram or ward) ----------------
export function RecordView({ unit, place, area, crumbs }: { unit: Unit; place: string; area: Area; crumbs: Crumb[] }) {
  const [tab, setTab] = useState<"info" | "media">("info");
  const [photo, setPhoto] = useState<number | null>(null);
  const r = recordDetails(unit);
  const { ox, oy, side } = pathBounds(area.d);
  const u = side / 100;
  const pin = unit.kind === "ward" ? { x: ox + side / 2, y: oy + side / 2 } : { x: unit.x, y: unit.y };

  const info = (
    <section className={`${tab === "info" ? "flex" : "hidden"} min-h-0 flex-col gap-2.5 lg:flex lg:justify-center animate-in fade-in zoom-in-95 duration-500`}>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-secondary/60 p-1 sm:h-20 sm:w-20">
          <svg viewBox={`${ox} ${oy} ${side} ${side}`} className="h-full w-full" role="img" aria-label={`${unit.name} এর অবস্থান`}>
            <path d={area.d} className="fill-highlight stroke-background" strokeWidth={1.5 * u} />
            <circle cx={pin.x} cy={pin.y} r={6 * u} className="fill-primary/30">
              <animate attributeName="r" values={`${4 * u};${9 * u};${4 * u}`} dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={pin.x} cy={pin.y} r={3 * u} className="fill-primary stroke-background" strokeWidth={u} />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] text-muted-foreground">{place}</p>
          <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{unit.name}</h1>
          <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">✓ রোপণ সম্পন্ন · যাচাইকৃত</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="রোপিত গাছ" value={bnNum(unit.trees)} />
        <Stat label="তারিখ" value={unit.date} />
        <Stat label="সময়" value={unit.time} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[["স্বেচ্ছাসেবক", bnNum(r.volunteers)], ["বেঁচে থাকার হার", `${bnNum(r.survival)}%`], ["CO₂ শোষণ/বছর", `${bnNum(r.co2)} টন`]].map(([l, v]) => (
          <div key={l} className="rounded-xl bg-secondary/50 px-2 py-1.5">
            <div className="font-num text-[13px] font-bold">{v}</div>
            <div className="truncate text-[10px] text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-2xl bg-card p-3 text-[12px] shadow-soft">
        {[["রোপিত প্রজাতি", r.species.join(", ")], ["মাঠ সমন্বয়কারী", r.lead], ["সহযোগী", r.partner], ["অর্থায়ন", r.funding], ["সর্বশেষ পরিদর্শন", r.lastVisit], ["পরিচর্যা", "৩ বছর নিয়মিত"]].map(([l, v]) => (
          <div key={l} className="min-w-0">
            <dt className="text-[10px] text-muted-foreground">{l}</dt>
            <dd className="truncate font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );

  const media = (
    <section className={`${tab === "media" ? "flex" : "hidden"} min-h-0 flex-col gap-2 lg:flex lg:justify-center animate-in fade-in slide-in-from-right-4 duration-700`}>
      <h2 className="text-[11px] font-semibold text-muted-foreground">বৃক্ষরোপণের ভিডিও ও ছবি</h2>
      <video src={video.url} controls muted playsInline preload="metadata" poster={p1} className="aspect-video max-h-[50%] w-full rounded-xl bg-muted object-cover shadow-soft lg:max-h-none" />
      <div className="grid grid-cols-3 gap-2">
        {PHOTOS.map((src, i) => (
          <button key={i} onClick={() => setPhoto(i)} className="overflow-hidden rounded-xl shadow-soft">
            <img src={src} alt={`${unit.name} এ বৃক্ষরোপণ, ছবি ${bnNum(i + 1)}`} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover transition-transform hover:scale-105" />
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <Shell crumbs={crumbs}>
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-2 px-4 pb-2 sm:px-8 lg:grid lg:grid-cols-[2fr_3fr] lg:gap-10">
        <div className="grid shrink-0 grid-cols-2 gap-1 rounded-xl bg-secondary/60 p-1 lg:hidden">
          {(["info", "media"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-lg py-1.5 text-xs font-semibold ${tab === t ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>
              {t === "info" ? "তথ্য" : "ছবি ও ভিডিও"}
            </button>
          ))}
        </div>
        {info}
        {media}
      </div>
      <Dialog open={photo !== null} onOpenChange={(o) => !o && setPhoto(null)}>
        <DialogContent className="max-w-3xl border-0 p-2 shadow-soft">
          <DialogTitle className="sr-only">ছবি</DialogTitle>
          {photo !== null && <img src={PHOTOS[photo]} alt={`${unit.name} এ বৃক্ষরোপণ`} className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
