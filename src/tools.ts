export type Goal = 'time' | 'notes' | 'tasks' | 'habits'
export type ToolId = 'toggl' | 'clockify' | 'rescuetime' | 'applenotes' | 'obsidian' | 'logseq' | 'notion' | 'things' | 'todoist' | 'linear' | 'clickup' | 'lunatask' | 'griply' | 'loop' | 'streaks' | 'habitica'

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
  e2e?: boolean // synced, but end-to-end encrypted
  pressure?: boolean // keeps score of every minute or slip (logs everything, punishes broken streaks)
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
    structure: 0.24, setup: 0.06, capture: 2, auto: 2, local: false, pressure: true, team: 1, free: false,
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
    goals: ['notes', 'tasks', 'habits'],
    tagline: 'Plain Markdown files on your disk, linked into a second brain.',
    platforms: 'Desktop, mobile',
    structure: 0.5, setup: 0.85, capture: 1, auto: 0, local: true, team: 1, free: true,
    use: ['Owning your data forever as plain files', 'Linking ideas, long-term knowledge', 'Habits in your daily notes with the Life Tracker plugin: heatmaps, streaks, weekly goals like “3 days a week”', 'Tinkerers: thousands of plugins'],
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
  lunatask: {
    name: 'Lunatask',
    goals: ['tasks', 'notes', 'habits'],
    tagline: 'Designed for ADHD brains: tasks that prioritise themselves, plus habits, journal and mood — end-to-end encrypted.',
    platforms: 'Windows, macOS, Linux, iOS, Android',
    structure: 0.5, setup: 0.42, capture: 2, auto: 0, local: false, e2e: true, team: 0, free: true,
    use: ['Automatic prioritisation bubbles the next task up, with a work-in-progress limit', 'Time blocking: drag tasks and habits onto your calendar', 'Habits, journal and mood next to your tasks', 'End-to-end encrypted: privacy without managing files'],
    avoid: ['Teams and shared projects', 'Wanting plain files you fully control', 'Many life areas on the free plan (limited to 2)'],
  },
  griply: {
    name: 'Griply',
    goals: ['tasks', 'habits'],
    tagline: 'Goal-first planner: every task and habit traces back to a goal and a life area.',
    platforms: 'Web, iOS',
    structure: 0.7, setup: 0.65, capture: 2, auto: 0, local: false, team: 0, free: true,
    use: ['Feeling busy but unsure it moves your goals', 'Goals → projects → tasks and habits, with progress charts', 'Plain-English quick add and time blocking'],
    avoid: ['Teams', 'Simple to-do lists — the goal layers are overhead', 'More than 2 goals on the free plan'],
  },
  loop: {
    name: 'Loop Habit Tracker',
    goals: ['habits'],
    tagline: 'Free, open source, no account. Habit strength forgives a missed day.',
    platforms: 'Android only',
    structure: 0.02, setup: 0.25, capture: 2, auto: 1, local: true, team: 0, free: true,
    use: ['Simple yes/no or numeric habits with reminders', 'A strength score instead of an all-or-nothing streak', 'Data stays on your phone'],
    avoid: ['iPhone users', 'Habits linked to tasks or goals'],
  },
  streaks: {
    name: 'Streaks',
    goals: ['habits'],
    tagline: 'Up to 24 habits; Apple Health ticks some off for you.',
    platforms: 'iPhone, iPad, Apple Watch, Mac · one-time purchase',
    structure: 0.86, setup: 0.14, capture: 2, auto: 2, local: false, pressure: true, team: 0, free: false,
    use: ['Steps, workouts, mindful minutes completed automatically', 'A focused, beautiful daily checklist', 'Apple Watch on your wrist as the reminder'],
    avoid: ['Android', 'Feeling crushed when a streak resets to zero'],
  },
  habitica: {
    name: 'Habitica',
    goals: ['habits'],
    tagline: 'Your habits as a role-playing game: earn gold, level up, fight bosses with friends.',
    platforms: 'Web, iOS, Android',
    structure: 0.3, setup: 0.72, capture: 1, auto: 1, local: false, pressure: true, team: 2, free: true,
    use: ['Rewards and novelty keep you coming back', 'Accountability: your party takes damage if you skip', 'Habits, dailies and to-dos together'],
    avoid: ['When missing a daily (and losing health) feels like punishment', 'Wanting a calm, minimal tracker'],
  },
}

export const TOOL_IDS = Object.keys(TOOLS) as ToolId[]

export const GOALS: Record<Goal, { name: string; color: string; question: string }> = {
  notes: { name: 'Notes', color: '#d95926', question: 'Where do I put what I know?' },
  tasks: { name: 'Tasks', color: '#199e70', question: 'What do I do next?' },
  habits: { name: 'Habits', color: '#cc5fa8', question: 'Am I actually doing it?' },
  time: { name: 'Time tracking', color: '#3987e5', question: 'Where did my hours go?' },
}

// A tool's colour on charts is its primary goal. Goal names always sit next to the colour, so it never carries meaning alone.
export const colorOf = (id: ToolId) => GOALS[TOOLS[id].goals[0]].color
