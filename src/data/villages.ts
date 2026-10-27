import { place } from '@/data/bangla';
export type Gram = { name: string; trees: number; date: string; time: string; info: string; x: number; y: number };
export function gramsFor(upazila: string, totalTrees: number): Gram[] {
  const name = place(upazila);
  const counts = [Math.round(totalTrees * .4), Math.round(totalTrees * .35), 0];
  counts.push(totalTrees - (counts[0] ?? 0) - (counts[1] ?? 0));
  const names = [`${name} সদর গ্রাম`, `উত্তর ${name}`, `দক্ষিণ ${name}`, `চর ${name}`];
  const dates = ['১২ মার্চ ২০২৬', '২৮ ফেব্রুয়ারি ২০২৬', '', '৩ ডিসেম্বর ২০২৫'];
  const times = ['সকাল ৯:৩০', 'সকাল ১০:০০', '', 'সকাল ১১:১৫'];
  const spots = [[42,30],[62,48],[35,62],[55,78]];
  return names.map((name, i) => ({name, trees: counts[i] ?? 0, date: totalTrees > 0 ? dates[i] ?? '' : '', time: totalTrees > 0 ? times[i] ?? '' : '', info: (counts[i] ?? 0) > 0 ? 'স্থানীয় মানুষ ও শিক্ষার্থীদের অংশগ্রহণে দেশীয় ফলদ ও বনজ চারা রোপণের নমুনা কার্যক্রম। চারার পরিচর্যায় স্থানীয় কমিটির অংশগ্রহণকে গুরুত্ব দেওয়া হয়।' : 'এই এলাকায় এখনো বৃক্ষরোপণ হয়নি। রোপণ কার্যক্রম শুরু হলে তারিখ, সময় ও ছবি এখানে যুক্ত হবে।', x: spots[i]?.[0] ?? 50, y: spots[i]?.[1] ?? 50 }));
}
