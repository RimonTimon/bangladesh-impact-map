<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Every page renders inside `src/components/Shell.tsx` (fixed-height, no page scroll, logo header + breadcrumbs). All data and helpers live in `src/data/areas.ts`; page views in `src/components/Views.tsx`; map navigation state in `src/routes/index.tsx`; the leadership messages page is `src/routes/messages.tsx` — keep this minimal file layout. Hierarchy: district → upazila → union → gram, or district → city corporation → ward so layout stays consistent.
