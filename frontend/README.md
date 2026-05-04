# Journey Builder — Prefill Configuration UI

A Next.js + TypeScript application for viewing and editing prefill mappings in a DAG of forms.

## Quick Start

### 1. Start the backend server

```bash
cd ../backend
npm install
npm start
# Server runs on http://localhost:3000
```

### 2. Start the frontend

```bash
cd ../frontend
npm install
npm run dev
# App runs on http://localhost:3001
```

> By default the app fetches from `http://localhost:3000`. To change this, create a `.env.local` file:
> ```
> NEXT_PUBLIC_API_URL=http://localhost:3000
> ```

### 3. Run tests

```bash
npm test
```

---

## Architecture Overview

```
src/
├── app/                        # Next.js App Router pages
├── components/
│   ├── FormList/               # Left sidebar — renders all forms
│   ├── PrefillPanel/           # Right panel — shows fields & their mappings
│   └── PrefillModal/           # Modal — select a data element to map
├── hooks/
│   ├── useBlueprintGraph.ts    # Fetches the DAG from the API
│   ├── usePrefillMappings.ts   # Manages mapping state (set/clear/get)
│   └── useAvailablePrefillData.ts  # Aggregates all data sources
├── lib/
│   ├── dag.ts                  # Pure DAG traversal functions
│   └── __tests__/dag.test.ts   # Unit tests for DAG logic
├── providers/                  # ⭐ Extensible data source system
│   ├── PrefillDataSource.ts    # Interface contract
│   ├── DirectDependencySource.ts
│   ├── TransitiveDependencySource.ts
│   ├── GlobalDataSource.ts
│   ├── registry.ts             # Single registration point
│   └── __tests__/providers.test.ts
└── types/
    └── index.ts                # All TypeScript types
```

### Key design decisions

1. **DAG logic is pure functions** (`lib/dag.ts`) — no React, no side effects, easily testable. The functions take a graph and a node ID and return results. This separation means the traversal can be reused outside React if needed.

2. **Provider pattern for data sources** — see next section.

3. **State management via hooks** — `usePrefillMappings` keeps it simple with `useState`. For production scale, this could be swapped for Zustand or context without changing components.

4. **Component boundaries** — each component has a single responsibility and receives data via props. The page orchestrates the data flow.

---

## How to Extend with New Data Sources

The prefill system uses a **provider pattern**. Each data source implements a simple interface:

```typescript
interface PrefillDataSource {
  readonly id: string;
  readonly name: string;
  getAvailableData(
    graph: BlueprintGraph,
    targetNodeId: string
  ): DataSourceGroup[];
}
```

### Adding a new data source (2 steps)

**Step 1:** Create a new file in `src/providers/`:

```typescript
// src/providers/CRMDataSource.ts
import { PrefillDataSource } from "./PrefillDataSource";

export class CRMDataSource implements PrefillDataSource {
  readonly id = "crm-data";
  readonly name = "CRM Data";

  getAvailableData(graph, targetNodeId) {
    return [{
      sourceId: "crm",
      sourceName: "CRM Fields",
      sourceType: "global",
      fields: [
        { fieldKey: "customer_name", fieldLabel: "Customer Name" },
        { fieldKey: "account_id", fieldLabel: "Account ID" },
      ],
    }];
  }
}
```

**Step 2:** Register it in `src/providers/registry.ts`:

```typescript
import { CRMDataSource } from "./CRMDataSource";

const dataSources: PrefillDataSource[] = [
  new DirectDependencySource(),
  new TransitiveDependencySource(),
  new GlobalDataSource(),
  new CRMDataSource(),  // ← add this line
];
```

**That's it.** No other code changes. The new source automatically appears in the modal for all forms.

### Removing a data source

Delete (or comment out) its line in `registry.ts`. The UI adapts automatically.

---

## Testing

Tests cover the two most critical layers:

- **`src/lib/__tests__/dag.test.ts`** — DAG traversal: direct deps, transitive deps, field extraction, edge cases (root nodes, deep chains)
- **`src/providers/__tests__/providers.test.ts`** — Each provider returns correct data for different positions in the graph

Run with:
```bash
npm test                # single run
npm run test:watch      # watch mode
npm run test:coverage   # with coverage report
```

---

## Tech Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Next.js 14 (App Router) | Full-stack capability, SSR-ready |
| Language | TypeScript (strict) | Type safety across API ↔ UI boundary |
| Styling | CSS Modules | Scoped styles, zero runtime, no config |
| Testing | Jest + ts-jest | Standard, fast, works with TS paths |
| State | React hooks | Minimal overhead for this scope |
