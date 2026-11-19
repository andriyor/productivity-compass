export type Goal = 'time' | 'notes' | 'tasks'
export type ToolId = 'toggl' | 'clockify' | 'rescuetime' | 'applenotes' | 'obsidian' | 'logseq' | 'notion' | 'things' | 'todoist' | 'linear' | 'clickup'

export type Tool = {
  name: string
  goals: Goal[]
  tagline: string
  platforms: string
  // 0..1 position on the Landscape map
  structure: number // freeform → structured
  setup: number // works out of the box → you build your own system
  capture: 0 | 1 | 2 // how fast a thought or timer gets in: slow · ok · instant
  auto: 0 | 1 | 2 // manual · reminders / idle detection · fully automatic
  local: boolean // data lives on your device as files
  team: 0 | 1 | 2 | 3 // sharing & collaboration
  free: boolean // usable long-term without paying
  use: string[]
  avoid: string[]
}

// shortcut: facts as of late 2026 from memory; re-check pricing/features before relying on them.
export const TOOLS: Record<ToolId, Tool> = {
  toggl: {
    name: 'Toggl Track',
    goals: ['time'],
    tagline: 'One-click timer with gentle nudges when you forget it.',
    platforms: 'Web, desktop, mobile, browser extension',
    structure: 0.36, setup: 0.22, capture: 2, auto: 1, local: false, team: 2, free: true,
    use: ['Knowing where your hours actually go', 'Idle detection and “start a timer?” reminders', 'Freelancers billing a few clients'],
    avoid: ['Fully passive tracking — you still press start', 'Big teams on a zero budget (free tier is small)'],
  },
  clockify: {
    name: 'Clockify',
    goals: ['time'],
    tagline: 'Timesheets for the whole team, free for unlimited users.',
    platforms: 'Web, desktop, mobile, browser extension',
    structure: 0.74, setup: 0.42, capture: 1, auto: 1, local: false, team: 3, free: true,
    use: ['Teams that need timesheets without a per-seat bill', 'Approvals, projects, billable rates'],
    avoid: ['Solo users who just want a calm timer — more UI than you need'],
  },
  rescuetime: {
    name: 'RescueTime',
    goals: ['time'],
    tagline: 'Tracks apps and sites in the background. You do nothing.',
    platforms: 'Desktop, mobile',
    structure: 0.24, setup: 0.06, capture: 2, auto: 2, local: false, team: 1, free: false,
    use: ['You always forget timers', 'Seeing distraction patterns honestly', 'Focus sessions that block distracting sites'],
    avoid: ['Billing clients by task', 'Feeling watched — the data can feed anxiety'],
  },
  applenotes: {
    name: 'Apple Notes',
    goals: ['notes'],
    tagline: 'Already on your phone. Open, type, done.',
    platforms: 'Apple devices only (web via iCloud)',
    structure: 0.1, setup: 0.05, capture: 2, auto: 0, local: false, team: 1, free: true,
    use: ['Catching thoughts before they vanish', 'Zero decisions, zero setup', 'Quick shared lists with family'],
    avoid: ['Linking ideas into a knowledge base', 'Windows / Android users'],
  },
  obsidian: {
    name: 'Obsidian',
    goals: ['notes', 'tasks'],
    tagline: 'Plain Markdown files on your disk, linked into a second brain.',
    platforms: 'Desktop, mobile',
    structure: 0.5, setup: 0.85, capture: 1, auto: 0, local: true, team: 1, free: true,
    use: ['Owning your data forever as plain files', 'Linking ideas, long-term knowledge', 'Tinkerers: thousands of plugins'],
    avoid: ['If configuring becomes the work instead of the work', 'Real-time team editing'],
  },
  logseq: {
    name: 'Logseq',
    goals: ['notes', 'tasks'],
    tagline: 'Opens on today’s page. Just write bullets; links and todos come later.',
    platforms: 'Desktop, mobile',
    structure: 0.3, setup: 0.5, capture: 2, auto: 0, local: true, team: 0, free: true,
    use: ['A daily journal with no “where does this go?” decision', 'Local, open-source, private', 'Outliner thinkers'],
    avoid: ['Teams', 'Long polished documents'],
  },
  notion: {
    name: 'Notion',
    goals: ['notes', 'tasks'],
    tagline: 'Docs, wikis and databases in one shared workspace.',
    platforms: 'Web, desktop, mobile',
    structure: 0.85, setup: 0.9, capture: 1, auto: 0, local: false, team: 3, free: true,
    use: ['Team wikis and shared docs', 'Everything-in-one-place dashboards', 'Projects as databases with views'],
    avoid: ['Blank-page paralysis: endless layout options', 'Offline-first or privacy-first needs'],
  },
  things: {
    name: 'Things 3',
    goals: ['tasks'],
    tagline: 'Opinionated, beautiful to-dos: Today, Upcoming, Someday.',
    platforms: 'Apple devices only · one-time purchase',
    structure: 0.5, setup: 0.1, capture: 2, auto: 0, local: false, team: 0, free: false,
    use: ['Calm, decided-for-you workflow', 'Quick entry from anywhere on Apple devices'],
    avoid: ['Shared projects with other people', 'Windows / Android'],
  },
  todoist: {
    name: 'Todoist',
    goals: ['tasks'],
    tagline: '“Pay rent every 1st” — type it, it’s scheduled.',
    platforms: 'Every platform, plus integrations',
    structure: 0.66, setup: 0.22, capture: 2, auto: 0, local: false, team: 2, free: true,
    use: ['Natural-language quick add', 'Recurring tasks and reminders', 'Small shared projects'],
    avoid: ['Engineering issue tracking', 'Long-form notes'],
  },
  linear: {
    name: 'Linear',
    goals: ['tasks'],
    tagline: 'Fast, opinionated issue tracking for product teams.',
    platforms: 'Web, desktop, mobile',
    structure: 0.92, setup: 0.55, capture: 1, auto: 0, local: false, team: 3, free: true,
    use: ['Sprints, cycles, roadmaps', 'Engineering and product teams'],
    avoid: ['Personal life to-dos', 'Non-software teams'],
  },
  clickup: {
    name: 'ClickUp',
    goals: ['tasks', 'time'],
    tagline: 'Tasks, docs and time tracking in one heavily configurable workspace.',
    platforms: 'Web, desktop, mobile, browser extension',
    structure: 0.97, setup: 0.78, capture: 1, auto: 0, local: false, team: 3, free: true,
    use: ['Teams that want tasks, docs and time in one tool', 'Many views: list, board, Gantt, calendar', 'Agencies tracking time against client tasks'],
    avoid: ['Anyone who freezes at options — it is famously dense', 'Quick personal to-dos'],
  },
}

export const TOOL_IDS = Object.keys(TOOLS) as ToolId[]

export const GOALS: Record<Goal, { name: string; color: string; question: string }> = {
  time: { name: 'Time tracking', color: '#3987e5', question: 'Where did my hours go?' },
  notes: { name: 'Notes', color: '#d95926', question: 'Where do I put what I know?' },
  tasks: { name: 'Tasks', color: '#199e70', question: 'What do I do next?' },
}

// A tool's colour on charts is its primary goal (validated 3-slot categorical palette).
export const colorOf = (id: ToolId) => GOALS[TOOLS[id].goals[0]].color
