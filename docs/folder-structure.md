# Control Monitor v2 — Folder Structure

## Tech Stack

React 18 + TypeScript + Vite, shadcn/ui (Radix primitives), AG-Grid Enterprise 35, Tailwind CSS v3.4.17, Inter font.

## Root Directory

```
control-monitor-v2/
├── index.html                  # Vite entry HTML
├── vite.config.ts              # Vite configuration with path aliases (@/)
├── tailwind.config.js          # Tailwind theme extensions and custom colors
├── tsconfig.json               # TypeScript project references
├── tsconfig.app.json           # App-level TypeScript config
├── tsconfig.node.json          # Node-level TypeScript config
├── postcss.config.js           # PostCSS with Tailwind and Autoprefixer
├── eslint.config.js            # ESLint flat config
├── package.json                # Dependencies and scripts
├── docs/                       # Project documentation
├── dist/                       # Production build output
├── public/                     # Static assets
└── src/                        # Application source code
```

## Source Directory (`src/`)

```
src/
├── main.tsx                    # React entry point — loads Inter font, renders App
├── App.tsx                     # Root component — HashRouter, AppProvider, routes
├── index.css                   # Global CSS — Tailwind directives, design tokens, dark mode
├── vite-env.d.ts               # Vite type declarations
│
├── components/
│   ├── layout/                 # App shell and navigation
│   ├── tasks/                  # Task management (main feature)
│   ├── dashboard/              # Dashboard-specific components
│   ├── shared/                 # Reusable UI components
│   └── ui/                     # shadcn/ui primitives (auto-generated)
│
├── contexts/                   # React Context providers
├── hooks/                      # Custom React hooks
├── themes/                     # AG-Grid theme configuration
├── constants/                  # Shared constants
├── types/                      # TypeScript type definitions
├── utils/                      # Utility functions
├── mockData/                   # Mock data generators and fixtures
└── lib/                        # Low-level utilities (cn helper)
```

## Components

### `components/layout/` — App Shell

```
layout/
├── AppLayout.tsx               # Main layout — top nav bar (Wells Fargo red), theme toggle,
│                               #   notifications, user avatar, Sidebar + page content
├── PageHeader.tsx              # Second header bar — configurable left/center/right zones,
│                               #   fixed h-10, subtle shadow, used by all views
└── Sidebar.tsx                 # 72px icon-rail sidebar — stacked nav icons with labels,
                                #   active state highlight, tooltips, collapsible
```

### `components/tasks/` — Task Management (Core Feature)

```
tasks/
├── TaskManager.tsx             # Master-detail view — AG Grid task list, Initiate Review
│                               #   button, search, filters toggle, control hierarchy panel,
│                               #   resizable detail panel, URL-based hierarchy filtering
│
├── TaskDetailsPanel.tsx        # Detail panel container — task header with title, status
│                               #   badges (priority/due status), control type, due date
│
├── TaskDetailTabs.tsx          # Tab navigation — Dashboard (conditional), Overview, Notes,
│                               #   Files, Additional Info; controlled tabs with count badges;
│                               #   Dashboard tab outside ScrollArea for flex-fill layout
│
├── ControlHierarchyPanel.tsx   # Slide-out filter panel — 2-level tree grid showing
│                               #   ControlType → ControlName with due status count columns;
│                               #   clicking a row filters the main task grid via URL params
│
├── StatusSummary.tsx           # Status bar — task counts by due status (overdue, today,
│                               #   upcoming, completed) displayed as colored chips
│
├── TaskFilters.tsx             # View dropdown — switches between All, Assigned, My Work, etc.
│
├── columnDefs.ts               # AG Grid column definitions — all task columns with
│                               #   agTextColumnFilter, floating filters, visibility config
│
└── tabs/                       # Tab content panels
    ├── OverviewTab.tsx         # Details section (metadata, timeline, people) + Control
    │                           #   Instructions section, separated by horizontal rule
    ├── DashboardTab.tsx        # Full metrics dashboard — summary cards, monthly drill-down
    │                           #   AG Grid with 5 pivot modes (Employees/Metrics/Region/
    │                           #   Legal Entity/Business), offender analysis sub-tab
    ├── NotesTab.tsx            # Notes list — author avatars, timestamps, content
    ├── FilesTab.tsx            # Files list — color-coded icons, metadata, hover actions
    └── AdditionalInfoTab.tsx   # AG Grid table — additional info rows (trader alerts, etc.)
```

### `components/dashboard/` — Dashboard Sub-Components

```
dashboard/
├── SummaryCards.tsx             # KPI cards row — Employees, Breaches, Potential, Period
│                               #   with colored left accent bars
├── OffenderAnalysisCard.tsx    # Repeat offenders grid — toggle between By Metric and
│                               #   By Employee views, AG Grid with footer totals
└── columnDefs/
    ├── metricsGridColumns.ts   # Dynamic column generator for metrics pivot grid —
    │                           #   auto-generates monthly columns per quarter with
    │                           #   grouping by employee/metric/region/legal/business
    └── offenderAnalysisColumns.ts  # Column definitions for offender grids —
                                    #   metric-grouped and employee-grouped views
```

### `components/shared/` — Reusable Components

```
shared/
├── KPICard.tsx                 # Minimal stat card — accent bar, label, value, trend indicator
├── SearchInput.tsx             # Toolbar search — icon, clear button, h-7, text-[11px]
├── StatusChips.tsx             # Inline status chips — colored dot + label + bold count
└── badges.tsx                  # Memoized Notion-style badges — status, priority, due status
                                #   with soft colors and dark mode support
```

### `components/ui/` — shadcn/ui Primitives

Auto-generated Radix-based components. Key ones used by the app include: `button`, `badge`, `card`, `tabs`, `scroll-area`, `select`, `tooltip`, `dropdown-menu`, `dialog`, `separator`, `checkbox`.

## State Management

### `contexts/`

```
contexts/
└── AppContext.tsx               # App-wide context — userId, userName, theme (light/dark),
                                 #   useMockData flag, theme toggle function
```

### `hooks/`

```
hooks/
├── useTaskData.ts              # Fetches task list — reads from mock JSON or REST API
│                               #   based on useMockData flag; returns tasks, loading, error
├── useTaskDetails.ts           # Manages detail panel — selected task state, loads details
│                               #   synchronously from mock generator, handles open/close
└── useResizable.ts             # Panel resize — mouse/touch drag logic with min/max
                                #   width constraints for the detail panel splitter
```

## Theming and Styling

### `themes/`

```
themes/
└── agGridTheme.ts              # AG Grid theme — Quartz base with Notion-inspired colors
                                #   for light and dark modes (borders, backgrounds, fonts)
```

### `constants/`

```
constants/
└── statusColors.ts             # Single source of truth for all status colors — due status
                                #   (overdue/today/upcoming/completed), priority levels,
                                #   control statuses; provides Tailwind class mappings
```

### `index.css`

Global CSS with Tailwind directives, CSS custom properties for light/dark themes (HSL-based color tokens), and base typography using Inter font family.

## Types

```
types/
├── task-details.types.ts       # TaskDetails, TaskNote, TaskFile, AdditionalInfoRow,
│                               #   ControlInstruction (nested sections with items)
└── metrics.ts                  # RawMetricScoringItem, TransformedMetricData,
                                #   OffenderGroup, SummaryStats, MetricsDataObject
```

## Utilities

```
utils/
├── controlInstructions.ts      # Deterministic control instruction generator — maps
│                               #   control categories to structured instruction sets
└── metricsDataTransform.ts     # Data transforms — groupOffendersByMetric,
                                #   groupOffendersByEmployee, calculateSummaryStats,
                                #   transformMetricScoringData
```

## Mock Data

```
mockData/
├── tasks.json                  # Static JSON fixture — array of task objects with all
│                               #   fields (id, title, status, priority, controlType, etc.)
├── taskDetailsGenerator.ts     # Deterministic generator — creates notes, files,
│                               #   additional info rows using seeded random
├── metrics.ts                  # Mock metrics data generator — creates employee scoring
│                               #   data with configurable seed for reproducibility
└── seededRandom.ts             # Seeded PRNG — ensures same seed produces identical
                                #   random sequences across renders
```

## Data Flow

```
App.tsx
 └─ AppLayout (shell)
     └─ TaskManager (route: /tasks/:filterType)
         ├─ useTaskData() → fetches task list
         ├─ AG Grid (master list)
         ├─ ControlHierarchyPanel (filters via URL params)
         └─ TaskDetailsPanel
             ├─ useTaskDetails() → generates detail data
             └─ TaskDetailTabs
                 ├─ OverviewTab (static content)
                 ├─ DashboardTab (metrics + AG Grids)
                 │   ├─ SummaryCards
                 │   ├─ Metrics Pivot Grid (5 modes)
                 │   └─ OffenderAnalysisCard
                 ├─ NotesTab
                 ├─ FilesTab
                 └─ AdditionalInfoTab (AG Grid)
```

## Key Architecture Decisions

- **Routing**: HashRouter with URL query params for hierarchy filtering (`?controlType=X&controlName=Y`)
- **AG Grid Filter Model**: Uses `agTextColumnFilter` with `{ type: 'equals', filter: value }` format throughout
- **AG Grid Row Selection**: Object config with `enableClickSelection: false` for checkbox-only selection
- **Flex-Fill Pattern for AG Grid**: Uses `relative` parent + `absolute inset-0` child to give AG Grid concrete pixel dimensions within flex layouts
- **Radix TabsContent + Tailwind Fix**: All `TabsContent` with `flex` class include `data-[state=inactive]:hidden` to prevent CSS specificity conflict with Radix's `hidden` attribute
- **Typography Scale**: `text-[13px]` for primary labels, `text-[11px]` for secondary UI, `h-7` for all interactive elements
- **Theme**: Wells Fargo brand red (`#d71e28`) on top bar, Notion-inspired neutral palette for the rest
