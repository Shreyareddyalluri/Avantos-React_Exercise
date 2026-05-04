# Avantos React Exercise

This repository is split into two independent applications:

- `frontend/`: Next.js + TypeScript app (runs on `http://localhost:3001`)
- `backend/`: Node mock API server (runs on `http://localhost:3000`)

## Folder Structure

```
.
├── backend/
│   ├── graph.json
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── next.config.js
└── package.json
```

## Run From Root

```bash
npm run install:all
npm run dev
```

## Run Separately

```bash
# Terminal 1
cd backend
npm install
npm start

# Terminal 2
cd frontend
npm install
npm run dev
```

## Notes

- Frontend API base URL is configured with `NEXT_PUBLIC_API_URL`.
- If not set, frontend defaults to `http://localhost:3000`.
