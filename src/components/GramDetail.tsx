import type { Gram } from "@/data/villages";
import { pathBounds } from "@/components/UpazilaDetail";
import photo1 from "@/assets/plantation-1.jpg";
import photo2 from "@/assets/plantation-2.jpg";
import photo3 from "@/assets/plantation-3.jpg";
import photo4 from "@/assets/plantation-4.jpg";

type UpazilaShape = { name: string; d: string; cx: number; cy: number; trees: number };

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
  const photos = [photo1, photo2, photo3, photo4];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-12">
        <button
          onClick={onBack}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          ← Back to {upazila.name} upazila
        </button>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {district} · {upazila.name}
            </p>
            <h1 className="mt-2 font-display text-5xl">{gram.name}</h1>
            <p className="mt-3 text-muted-foreground">
              <span className="font-display text-2xl text-primary">{gram.trees.toLocaleString()}</span> trees planted
            </p>

            {/* Mini map: the upazila outline with this gram marked */}
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-map/40">
              {(() => {
                const { ox, oy, side } = pathBounds(upazila.d);
                const u = side / 100;
                const px = ox + gram.x * u;
                const py = oy + gram.y * u;
                return (
                  <svg viewBox={`${ox} ${oy} ${side} ${side}`} className="w-full" role="img" aria-label={`Mini map of ${gram.name}`}>
                    <path d={upazila.d} className="fill-highlight stroke-background" strokeWidth={1.5 * u} />
                    <circle cx={px} cy={py} r={8 * u} className="fill-primary/25">
                      <animate attributeName="r" values={`${6 * u};${10 * u};${6 * u}`} dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={px} cy={py} r={3.5 * u} className="fill-primary" />
                  </svg>
                );
              })()}
              <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                📍 {gram.name}, {upazila.name}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plantation date</dt>
                <dd className="mt-1 font-semibold">{gram.date}</dd>
              </div>
              <div className="rounded-xl border border-border p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</dt>
                <dd className="mt-1 font-semibold">{gram.time}</dd>
              </div>
            </dl>

            <p className="mt-6 leading-relaxed text-muted-foreground">{gram.info}</p>
          </section>

          <section className="animate-in fade-in slide-in-from-right-4 duration-700">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Plantation photos
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Tree plantation at ${gram.name}, photo ${i + 1}`}
                  className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
