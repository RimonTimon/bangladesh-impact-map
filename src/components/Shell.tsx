import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Kind = "donate" | "volunteer" | "about" | null;

export function Shell({ children, onBack, backLabel }: { children: ReactNode; onBack?: () => void; backLabel?: string }) {
  const [open, setOpen] = useState<Kind>(null);
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 sm:px-8">
        <div className="flex min-w-0 items-center gap-2">
          {onBack ? (
            <button
              onClick={onBack}
              className="truncate rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-map-hover"
            >
              ← {backLabel}
            </button>
          ) : (
            <span className="truncate font-display text-base text-primary sm:text-lg">🌱 সবুজ আশা ফাউন্ডেশন</span>
          )}
        </div>
        <nav className="flex shrink-0 items-center gap-1.5">
          <button onClick={() => setOpen("about")} className="hidden rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary sm:block">
            আমাদের কথা
          </button>
          <button onClick={() => setOpen("volunteer")} className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary hover:bg-secondary">
            স্বেচ্ছাসেবক হোন
          </button>
          <button onClick={() => setOpen("donate")} className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft hover:opacity-90">
            দান করুন
          </button>
        </nav>
      </header>
      <main className="min-h-0 flex-1">{children}</main>
      <footer className="shrink-0 px-4 py-1.5 text-center text-[10px] text-muted-foreground sm:px-8">
        © ২০২৬ সবুজ আশা ফাউন্ডেশন · একটি গাছ, একটি আশা
      </footer>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-sm border-0 shadow-soft">
          {open === "donate" && <DonateForm done={() => setOpen(null)} />}
          {open === "volunteer" && <VolunteerForm done={() => setOpen(null)} />}
          {open === "about" && (
            <DialogHeader>
              <DialogTitle className="font-display">আমাদের কথা</DialogTitle>
              <DialogDescription className="leading-relaxed">
                সবুজ আশা ফাউন্ডেশন বাংলাদেশের জলবায়ু-ঝুঁকিপূর্ণ জেলাগুলোতে বৃক্ষরোপণ, নিরাপদ পানি ও শিক্ষা নিয়ে কাজ করে।
                প্রতিটি চারা স্থানীয় মানুষের হাতে রোপিত ও পরিচর্যা করা হয়।
              </DialogDescription>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const field = "w-full rounded-lg bg-secondary/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

function DonateForm({ done }: { done: () => void }) {
  const amounts = [100, 500, 1000, 5000];
  const [amount, setAmount] = useState(500);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success(`ধন্যবাদ! ৳${amount.toLocaleString("bn-BD")} দানের অনুরোধ গ্রহণ করা হয়েছে।`);
        done();
      }}
      className="space-y-3"
    >
      <DialogHeader>
        <DialogTitle className="font-display">একটি গাছ, একটি আশা</DialogTitle>
        <DialogDescription>৳১০০ তে একটি চারা রোপণ ও এক বছরের পরিচর্যা।</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-4 gap-1.5">
        {amounts.map((a) => (
          <button
            type="button"
            key={a}
            onClick={() => setAmount(a)}
            className={`rounded-lg py-2 text-sm font-semibold transition-colors ${a === amount ? "bg-primary text-primary-foreground" : "bg-secondary/60 hover:bg-secondary"}`}
          >
            ৳{a.toLocaleString("bn-BD")}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">≈ {(amount / 100).toLocaleString("bn-BD")}টি গাছ</p>
      <input required placeholder="আপনার নাম" className={field} />
      <input required type="tel" placeholder="মোবাইল নম্বর (বিকাশ/নগদ)" className={field} />
      <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">দান নিশ্চিত করুন</button>
    </form>
  );
}

function VolunteerForm({ done }: { done: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("ধন্যবাদ! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।");
        done();
      }}
      className="space-y-3"
    >
      <DialogHeader>
        <DialogTitle className="font-display">স্বেচ্ছাসেবক হোন</DialogTitle>
        <DialogDescription>আপনার এলাকায় বৃক্ষরোপণে আমাদের সাথে যুক্ত হোন।</DialogDescription>
      </DialogHeader>
      <input required placeholder="আপনার নাম" className={field} />
      <input required type="tel" placeholder="মোবাইল নম্বর" className={field} />
      <input required placeholder="জেলা / উপজেলা" className={field} />
      <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">নিবন্ধন করুন</button>
    </form>
  );
}
