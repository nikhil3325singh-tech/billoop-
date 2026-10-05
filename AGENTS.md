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

- App data (inventory, quotes, invoices, company template incl. images) lives in browser localStorage via src/lib/store.tsx — no backend yet; swap the provider if Cloud is added.
- PDF (jspdf + autotable) and Word (docx) exports are generated client-side in src/lib/export.ts with dynamic imports to stay SSR-safe.
