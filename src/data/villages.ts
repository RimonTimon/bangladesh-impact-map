// Placeholder gram (village) data per upazila — replace with the NGO's real records.

export type Gram = {
  name: string;
  trees: number; // 0 = not yet planted
  date: string;
  time: string;
  info: string;
  x: number; // dot position, % of upazila bounding box
  y: number;
};

const POOL = [
  "চরপাড়া", "নয়াপাড়া", "বটতলা", "পূর্বপাড়া", "শিমুলতলী", "কাশিপুর",
  "রামনগর", "হরিপুর", "দক্ষিণপাড়া", "মধুপুর", "বকুলতলা", "নতুনহাট",
];

const INFO =
  "স্থানীয় স্বেচ্ছাসেবক ও স্কুলের শিক্ষার্থীদের নিয়ে সমাজভিত্তিক বৃক্ষরোপণ কর্মসূচি। দেশীয় ফলজ ও বনজ চারা রোপণ করা হয়েছে, যার পরিচর্যা করছে গ্রামের সবুজ কমিটি।";
const PLANNED_INFO = "এই গ্রামে শীঘ্রই বৃক্ষরোপণ কর্মসূচি শুরু হবে। আপনার সহায়তায় এখানে সবুজ ফিরিয়ে আনা সম্ভব।";

const DATES: [string, string][] = [
  ["১২ মার্চ ২০২৬", "সকাল ৯:৩০"],
  ["২৮ ফেব্রুয়ারি ২০২৬", "সকাল ১০:০০"],
  ["১৫ জানুয়ারি ২০২৬", "সকাল ৮:৪৫"],
  ["৩ ডিসেম্বর ২০২৫", "সকাল ১১:১৫"],
];
const SPOTS: [number, number][] = [[40, 28], [64, 44], [32, 58], [58, 72], [46, 86]];
const SHARES = [0.38, 0.3, 0.2, 0.12];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function gramsFor(upazila: string, totalTrees: number): Gram[] {
  const start = hash(upazila) % POOL.length;
  return SPOTS.map(([x, y], i) => {
    const name = POOL[(start + i * 5) % POOL.length] ?? "গ্রাম";
    // last gram (and every gram in an unplanted upazila) is not yet planted
    const planted = totalTrees > 0 && i < 4;
    const [date, time] = DATES[i] ?? ["", ""];
    return {
      name,
      trees: planted ? Math.round(totalTrees * (SHARES[i] ?? 0)) : 0,
      date: planted ? date : "পরিকল্পিত",
      time: planted ? time : "—",
      info: planted ? INFO : PLANNED_INFO,
      x,
      y,
    };
  });
}
