Read `AGENTS.md` before starting.

We're adding the design system and UI primitive component.

Install and configure `shadcn/ui`.

Add this shadcn component:
- Buttons
- Card
- Dialog
- Input
- Tabs
- TextArea
- ScrollArea

Do not modify the generated `components/UI/*` files after installation.

Also install `lucide-react`.

Create `lib/utils.ts` with a reusable `cn()`  helper for merging Tailwinds CSS.

Ensure all components match the existing dark theme in `globals.css`.

### Check when done

- All components import without errors
- `cn()` works properly
- No default light styling appears
