import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import districts from "@/data/bd-districts.json";
import upazilaData from "@/data/upazilas.json";
import { DistrictDetail, type Upazila } from "@/components/DistrictDetail";
import { UpazilaDetail } from "@/components/UpazilaDetail";
import { GramDetail } from "@/components/GramDetail";
import { Shell } from "@/components/Shell";
import { bnNum, DISTRICT_BN } from "@/data/bn";
import type { Gram } from "@/data/villages";

const HIGHLIGHTED = Object.keys(DISTRICT_BN);
const allUp = Object.values(upazilaData as Record<string, { upazilas: Upazila[] }>).flatMap((d) => d.upazilas);
const TOTAL_TREES = allUp.reduce((s, u) => s + u.trees, 0);
const PLANTED_UP = allUp.filter((u) => u.trees > 0).length;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "সবুজ আশা ফাউন্ডেশন — বাংলাদেশে বৃক্ষরোপণ" },
      { name: "description", content: "সবুজ আশা ফাউন্ডেশন বাংলাদেশের জলবায়ু-ঝুঁকিপূর্ণ জেলাগুলোতে বৃক্ষরোপণ ও সবুজ ভবিষ্যৎ গড়তে কাজ করছে।" },
      { property: "og:title", content: "সবুজ আশা ফাউন্ডেশন — বাংলাদেশে বৃক্ষরোপণ" },
      { property: "og:description", content: "জেলা, উপজেলা ও গ্রাম অনুযায়ী আমাদের বৃক্ষরোপণের হিসাব দেখুন।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [upazila, setUpazila] = useState<Upazila | null>(null);
  const [gram, setGram] = useState<Gram | null>(null);

  if (selected && upazila && gram)
    return <GramDetail district={DISTRICT_BN[selected] ?? selected} upazila={upazila} gram={gram} onBack={() => setGram(null)} />;
  if (selected && upazila)
    return (
      <UpazilaDetail district={DISTRICT_BN[selected] ?? selected} upazila={upazila} onBack={() => setUpazila(null)} onSelectGram={setGram} />
    );
  if (selected) return <DistrictDetail name={selected} onBack={() => setSelected(null)} onSelectUpazila={setUpazila} />;

  return (
    <Shell>
      <div className="mx-auto grid h-full max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-3 px-4 pb-2 sm:px-8 lg:grid-cols-2 lg:grid-rows-1 lg:items-center lg:gap-12">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
            একটি গাছ, একটি আশা
          </span>
          <h1 className="mt-3 font-display text-2xl leading-tight sm:text-4xl lg:text-5xl">
            সবুজ বাংলাদেশ গড়ি <span className="text-primary">একসাথে।</span>
          </h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:mt-4 sm:text-base">
            জলবায়ু-ঝুঁকিপূর্ণ জেলাগুলোতে স্থানীয় মানুষের হাত ধরে আমরা গাছ লাগাই, পরিচর্যা করি এবং ভবিষ্যৎ প্রজন্মের জন্য সবুজ রেখে যাই।
          </p>
          <div className="mt-3 grid max-w-md grid-cols-3 gap-2 sm:mt-6">
            {[
              [bnNum(HIGHLIGHTED.length), "জেলা"],
              [bnNum(PLANTED_UP), "উপজেলা"],
              [bnNum(TOTAL_TREES), "গাছ রোপিত"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-card px-3 py-2 shadow-soft">
                <div className="font-display text-lg text-primary sm:text-2xl">{n}</div>
                <div className="text-[11px] text-muted-foreground sm:text-xs">{l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-0 flex-col lg:h-full lg:py-4">
          <svg viewBox="0 0 620 720" className="min-h-0 w-full flex-1" role="img" aria-label="বাংলাদেশের মানচিত্র">
            {districts.map((d) => {
              const on = HIGHLIGHTED.includes(d.name);
              return (
                <path
                  key={d.name}
                  d={d.d}
                  onMouseEnter={on ? () => setHover(d.name) : undefined}
                  onMouseLeave={() => setHover(null)}
                  onClick={on ? () => setSelected(d.name) : undefined}
                  className={`stroke-background transition-colors duration-300 ${
                    on ? "cursor-pointer fill-highlight hover:fill-highlight-strong" : "fill-map"
                  }`}
                  strokeWidth={1}
                >
                  {on && <title>{DISTRICT_BN[d.name]}</title>}
                </path>
              );
            })}
            {districts
              .filter((d) => HIGHLIGHTED.includes(d.name))
              .map((d) => (
                <g key={d.name} className="pointer-events-none">
                  <circle cx={d.cx} cy={d.cy} r={4} className="fill-background" />
                  <text x={d.cx + 7} y={d.cy + 5} className="fill-foreground text-[14px] font-semibold">
                    {DISTRICT_BN[d.name]}
                  </text>
                </g>
              ))}
          </svg>
          <div className="mt-1 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-highlight" /> আমাদের কর্মএলাকা</span>
            <span className="font-semibold text-foreground">{hover ? DISTRICT_BN[hover] : "লাল জেলায় ক্লিক করুন"}</span>
          </div>
        </section>
      </div>
    </Shell>
  );
}
