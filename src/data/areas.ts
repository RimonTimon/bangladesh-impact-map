// All site data and helpers. Tree counts, unions, grams, wards and dates are
// placeholder records — replace them with the NGO's real plantation register.
import raw from "@/data/upazilas.json";

export const bnNum = (n: number) => n.toLocaleString("bn-BD");

export const NGO = {
  name: "সবুজ আশা ফাউন্ডেশন",
  tagline: "বৃক্ষরোপণ রেকর্ড ও প্রদর্শনী",
  reg: "এনজিও বিষয়ক ব্যুরো নিবন্ধন নং ০০০০",
  email: "info@sobujasha.org",
  phone: "+৮৮০ ১৭০০-০০০০০০",
  since: "২০১৮",
};

export const DISTRICT_BN: Record<string, string> = {
  Kurigram: "কুড়িগ্রাম",
  Gaibandha: "গাইবান্ধা",
  Sunamganj: "সুনামগঞ্জ",
  Sylhet: "সিলেট",
  Satkhira: "সাতক্ষীরা",
  Khulna: "খুলনা",
  Bhola: "ভোলা",
  "Cox's Bazar": "কক্সবাজার",
  Bandarban: "বান্দরবান",
  Jamalpur: "জামালপুর",
};

/** Upazila or city corporation drawn on a district map. */
export type Area = { name: string; d: string; cx: number; cy: number; trees: number; city?: boolean };
/** Union, gram or ward — a dot/tile inside its parent area. */
export type Unit = {
  name: string;
  kind: "union" | "gram" | "ward";
  trees: number; // 0 = not yet planted
  date: string;
  time: string;
  x: number;
  y: number;
};

const WARDS: Record<string, number> = { "খুলনা সিটি কর্পোরেশন": 31, "সিলেট সিটি কর্পোরেশন": 42 };

function hash(s: string) {
  let h = 7;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

const DATES: [string, string][] = [
  ["১২ মার্চ ২০২৬", "সকাল ৯:৩০"],
  ["২৮ ফেব্রুয়ারি ২০২৬", "সকাল ১০:০০"],
  ["১৫ জানুয়ারি ২০২৬", "সকাল ৮:৪৫"],
  ["৩ ডিসেম্বর ২০২৫", "সকাল ১১:১৫"],
  ["১৮ জুলাই ২০২৫", "বিকাল ৩:৩০"],
  ["৫ জুন ২০২৫", "সকাল ৯:০০"],
];

function split(total: number, n: number, seed: number, plantedEvery = 3): number[] {
  const w: number[] = Array.from({ length: n }, (_, i): number => ((seed >> i) % plantedEvery === 0 && i > 0 ? 0 : 2 + ((seed >> (i + 2)) % 5)));
  if (total > 0 && !w.some((x) => x > 0)) w[0] = 1;
  const sum = w.reduce((a, b) => a + b, 0) || 1;
  const parts = w.map((x) => Math.round((total * x) / sum));
  const diff = total - parts.reduce((a, b) => a + b, 0);
  const i = parts.findIndex((p) => p > 0);
  if (i >= 0) parts[i] = (parts[i] ?? 0) + diff;
  return parts;
}

// ---------- geometry ----------
function polygons(d: string): [number, number][][] {
  return d
    .split("Z")
    .filter((s) => s.trim())
    .map((s) => {
      const n = s.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
      const pts: [number, number][] = [];
      for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i] ?? 0, n[i + 1] ?? 0]);
      return pts;
    });
}

function inside(x: number, y: number, polys: [number, number][][]) {
  let c = false;
  for (const p of polys)
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, yi] = p[i] ?? [0, 0];
      const [xj, yj] = p[j] ?? [0, 0];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
  return c;
}

/** Square viewBox around a path, with padding. */
export function pathBounds(d: string) {
  const pts = polygons(d).flat();
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX || 1, h = maxY - minY || 1;
  const side = Math.max(w, h) * 1.16;
  return { ox: minX - (side - w) / 2, oy: minY - (side - h) / 2, side, minX, minY, w, h };
}

/** n well-spread points inside a path, optionally near a centre point. */
function spots(d: string, n: number, seed: number, near?: { x: number; y: number; r: number }) {
  const polys = polygons(d);
  const b = pathBounds(d);
  const G = 14;
  const cand: [number, number][] = [];
  for (let i = 0; i < G; i++)
    for (let j = 0; j < G; j++) {
      const x = b.minX + ((i + 0.5) / G) * b.w, y = b.minY + ((j + 0.5) / G) * b.h;
      if (!inside(x, y, polys)) continue;
      if (near && Math.hypot(x - near.x, y - near.y) > near.r) continue;
      cand.push([x, y]);
    }
  if (!cand.length) cand.push([b.minX + b.w / 2, b.minY + b.h / 2]);
  const out: [number, number][] = [];
  let pick = cand[seed % cand.length] ?? cand[0]!;
  while (out.length < n) {
    out.push(pick);
    // farthest-point sampling for an even spread
    let best = cand[0]!, bestD = -1;
    for (const c of cand) {
      const dist = Math.min(...out.map((o) => Math.hypot(o[0] - c[0], o[1] - c[1])));
      if (dist > bestD) (bestD = dist), (best = c);
    }
    pick = best;
  }
  return out;
}

// ---------- names ----------
const UNION_POOL = ["সদর", "চরভাটা", "উত্তর", "দক্ষিণ", "পূর্ব", "পশ্চিম", "রায়পুর", "মধ্যনগর", "হাতিয়া", "বেতকান্দি", "কালিকাপুর", "সুলতানপুর", "নারায়ণপুর", "জয়নগর"];
const GRAM_POOL = ["চরপাড়া", "নয়াপাড়া", "বটতলা", "পূর্বপাড়া", "শিমুলতলী", "কাশিপুর", "রামনগর", "হরিপুর", "দক্ষিণপাড়া", "মধুপুর", "বকুলতলা", "নতুনহাট", "আমতলী", "কদমতলা", "তালতলা", "বাঁশবাড়িয়া"];

const unit = (name: string, kind: Unit["kind"], trees: number, i: number, x: number, y: number): Unit => {
  const [date, time] = DATES[i % DATES.length] ?? ["", ""];
  return { name, kind, trees, date: trees ? date : "পরিকল্পিত", time: trees ? time : "—", x, y };
};

// ---------- hierarchy ----------
export function unionsOf(a: Area): Unit[] {
  const h = hash(a.name);
  const n = 5 + (h % 3);
  const trees = split(a.trees, n, h);
  return spots(a.d, n, h).map(([x, y], i) => unit(`${UNION_POOL[(h + i * 3) % UNION_POOL.length]} ইউনিয়ন`, "union", trees[i] ?? 0, i, x, y));
}

export function gramsOf(a: Area, u: Unit): Unit[] {
  const h = hash(a.name + u.name);
  const n = 3 + (h % 2);
  const trees = split(u.trees, n, h, 4);
  const r = pathBounds(a.d).side * 0.18;
  return spots(a.d, n, h, { x: u.x, y: u.y, r }).map(([x, y], i) => unit(GRAM_POOL[(h + i * 5) % GRAM_POOL.length] ?? "গ্রাম", "gram", trees[i] ?? 0, i + 1, x, y));
}

export function wardsOf(a: Area): Unit[] {
  const n = WARDS[a.name] ?? 20;
  return Array.from({ length: n }, (_, i) => {
    const h = hash(a.name + i);
    const trees = h % 3 === 0 ? 0 : 400 + (h % 18) * 100;
    return unit(`ওয়ার্ড নং ${bnNum(i + 1)}`, "ward", trees, i, 0, 0);
  });
}

const all = raw as Record<string, { w: number; h: number; upazilas: Area[] }>;
for (const dist of Object.values(all))
  for (const a of dist.upazilas) if (a.city) a.trees = wardsOf(a).reduce((s, w) => s + w.trees, 0);

export const DISTRICTS = all;
export const ALL_AREAS = Object.values(all).flatMap((d) => d.upazilas);
export const TOTAL_TREES = ALL_AREAS.reduce((s, a) => s + a.trees, 0);

// ---------- record details ----------
const SPECIES = ["আম", "জাম", "কাঁঠাল", "নিম", "অর্জুন", "মেহগনি", "তাল", "নারিকেল", "সুপারি", "বাবলা", "কড়ই", "পেয়ারা"];
const PARTNERS = ["স্থানীয় ইউনিয়ন পরিষদ", "উপজেলা বন বিভাগ", "স্থানীয় সরকারি প্রাথমিক বিদ্যালয়", "ওয়ার্ড কাউন্সিলর কার্যালয়"];
const LEADS = ["মো. রফিকুল ইসলাম", "সুমাইয়া আক্তার", "আব্দুল করিম", "নাসরিন সুলতানা", "তানভীর আহমেদ"];

export function recordDetails(u: Unit) {
  const h = hash(u.name + u.trees);
  return {
    species: [0, 1, 2, 3].map((i) => SPECIES[(h + i * 5) % SPECIES.length] ?? ""),
    volunteers: Math.max(8, Math.round(u.trees / 40)),
    survival: 86 + (h % 11),
    co2: Math.round(u.trees * 0.022),
    lead: LEADS[h % LEADS.length] ?? "",
    partner: u.kind === "ward" ? PARTNERS[3]! : PARTNERS[h % 3]!,
    funding: h % 2 ? "ব্যক্তিগত অনুদান" : "কর্পোরেট সিএসআর",
    lastVisit: "২০ অক্টোবর ২০২৬",
  };
}
