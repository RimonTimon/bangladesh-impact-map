import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { MESSAGES } from "@/data/areas";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "নেতৃত্বের বার্তা — সবুজ আশা ফাউন্ডেশন" },
      { name: "description", content: "চেয়ারম্যান, আর্থিক সহায়তাকারী প্রতিষ্ঠান ও কর্মকর্তাদের বার্তা এবং ভবিষ্যৎ পরিকল্পনা।" },
      { property: "og:title", content: "নেতৃত্বের বার্তা — সবুজ আশা ফাউন্ডেশন" },
      { property: "og:description", content: "আমাদের নেতৃত্ব ও সহযোগীদের বার্তা এবং আগামীর পরিকল্পনা।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Messages,
});

function Messages() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const m = MESSAGES[i]!;
  return (
    <Shell crumbs={[{ label: "বাংলাদেশ", onClick: () => navigate({ to: "/" }) }, { label: "নেতৃত্বের বার্তা" }]}>
      <div className="mx-auto grid h-full max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-3 px-4 pb-2 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:grid-rows-1 lg:gap-10">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:justify-center lg:overflow-visible">
          {MESSAGES.map((p, k) => (
            <li key={p.name} className="shrink-0">
              <button onClick={() => setI(k)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${k === i ? "bg-card shadow-soft" : "hover:bg-secondary/60"}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${k === i ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{p.initials}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{p.name}</span>
                  <span className="hidden truncate text-[11px] text-muted-foreground lg:block">{p.role}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <article key={i} className="flex min-h-0 flex-col justify-center overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="rounded-2xl bg-card p-5 shadow-soft sm:p-7">
            <span className="font-display text-4xl leading-none text-primary">“</span>
            <p className="mt-1 text-sm leading-relaxed sm:text-base">{m.message}</p>
            <div className="mt-4">
              <div className="font-display text-base font-bold">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.role}</div>
            </div>
          </div>
          <div className="mt-3 rounded-2xl bg-secondary/50 p-4 sm:p-5">
            <h2 className="text-xs font-semibold text-secondary-foreground">ভবিষ্যৎ পরিকল্পনা</h2>
            <ul className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
              {m.plans.map((p) => (
                <li key={p} className="flex items-start gap-2"><span className="text-primary">✓</span>{p}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </Shell>
  );
}
