# L&L Marketing CRM: frontend

Next.js 14 (App Router) + TypeScript. Runs on sample data held in `lib/store.tsx`; no backend yet.

    npm install
    npm run dev      # http://localhost:3000

## Connecting the FastAPI backend later
All data access goes through the actions in `lib/store.tsx`. Replace each with an API call:

| Store action | Backend route                 |
|--------------|-------------------------------|
| addLead      | POST /leads                   |
| setStage     | PATCH /leads/{id}             |
| logAct       | POST /leads/{id}/activities   |
| scheduleDemo | POST /leads/{id}/demos        |
| markAtt      | PATCH /demos/{id}             |
| pay          | POST /payments                |
| role switch  | replace with /auth/login      |

Planned next: Tailwind + shadcn/ui, TanStack Query, Recharts for reports.
