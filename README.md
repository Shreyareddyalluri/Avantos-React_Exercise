# Journey Builder — Prefill Configuration UI

A React (Next.js + TypeScript) application for configuring **prefill mappings across a DAG (Directed Acyclic Graph) of forms**.

This project focuses on **data flow, extensibility, and clean architecture**, rather than UI complexity.

---

## 🧠 Problem Summary

Each form in a workflow can prefill its fields using:

1. Direct dependencies (parent forms)
2. Transitive dependencies (ancestors in the DAG)
3. Global data sources

Users configure mappings such as:

Form D.email ← Form A.email

---

## 🚀 Getting Started

### Start backend

```bash
cd ../backend
npm install
npm start
```

Backend runs on: http://localhost:3000

---

### Start frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3001

---

## 🏗 Architecture Overview

```
src/
├── app/                # Next.js pages (UI orchestration)
├── components/         # Presentational UI
├── hooks/              # State + orchestration logic
├── lib/                # Pure DAG utilities
├── providers/          # Extensible data source system
└── types/              # Domain models
```

---

## 🔑 Key Design Decisions

### 1. DAG logic is pure and isolated

All graph traversal lives in:

src/lib/dag.ts

* No React dependencies
* Fully testable
* Reusable across environments

---

### 2. Provider Pattern for Data Sources

Each data source implements:

```ts
interface PrefillDataSource {
  id: string;
  name: string;
  getAvailableData(graph, targetNodeId): DataSourceGroup[];
}
```

This enables:

* Plug-and-play data sources
* No UI changes when adding new sources
* Clear separation of concerns

---

### 3. Registry-Based Extensibility

Data sources are registered centrally:

```ts
registerDataSource(new MyCustomSource());
```

No other parts of the system need to change.

---

### 4. State Management via Hooks

* useBlueprintGraph → fetches DAG
* usePrefillMappings → manages mappings
* useAvailablePrefillData → aggregates all sources

This keeps state simple and replaceable with Zustand/Redux if needed.

---

### 5. Component Responsibilities

| Component    | Responsibility              |
| ------------ | --------------------------- |
| FormList     | Select active form          |
| PrefillPanel | Display fields and mappings |
| PrefillModal | Select mapping source       |

---

## 🔗 Data Flow

Graph → DAG utilities → Providers → Hooks → UI

Each layer is independent and testable.

---

## 🧩 Prefill Mapping Model

```ts
type PrefillMapping = {
  sourceType: "form" | "global";
  sourceId: string;
  sourceName: string;
  fieldKey: string;
};
```

This model supports:

* Multiple data source types
* Future extensibility (e.g., transformations, constants)

---

## ➕ Adding a New Data Source

### Step 1: Create a provider

```ts
class CRMDataSource implements PrefillDataSource {
  id = "crm";
  name = "CRM Data";

  getAvailableData() {
    return [
      {
        sourceId: "crm",
        sourceName: "CRM Fields",
        sourceType: "global",
        fields: [
          { fieldKey: "customer_name", fieldLabel: "Customer Name" }
        ]
      }
    ];
  }
}
```

---

### Step 2: Register it

```ts
registerDataSource(new CRMDataSource());
```

That’s it. The new source automatically appears in the UI.

---

## 🧪 Testing Strategy

Tests focus on **core logic instead of UI**:

* DAG traversal (`dag.test.ts`)
* Data providers (`providers.test.ts`)

This ensures correctness of:

* Dependency resolution
* Data availability logic

---

## ⚖️ Tradeoffs

* Mappings are stored in-memory (no persistence layer)
* Assumes DAG validity from backend (no cycle validation enforced)
* No field-type compatibility validation
* No transformation support (e.g., formatting, concatenation)

---

## 🔮 Future Improvements

* Persist mappings via API
* Add transformation layer (computed fields)
* Validate field compatibility (type-safe mapping)
* Lazy-load large data sources
* Improve accessibility (keyboard navigation, ARIA roles)

---

## 🧰 Tech Stack

| Concern   | Choice      |
| --------- | ----------- |
| Framework | Next.js 14  |
| Language  | TypeScript  |
| State     | React Hooks |
| Styling   | CSS Modules |
| Testing   | Jest        |

---

## 🧠 Key Takeaway

This project demonstrates:

* Modeling data dependencies over a DAG
* Designing extensible systems using provider patterns
* Clean separation of concerns in a React application
