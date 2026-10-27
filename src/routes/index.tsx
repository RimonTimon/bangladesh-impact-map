import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import districts from "@/data/bd-districts.json";

// Districts where the NGO works — edit this list to change highlights.
const HIGHLIGHTED = ["Kurigram", "Gaibandha", "Sunamganj", "Satkhira", "Bhola", "Cox's Bazar", "Bandarban", "Jamalpur"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shobuj Asha Foundation — Hope for every district" },
      { name: "description", content: "Our NGO works across Bangladesh to bring education, clean water and resilience to vulnerable communities." },
      { property: "og:title", content: "Shobuj Asha Foundation" },
      { property: "og:description", content: "Education, clean water and resilience for vulnerable communities in Bangladesh." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-12">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block rounded-full bg-secondary px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            Shobuj Asha Foundation
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl">
            No community left <em className="text-primary">behind.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Our goal is to bring quality education, safe drinking water and climate resilience to the
            most vulnerable families of Bangladesh — working hand in hand with local people in every
            district we serve.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
            {[["8", "Districts"], ["120+", "Villages"], ["45k", "Lives reached"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl text-primary">{n}</div>
                <div className="text-sm text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative">
          <svg viewBox="0 0 520 660" className="mx-auto w-full max-w-lg" role="img" aria-label="Map of Bangladesh with highlighted districts">
            {districts.map((d) => {
              const on = HIGHLIGHTED.includes(d.name);
              return (
                <path
                  key={d.name}
                  d={d.d}
                  onMouseEnter={() => setHover(d.name)}
                  onMouseLeave={() => setHover(null)}
                  className={`stroke-background transition-colors duration-300 ${
                    on ? "fill-highlight hover:fill-highlight-strong" : "fill-map hover:fill-map-hover"
                  }`}
                  strokeWidth={1}
                >
                  <title>{d.name}</title>
                </path>
              );
            })}
            {districts
              .filter((d) => HIGHLIGHTED.includes(d.name))
              .map((d) => (
                <g key={d.name} className="pointer-events-none">
                  <circle cx={d.cx} cy={d.cy} r={4} className="fill-background" />
                  <text x={d.cx + 7} y={d.cy + 4} className="fill-foreground text-[11px] font-semibold">
                    {d.name}
                  </text>
                </g>
              ))}
          </svg>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-highlight" /> Where we work</span>
            <span className="min-w-28 font-medium text-foreground">{hover ?? "Hover a district"}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
