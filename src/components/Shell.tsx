import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { NGO } from "@/data/areas";

export type Crumb = { label: string; onClick?: () => void };

export function Shell({ children, crumbs = [] }: { children: ReactNode; crumbs?: Crumb[] }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 sm:px-8">
        <button onClick={crumbs[0]?.onClick} className="flex min-w-0 items-center gap-2 text-left">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-sm text-primary-foreground">🌱</span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold text-primary sm:text-base">{NGO.name}</span>
            <span className="block truncate text-[10px] text-muted-foreground">{NGO.tagline}</span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <Link to="/messages" className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            নেতৃত্বের বার্তা
          </Link>
          <span className="hidden rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold text-secondary-foreground md:block">
            ✓ {NGO.reg}
          </span>
        </div>
      </header>
      {crumbs.length > 1 && (
        <nav aria-label="অবস্থান" className="flex shrink-0 items-center gap-1 overflow-x-auto px-4 pb-2 text-[11px] whitespace-nowrap sm:px-8">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground/50">›</span>}
                {last ? (
                  <span className="font-semibold text-foreground">{c.label}</span>
                ) : (
                  <button onClick={c.onClick} className="rounded-full px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary">
                    {c.label}
                  </button>
                )}
              </span>
            );
          })}
        </nav>
      )}
      <main className="min-h-0 flex-1">{children}</main>
      <footer className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 px-4 py-1.5 text-center text-[10px] text-muted-foreground sm:px-8">
        <span>© ২০২৬ {NGO.name}</span>
        <span className="hidden sm:inline">{NGO.email}</span>
        <span className="hidden sm:inline">{NGO.phone}</span>
      </footer>
    </div>
  );
}
