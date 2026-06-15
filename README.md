# Shipyard — Web Dashboard

> Engineering Operations & Intelligence Platform — Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Architecture

The web dashboard is the **Management Intelligence & Workspace** interface for Shipyard. It provides real-time visibility into engineering workflows, team performance, and GitHub activity.

```
Shipyard-Frontend/
├── app/                    → Next.js App Router (pages & layouts)
│   ├── (auth)/             → Auth-gated route group
│   │   ├── dashboard/      → Main intelligence dashboard
│   │   ├── workflows/      → Workflow state visualization
│   │   └── settings/       → Org & user settings
│   ├── (public)/           → Public routes
│   │   └── login/          → Authentication page
│   └── api/                → Next.js API routes (BFF layer)
├── components/             → React components
│   ├── ui/                 → Design system primitives (ui-kit)
│   ├── dashboard/          → Dashboard-specific components
│   ├── workflows/          → Workflow visualization
│   └── layout/             → Shell, Sidebar, Header
├── lib/                    → Utilities & API clients
│   ├── api/                → Backend API client functions
│   ├── hooks/              → Custom React hooks
│   └── utils/              → Helper functions
└── types/                  → TypeScript type definitions
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| State | React Server Components + hooks |

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © Shipyard Contributors
