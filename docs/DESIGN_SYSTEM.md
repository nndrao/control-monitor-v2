# Control Monitor v2 — Design System Reference

> This document is the single source of truth for building new UI components, forms, panels, and pages in the Control Monitor v2 application. AI agents and developers should follow these patterns exactly to ensure visual and behavioral consistency.

## Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v3.4.17 (class-based dark mode)
- **Data Grid**: AG-Grid Enterprise 35.0.0
- **Font**: Inter (400, 500, 600, 700) via `@fontsource/inter`
- **Icons**: Lucide React

---

## 1. Color System

All colors use HSL format via CSS custom properties. Reference them through Tailwind semantic classes — never use raw hex values except for the brand color.

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| Wells Fargo Red | `#d71e28` | Top navigation bar background only |

### Semantic Tokens

| Token | Light | Dark | Tailwind Class |
|-------|-------|------|----------------|
| Background | `hsl(0 0% 100%)` | `hsl(0 0% 10%)` | `bg-background` |
| Foreground | `hsl(30 5% 19%)` #37352f | `hsl(0 0% 87%)` | `text-foreground` |
| Card | `hsl(0 0% 100%)` | `hsl(0 0% 13%)` #202020 | `bg-card` |
| Muted | `hsl(40 10% 96%)` #f7f7f5 | `hsl(0 0% 15%)` #252525 | `bg-muted` |
| Muted Foreground | `hsl(30 3% 46%)` #787774 | `hsl(0 0% 60%)` | `text-muted-foreground` |
| Accent | `hsl(40 10% 94%)` #f1f1ef | `hsl(0 0% 18%)` | `bg-accent` |
| Border | `hsl(40 6% 90%)` #e9e9e7 | `hsl(0 0% 20%)` #333 | `border-border` |
| Primary | `hsl(30 5% 19%)` | `hsl(0 0% 87%)` | `bg-primary` / `text-primary` |
| Destructive | `hsl(0 84.2% 60.2%)` | `hsl(0 62.8% 50.6%)` | `bg-destructive` |
| Success | `hsl(152 69% 31%)` | `hsl(152 69% 40%)` | `text-success` |
| Warning | `hsl(45 93% 47%)` | `hsl(45 93% 47%)` | `text-warning` |
| Info | `hsl(217 91% 60%)` | `hsl(217 91% 65%)` | `text-info` |

### Status Colors

Used across badges, chips, dots, and indicators.

| Status | Dot Class | Text (Light) | Text (Dark) | Background |
|--------|-----------|-------------|-------------|------------|
| Overdue | `bg-red-500` | `text-red-600` | `text-red-400` | `bg-red-500/10` |
| Today | `bg-amber-500` | `text-amber-600` | `text-amber-400` | `bg-amber-500/10` |
| Upcoming | `bg-emerald-500` | `text-emerald-600` | `text-emerald-400` | `bg-emerald-500/10` |
| Completed | `bg-purple-500` | `text-purple-600` | `text-purple-400` | `bg-purple-500/10` |

### Badge Color Pattern

All soft-colored badges follow this pattern (replace `{color}` with `red`, `amber`, `emerald`, `blue`, `orange`, `purple`, `slate`):

```
bg-{color}-500/10 text-{color}-700 dark:text-{color}-400 border-{color}-500/20 dark:border-{color}-500/30
```

---

## 2. Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Scale

| Role | Class | Usage |
|------|-------|-------|
| App title | `text-sm font-semibold tracking-tight` | Top navigation bar app name |
| Page/section header | `text-[13px] font-semibold` | PageHeader title, panel headers |
| Body text | `text-xs` (12px) | General body content |
| UI labels | `text-[11px] font-medium` | Toolbar buttons, status chips, select triggers, filter labels |
| Micro labels | `text-[10px] font-medium` | Sidebar labels, small count badges |
| Count values | `text-[11px] font-bold tabular-nums` | Status chip counts |
| KPI values | `text-2xl font-bold tabular-nums` | Dashboard summary cards |

### Rules

- Primary labels: `text-[13px] font-semibold`
- All secondary UI (buttons, chips, labels, inputs): `text-[11px] font-medium`
- Counts and numbers always use `tabular-nums` for alignment
- Headings use `font-semibold tracking-tight`
- Never use `text-base` (16px) or larger for UI chrome elements

---

## 3. Spacing and Layout

### Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| lg | 6px | `rounded-lg` | Cards, dialogs |
| md | 4px | `rounded-md` | Inputs, buttons, dropdowns |
| sm | 2px | `rounded-sm` | Badges, sidebar items, checkboxes |
| Full | 50% | `rounded-full` | Dots, avatars, pill badges |

### Standard Heights

| Element | Height | Class |
|---------|--------|-------|
| Top navigation bar | 40px | `h-10` |
| Page header (second bar) | 40px | `h-10` |
| Tab list | 36px | `h-9` |
| Buttons (toolbar) | 28px | `h-7` |
| Input fields (toolbar) | 28px | `h-7` |
| Status chips | 24px | `h-6` |
| Badges | 24px | `h-6` |
| Checkboxes | 16px | `h-4 w-4` |
| Status dots | 8px | `w-2 h-2` |
| Icons (toolbar) | 14px | `h-3.5 w-3.5` |
| Icons (small) | 12px | `h-3 w-3` |

### Standard Gaps

| Context | Gap |
|---------|-----|
| Status chips row | `gap-4` |
| Toolbar button groups | `gap-2.5` |
| Button internal icon+text | `gap-1.5` |
| Sidebar nav items | `space-y-0.5` |
| Form fields stacked | `space-y-3` or `gap-3` |

### Panel Dimensions

| Panel | Width | Min | Max |
|-------|-------|-----|-----|
| Sidebar | 72px | — | — |
| Control Hierarchy Panel | 400px | — | — |
| Detail Panel (default) | 480px | 400px | viewport - 300px |

---

## 4. Component Patterns

### Buttons

Use the shadcn `<Button>` component. In toolbar context, always override to `h-7 text-[11px] font-medium`.

```tsx
// Primary action (filled)
<Button variant="default" size="sm" className="h-7 gap-1.5 text-[11px] font-medium px-3">
  <PlayCircle className="h-3.5 w-3.5" />
  Initiate Review
</Button>

// Secondary action (outline)
<Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px] font-medium px-2.5">
  <Filter className="h-3.5 w-3.5" />
  Filters
</Button>

// Ghost action (minimal)
<Button variant="ghost" size="sm" className="h-7 text-[11px] font-medium px-2.5 gap-1">
  Actions
  <ChevronDown className="h-3 w-3" />
</Button>

// Active/toggled state (for filter-type buttons)
<Button variant="outline" size="sm"
  className={cn('h-7 gap-1.5 text-[11px] font-medium px-2.5',
    isActive && 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
  )}>
```

**Button variants reference:**

| Variant | Class |
|---------|-------|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm` |
| `outline` | `border border-input bg-background hover:bg-accent hover:text-accent-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |

**Button sizes reference:**

| Size | Class |
|------|-------|
| `default` | `h-9 px-4 py-2 text-sm [&_svg]:size-4` |
| `sm` | `h-7 px-3 text-xs [&_svg]:size-3.5` |
| `lg` | `h-10 px-6 text-sm [&_svg]:size-4` |
| `icon` | `h-8 w-8 [&_svg]:size-4` |

### Badges

Use the shared badge components from `@/components/shared/badges.tsx`.

```tsx
// Status badge
<StatusBadge status={task.status} />    // Completed, In Progress, Pending

// Priority badge
<PriorityBadge priority={task.priority} />   // High, Medium, Low

// Due status badge
<DueStatusBadge dueStatus={task.dueStatus} />  // Overdue, Today, Upcoming
```

**Badge base pattern:**

```tsx
<Badge className="text-xs px-2.5 h-6 font-medium rounded-sm border bg-{color}-500/10 text-{color}-700 dark:text-{color}-400 border-{color}-500/20 dark:border-{color}-500/30">
```

### Status Chips (Header Indicators)

```tsx
<div className="flex items-center gap-4">
  {/* Each chip */}
  <div className="flex items-center gap-1.5 h-6">
    <div className="w-2 h-2 rounded-full bg-red-500" />
    <span className="text-[11px] text-muted-foreground font-medium">Outstanding</span>
    <span className="text-[11px] font-bold tabular-nums text-red-600 dark:text-red-400">5</span>
  </div>
</div>
```

### Search Input

```tsx
<div className="relative group">
  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
  <input
    className="w-full h-7 pl-7 pr-7 text-[11px] rounded-md transition-all
      bg-muted/50 border border-border/50 text-foreground
      placeholder:text-muted-foreground/70
      hover:border-border
      focus:bg-background focus:border-ring/40 focus:ring-1 focus:ring-ring/20 focus:outline-none"
    placeholder="Search tasks..."
  />
</div>
```

### Cards (KPI / Summary)

```tsx
<Card className="border-l-4 rounded-none rounded-r-lg border-l-emerald-500 hover:shadow-sm hover:bg-muted/30 transition-all duration-200">
  <CardContent className="p-4 space-y-3">
    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Label</p>
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-2xl font-bold tabular-nums text-foreground">125</span>
    </div>
  </CardContent>
</Card>
```

Accent color options: `border-l-emerald-500`, `border-l-blue-500`, `border-l-red-500`, `border-l-amber-500`, `border-l-purple-500`, `border-l-slate-500`.

---

## 5. Layout Patterns

### App Shell

```
┌──────────────── Top Bar (h-10, bg: #d71e28) ────────────────┐
│ Logo + App Name           │  Theme Toggle │ Notifications │ Avatar │
├──────┬───────────────────────────────────────────────────────┤
│      │  Page Header (h-10, bg-card, shadow)                  │
│ Side │  [Leading] ─── [Center] ─── [Trailing]                │
│ bar  ├───────────────────────────────────────────────────────┤
│ 72px │  Content Area (flex-1)                                 │
│      │                                                        │
│      │                                                        │
└──────┴───────────────────────────────────────────────────────┘
```

### Top Bar

```tsx
<div className="h-10 flex items-center justify-between px-4 flex-shrink-0"
     style={{ backgroundColor: '#d71e28' }}>
  {/* Left: app name */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-white tracking-tight">Control Monitor</span>
    <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white/90 font-medium">v2</span>
  </div>
  {/* Right: actions */}
  <div className="flex items-center gap-3">
    <button className="p-1.5 rounded-md hover:bg-white/15 text-white/80 hover:text-white transition-all duration-150">
      <Icon className="h-4 w-4" />
    </button>
  </div>
</div>
```

### Page Header (Second Bar)

```tsx
<div className="h-10 px-3 border-b border-border bg-card flex-shrink-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
  <div className="flex items-center h-full gap-3">
    {/* Left zone — buttons, title */}
    <div className="flex items-center gap-2.5 flex-shrink-0">
      {/* Filter button, divider, view name */}
      <div className="w-px h-4 bg-border" />
      <h1 className="text-[13px] font-semibold text-foreground whitespace-nowrap">View Name</h1>
    </div>
    {/* Center zone — stats */}
    <div className="flex-1 flex items-center justify-center min-w-0">
      <StatusChips />
    </div>
    {/* Right zone — search, actions */}
    <div className="flex items-center gap-2.5 flex-shrink-0">
      <SearchInput />
      <div className="w-px h-4 bg-border" />  {/* vertical separator */}
      <Button />
    </div>
  </div>
</div>
```

### Sidebar Navigation

```tsx
<nav className="w-[72px] bg-card border-r border-border flex flex-col flex-shrink-0">
  <div className="flex-1 py-2 px-1.5 space-y-0.5">
    {/* Nav item */}
    <div className={cn(
      "relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-sm cursor-pointer overflow-hidden transition-colors duration-150",
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
    )}>
      <Icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
      <span className={cn("text-[10px] font-medium text-center leading-tight truncate w-full px-0.5",
        isActive && "font-semibold text-primary"
      )}>Label</span>
    </div>
  </div>
</nav>
```

### Master-Detail Split

```tsx
<div className="flex-1 overflow-hidden relative">
  <div className="h-full w-full flex overflow-hidden">
    {/* Master (grid) */}
    <div className="flex-1 min-w-0 h-full overflow-hidden">
      <div className="h-full w-full p-3">
        <AgGridReact ... />
      </div>
    </div>

    {/* Detail panel */}
    <div className="h-full border-l border-border flex-shrink-0 relative bg-card overflow-hidden"
         style={{ width: panelWidth }}>
      <TaskDetailsPanel />
    </div>
  </div>
</div>
```

### Slide-Out Panel

```tsx
<div className={cn(
  "absolute top-3 left-3 z-20 w-[400px] bg-card border border-border rounded-lg flex flex-col overflow-hidden shadow-lg transition-all duration-200 ease-out",
  isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
)} style={{ maxHeight: 'calc(100% - 24px)' }}>
  {/* Header */}
  <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
        <Icon className="h-3 w-3 text-primary" />
      </div>
      <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Panel Title</h3>
    </div>
    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
      <X className="h-3.5 w-3.5" />
    </Button>
  </div>

  {/* Content */}
  <ScrollArea className="flex-1">
    {/* ... */}
  </ScrollArea>
</div>
```

---

## 6. Form Patterns

### Form Fields

All form inputs in toolbar/panel context use `h-7 text-[11px]`. Full-page forms use the default shadcn sizes (`h-10 text-sm`).

```tsx
// Compact form field (panels, toolbars)
<div className="space-y-1.5">
  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
    Field Label
  </label>
  <Select>
    <SelectTrigger className="h-7 text-[11px]">
      <SelectValue placeholder="Select..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem className="text-[11px]" value="opt1">Option 1</SelectItem>
    </SelectContent>
  </Select>
</div>

// Standard form field (full-page forms)
<div className="space-y-2">
  <Label className="text-sm font-medium">Field Label</Label>
  <Input className="h-10 text-sm" placeholder="Enter value..." />
</div>
```

### Section Headers (inside panels)

```tsx
<div className="flex items-center gap-1.5 mb-2">
  <Icon className="h-3 w-3 text-muted-foreground" />
  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
    Section Title
  </span>
</div>
```

### Form Layout (detail views)

```tsx
{/* Two-column key-value grid */}
<div className="grid grid-cols-[140px_1fr] gap-y-2 gap-x-3 text-xs">
  <span className="text-muted-foreground font-medium">Label</span>
  <span className="text-foreground">Value</span>
</div>
```

---

## 7. Tab Patterns

### Notion-Style Underline Tabs (main navigation)

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
  <TabsList className="flex bg-transparent border-b border-border !px-6 !py-0 h-9 gap-4 rounded-none w-full justify-start">
    <TabsTrigger value="tab1" className={cn(
      'text-xs font-medium border-b-2 border-transparent text-muted-foreground',
      'rounded-none px-0 py-2.5',
      'data-[state=active]:border-foreground data-[state=active]:text-foreground',
      'data-[state=active]:bg-transparent data-[state=active]:shadow-none',
      'hover:text-foreground transition-colors flex items-center gap-1.5'
    )}>
      <Icon className="h-3.5 w-3.5" />
      Tab Label
      <span className="ml-1 text-[10px] font-semibold text-muted-foreground">(3)</span>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="tab1" className="m-0 px-6 py-4">
    {/* content */}
  </TabsContent>
</Tabs>
```

### Sub-Tabs (inside cards)

```tsx
<TabsTrigger value="subtab" className="text-[11px] font-medium text-muted-foreground gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none h-7 px-2.5">
  <Icon size={11} />
  Sub Tab
</TabsTrigger>
```

### Pivot/Toggle Buttons (non-tab)

```tsx
<div className="flex gap-2 flex-wrap">
  <Button variant={isActive ? 'default' : 'outline'} size="sm"
    onClick={() => setActive(id)}>
    <Icon size={14} />
    <span>Mode Name</span>
  </Button>
</div>
```

---

## 8. AG Grid Configuration

### Theme

```tsx
import { themeQuartz } from 'ag-grid-community'

// Light
const lightTheme = themeQuartz.withParams({
  backgroundColor: '#fafaf9',
  oddRowBackgroundColor: '#f7f7f5',
  foregroundColor: '#37352f',
  borderColor: '#e9e9e7',
  accentColor: '#37352f',
  chromeBackgroundColor: '#ffffff',
  headerFontSize: 13,
  fontSize: 12,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  borderRadius: 4,
  wrapperBorderRadius: 8,
  spacing: 6,
  columnBorder: true,
})

// Dark
const darkTheme = themeQuartz.withParams({
  backgroundColor: '#191919',
  oddRowBackgroundColor: '#202020',
  foregroundColor: 'rgba(255,255,255,0.87)',
  borderColor: '#333333',
  accentColor: 'rgba(255,255,255,0.87)',
  chromeBackgroundColor: '#252525',
  headerFontSize: 13,
  fontSize: 12,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  borderRadius: 4,
  wrapperBorderRadius: 8,
  spacing: 6,
  columnBorder: true,
})
```

### Default Column Definition

```tsx
const defaultColDef = {
  sortable: true,
  resizable: true,
  filter: 'agTextColumnFilter',
  floatingFilter: true,
  flex: 1,
  minWidth: 100,
}
```

### Flex-Fill Layout for AG Grid

AG Grid requires its container to have concrete pixel dimensions. Use this pattern:

```tsx
{/* Outer div gets height from flex layout */}
<div className="flex-1 min-h-0 relative">
  {/* Inner div gives AG Grid concrete pixel dimensions */}
  <div className="absolute inset-0">
    <AgGridReact theme={gridTheme} ... />
  </div>
</div>
```

### Row Selection (Checkbox Only)

```tsx
rowSelection={{
  mode: 'multiRow',
  enableClickSelection: false,   // checkbox-only, no row-click selection
}}
```

### Filter Model Format

When programmatically setting filters, use `agTextColumnFilter` format:

```tsx
// Correct format for agTextColumnFilter
gridRef.current.api.setFilterModel({
  controlType: { type: 'equals', filter: 'Some Value' },
})

// WRONG — this is agSetColumnFilter format, do NOT use
// { values: ['Some Value'] }
```

---

## 9. Interaction Patterns

### Transitions

| Context | Duration | Class |
|---------|----------|-------|
| Default UI | 150ms | `transition-all duration-150` or `transition-colors duration-150` |
| Panel open/close | 200ms | `transition-all duration-200 ease-out` |
| Hover effects | 200ms | `transition-all duration-200` |

### Hover States

```
Buttons (ghost):    hover:bg-accent hover:text-accent-foreground
Buttons (outline):  hover:bg-accent hover:text-accent-foreground
Cards:              hover:shadow-sm hover:bg-muted/30
Nav items:          hover:bg-accent/50 hover:text-foreground
Top bar buttons:    hover:bg-white/15 hover:text-white
```

### Focus States

```
Inputs:   focus:bg-background focus:border-ring/40 focus:ring-1 focus:ring-ring/20 focus:outline-none
Buttons:  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Disabled States

```
Buttons:  disabled:pointer-events-none disabled:opacity-50
Inputs:   disabled:cursor-not-allowed disabled:opacity-50
```

---

## 10. Dialog and Dropdown Patterns

### Dialog

```tsx
<Dialog>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold">Title</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">Description</DialogDescription>
    </DialogHeader>
    {/* Body content */}
    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" className="h-7 text-[11px] font-medium px-2.5 gap-1">
      Actions <ChevronDown className="h-3 w-3" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
    <DropdownMenuLabel className="text-xs font-semibold">Label</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-xs gap-2">
      <Icon className="h-3.5 w-3.5" />
      Menu Item
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tooltip

```tsx
<Tooltip>
  <TooltipTrigger asChild>{/* trigger element */}</TooltipTrigger>
  <TooltipContent side="right" className="text-xs">
    Tooltip text
  </TooltipContent>
</Tooltip>
```

---

## 11. Critical CSS Rules

### Radix TabsContent + Tailwind `flex` Conflict

When a `TabsContent` needs `display: flex`, always add `data-[state=inactive]:hidden` to prevent the inactive tab from remaining visible:

```tsx
// WRONG — inactive tab stays visible because flex overrides hidden attribute
<TabsContent className="flex flex-col flex-1">

// CORRECT — inactive tab properly hidden
<TabsContent className="flex flex-col flex-1 data-[state=inactive]:hidden">
```

This is required because Radix uses the HTML `hidden` attribute (user-agent stylesheet) to hide inactive tabs, but Tailwind's `flex` class (author stylesheet) has higher CSS cascade priority and overrides it.

### Percentage Heights in Flex Containers

Never use `h-full` (`height: 100%`) on children of flex items whose height is flex-computed. Use `flex-1 min-h-0` instead:

```tsx
// WRONG — h-full can't resolve against flex-computed parent
<div className="flex-1 min-h-0">
  <div className="h-full">content</div>
</div>

// CORRECT — flex-1 participates in the flex chain
<div className="flex-1 min-h-0 flex flex-col">
  <div className="flex-1 min-h-0">content</div>
</div>
```

### ScrollArea vs Flex-Fill

`ScrollArea` prevents flex-fill behavior for its children. If a component needs to fill remaining vertical space (like AG Grid), place it **outside** the ScrollArea:

```tsx
<Tabs className="h-full flex flex-col">
  <TabsList />
  {/* This tab needs flex-fill — outside ScrollArea */}
  <TabsContent value="dashboard" className="flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden">
    <DashboardTab />
  </TabsContent>
  {/* These tabs need scrolling — inside ScrollArea */}
  <ScrollArea className={cn("flex-1", activeTab === 'dashboard' && "hidden")}>
    <TabsContent value="overview">...</TabsContent>
  </ScrollArea>
</Tabs>
```

---

## 12. File Organization

When creating new components, follow this structure:

```
src/components/
  {domain}/                    # Feature domain (tasks, dashboard, etc.)
    {Component}.tsx            # Main component
    columnDefs/                # AG Grid column definitions (if applicable)
      {name}Columns.ts
    tabs/                      # Tab content components (if applicable)
      {Name}Tab.tsx
  shared/                      # Reusable non-domain components
    {Component}.tsx
  ui/                          # shadcn/ui primitives (auto-generated)
    {component}.tsx
```

### Import Conventions

```tsx
// External libraries
import { useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'

// UI components (shadcn)
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Shared components
import { StatusChips } from '@/components/shared/StatusChips'

// Domain components
import { DashboardTab } from './tabs/DashboardTab'

// Hooks, contexts, utils
import { useAppContext } from '@/contexts/AppContext'
import { getAgGridTheme } from '@/themes/agGridTheme'
import { cn } from '@/lib/utils'

// Types
import type { Task } from '@/hooks/useTaskData'
```

### Utility: `cn()` helper

Always use `cn()` from `@/lib/utils` for conditional class merging. It combines `clsx` and `tailwind-merge`:

```tsx
import { cn } from '@/lib/utils'

className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}
```
