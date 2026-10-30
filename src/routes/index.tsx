import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import districts from "@/data/bd-districts.json";
import { DistrictView, AreaView, RecordView } from "@/components/Views";
import { Shell, type Crumb } from "@/components/Shell";
import { ALL_AREAS, bnNum, DISTRICT_BN, gramsOf, NGO, TOTAL_TREES, unionsOf, wardsOf, type Area, type Unit } from "@/data/areas";

const HIGHLIGHTED = Object.keys(DISTRICT_BN);
const PLANTED_UP = ALL_AREAS.filter((a) => a.trees > 0 && !a.city).length;
const CITIES = ALL_AREAS.filter((a) => a.city).length;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "সবুজ আশা ফাউন্ডেশন — বাংলাদেশে বৃক্ষরোপণ রেকর্ড" },
      { name: "description", content: "জেলা, উপজেলা, ইউনিয়ন, গ্রাম ও সিটি কর্পোরেশনের ওয়ার্ড অনুযায়ী সবুজ আশা ফাউন্ডেশনের বৃক্ষরোপণের হিসাব।" },
      { property: "og:title", content: "সবুজ আশা ফাউন্ডেশন — বৃক্ষরোপণ রেকর্ড" },
      { property: "og:description", content: "বাংলাদেশের মানচিত্রে আমাদের প্রতিটি রোপিত গাছের হিসাব দেখুন।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [hover, setHover] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [union, setUnion] = useState<Unit | null>(null);
  const [leaf, setLeaf] = useState<Unit | null>(null);

  const go = (lvl: number) => () => {
    if (lvl < 1) setDistrict(null);
    if (lvl < 2) setArea(null);
    if (lvl < 3) setUnion(null);
    setLeaf(null);
  };

  if (district) {
    const bn = DISTRICT_BN[district] ?? district;
    const crumbs: Crumb[] = [{ label: "বাংলাদেশ", onClick: go(0) }, { label: `${bn} জেলা`, onClick: go(1) }];
    if (!area) return <DistrictView name={district} bn={bn} crumbs={crumbs} onSelect={setArea} />;
    const areaLabel = area.city ? area.name : `${area.name} উপজেলা`;
    crumbs.push({ label: areaLabel, onClick: go(2) });

    if (area.city) {
      if (leaf) return <RecordView unit={leaf} area={area} place={`${bn} · ${area.name}`} crumbs={[...crumbs, { label: leaf.name }]} />;
      return <AreaView title={area.name} subtitle={`${bn} জেলা · ওয়ার্ডভিত্তিক রোপণ`} area={area} units={wardsOf(area)} childLabel="ওয়ার্ড" crumbs={crumbs} onSelect={setLeaf} />;
    }
    if (!union)
      return <AreaView title={areaLabel} subtitle={`${bn} জেলা`} area={area} units={unionsOf(area)} childLabel="ইউনিয়ন" crumbs={crumbs} onSelect={setUnion} />;
    crumbs.push({ label: union.name, onClick: go(3) });
    if (leaf)
      return <RecordView unit={leaf} area={area} place={`${bn} · ${area.name} · ${union.name}`} crumbs={[...crumbs, { label: leaf.name }]} />;
    return (
      <AreaView title={union.name} subtitle={`${bn} জেলা · ${areaLabel}`} area={area} focus={union} units={gramsOf(area, union)} childLabel="গ্রাম" crumbs={crumbs} onSelect={setLeaf} />
    );
  }

  return (
    <Shell>
      <div className="mx-auto grid h-full max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-3 px-4 pb-2 sm:px-8 lg:grid-cols-2 lg:grid-rows-1 lg:items-center lg:gap-12">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
            {NGO.since} সাল থেকে · একটি গাছ, একটি আশা
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            সবুজ বাংলাদেশ গড়ি <span className="text-primary">একসাথে।</span>
          </h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:mt-4 sm:text-base">
            জলবায়ু-ঝুঁকিপূর্ণ এলাকায় স্থানীয় মানুষের হাত ধরে আমরা গাছ লাগাই, তিন বছর পরিচর্যা করি এবং প্রতিটি চারার হিসাব প্রকাশ করি।
          </p>
          <div className="mt-3 grid max-w-lg grid-cols-4 gap-2 sm:mt-6">
            {[
              [bnNum(HIGHLIGHTED.length), "জেলা"],
              [bnNum(PLANTED_UP), "উপজেলা"],
              [bnNum(CITIES), "সিটি কর্পো."],
              [bnNum(TOTAL_TREES), "গাছ রোপিত"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-card px-2.5 py-2 shadow-soft">
                <div className="truncate font-num text-base font-bold text-primary sm:text-2xl">{n}</div>
                <div className="truncate text-[10px] text-muted-foreground sm:text-xs">{l}</div>
              </div>
            ))}
          </div>
          <ul className="mt-4 hidden max-w-lg grid-cols-3 gap-2 text-[11px] sm:grid">
            {[["৯২%", "গড় বেঁচে থাকার হার"], ["৩ বছর", "চারার পরিচর্যা"], ["১০০%", "জিপিএস-যাচাইকৃত রেকর্ড"]].map(([v, l]) => (
              <li key={l} className="rounded-xl bg-secondary/50 px-2.5 py-1.5">
                <div className="font-num text-sm font-bold">{v}</div>
                <div className="text-muted-foreground">{l}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex min-h-0 flex-col lg:h-full lg:py-4">
          <svg viewBox="0 0 620 720" className="min-h-0 w-full flex-1" role="img" aria-label="বাংলাদেশের মানচিত্র">
            {districts.map((d) => {
              const on = HIGHLIGHTED.includes(d.name);
              return (
                <path key={d.name} d={d.d} strokeWidth={1}
                  onMouseEnter={on ? () => setHover(d.name) : undefined}
                  onMouseLeave={() => setHover(null)}
                  onClick={on ? () => setDistrict(d.name) : undefined}
                  className={`stroke-background transition-colors duration-300 ${on ? "cursor-pointer fill-highlight hover:fill-highlight-strong" : "fill-map"}`}>
                  {on && <title>{DISTRICT_BN[d.name]}</title>}
                </path>
              );
            })}
            {districts.filter((d) => HIGHLIGHTED.includes(d.name)).map((d) => (
              <g key={d.name} className="pointer-events-none">
                <circle cx={d.cx} cy={d.cy} r={4} className="fill-background" />
                <text x={d.cx + 7} y={d.cy + 5} className="fill-foreground stroke-background text-[14px] font-semibold" style={{ paintOrder: "stroke", strokeWidth: 3 }}>
                  {DISTRICT_BN[d.name]}
                </text>
              </g>
            ))}
          </svg>
          <div className="mt-1 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-highlight" /> রোপণ সম্পন্ন এলাকা</span>
            <span className="font-semibold text-foreground">{hover ? DISTRICT_BN[hover] : "সবুজ জেলায় ক্লিক করুন"}</span>
          </div>
        </section>
      </div>
    </Shell>
  );
}
