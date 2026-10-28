import type { Gram } from "@/data/villages";
import { pathBounds, type UpazilaShape } from "@/components/UpazilaDetail";
import { Shell } from "@/components/Shell";
import { bnNum } from "@/data/bn";
import { toast } from "sonner";
import photo1 from "@/assets/plantation-1.jpg";
import photo2 from "@/assets/plantation-2.jpg";
import photo3 from "@/assets/plantation-3.jpg";
import photo4 from "@/assets/plantation-4.jpg";

const photos = [photo1, photo2, photo3, photo4];

export function GramDetail({
  district,
  upazila,
  gram,
  onBack,
}: {
  district: string;
  upazila: UpazilaShape;
  gram: Gram;
  onBack: () => void;
}) {
  const { ox, oy, side } = pathBounds(upazila.d);
  const u = side / 100;
  const px = ox + gram.x * u, py = oy + gram.y * u;

  return (
    <Shell onBack={onBack} backLabel={`${upazila.name} উপজেলা`}>
      <div className="mx-auto grid h-full max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-3 px-4 pb-2 sm:px-8 lg:grid-cols-[2fr_3fr] lg:grid-rows-1 lg:gap-10">
        <section className="flex min-h-0 flex-col gap-2.5 lg:justify-center animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-secondary/60 p-1 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
              <svg viewBox={`${ox} ${oy} ${side} ${side}`} className="h-full w-full" role="img" aria-label={`${gram.name} গ্রামের অবস্থান`}>
                <path d={upazila.d} className="fill-highlight stroke-background" strokeWidth={1.5 * u} />
                <circle cx={px} cy={py} r={6 * u} className="fill-primary/30">
                  <animate attributeName="r" values={`${4 * u};${9 * u};${4 * u}`} dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={px} cy={py} r={3 * u} className="fill-primary stroke-background" strokeWidth={u} />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-muted-foreground">{district} · {upazila.name}</p>
              <h1 className="truncate font-display text-2xl sm:text-4xl">{gram.name}</h1>
              <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">✓ রোপণ সম্পন্ন</span>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-2">
            {[["রোপিত গাছ", bnNum(gram.trees)], ["তারিখ", gram.date], ["সময়", gram.time]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-card px-3 py-2 shadow-soft">
                <dt className="text-[10px] text-muted-foreground">{l}</dt>
                <dd className="truncate text-[13px] font-semibold text-primary">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[["স্বেচ্ছাসেবক", bnNum(Math.max(8, Math.round(gram.trees / 40)))], ["বেঁচে থাকার হার", "৯২%"], ["CO₂ শোষণ/বছর", `${bnNum(Math.round(gram.trees * 0.022))} টন`]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-secondary/50 px-2 py-1.5">
                <div className="text-[13px] font-semibold">{v}</div>
                <div className="truncate text-[10px] text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>

          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">{gram.info}</p>

          <button
            onClick={() => toast.success(`${gram.name} গ্রামে গাছ স্পনসরের অনুরোধ পাঠানো হয়েছে। ধন্যবাদ!`)}
            className="rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
          >
            🌳 এই গ্রামে একটি গাছ স্পনসর করুন
          </button>
        </section>

        <section className="flex min-h-0 flex-col animate-in fade-in slide-in-from-right-4 duration-700 lg:justify-center">
          <h2 className="mb-2 text-[11px] font-semibold text-muted-foreground">বৃক্ষরোপণের ছবি</h2>
          <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2 lg:max-h-[75%] lg:flex-none lg:aspect-[4/3]">
            {photos.map((src, i) => (
              <img key={i} src={src} alt={`${gram.name} গ্রামে বৃক্ষরোপণ, ছবি ${bnNum(i + 1)}`} className="h-full min-h-0 w-full rounded-xl object-cover shadow-soft" />
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
