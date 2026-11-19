import { useState } from 'react'
import { ToolIcon } from '../ToolIcon.tsx'
import { GOALS, TOOL_IDS, TOOLS, type Goal, type ToolId } from '../tools.ts'

type Fit = 0 | 1 | 2 | 3
// Scores keyed by tool; a missing tool means "—" (doesn't apply).
type Row = { s: string; fit: Partial<Record<ToolId, Fit>>; why: string }

const ROW_GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: 'How your brain works (solo)',
    rows: [
      { s: 'I forget to start the timer', fit: { toggl: 2, clockify: 1, rescuetime: 3, clickup: 1 }, why: 'RescueTime needs no remembering at all; Toggl nudges you when it notices activity with no timer running.' },
      { s: 'I lose thoughts before I write them down', fit: { applenotes: 3, obsidian: 1, logseq: 3, notion: 1, things: 3, todoist: 3, linear: 1, clickup: 1, lunatask: 2, griply: 2, habitica: 1 }, why: 'Instant capture wins: Apple Notes, Logseq’s daily page, Things / Todoist quick add. Sort it later — or never.' },
      { s: 'Too many options freeze me', fit: { toggl: 3, clockify: 2, rescuetime: 3, applenotes: 3, obsidian: 1, logseq: 2, things: 3, todoist: 3, linear: 2, lunatask: 2, griply: 1, loop: 3, streaks: 3, habitica: 1 }, why: 'Opinionated tools decide the structure for you. Notion’s blank page is the opposite.' },
      { s: 'I build systems instead of doing the work', fit: { toggl: 3, clockify: 2, rescuetime: 3, applenotes: 3, obsidian: 1, logseq: 2, things: 3, todoist: 2, linear: 2, lunatask: 2, griply: 1, loop: 3, streaks: 3, habitica: 1 }, why: 'If tweaking feels productive but isn’t, pick a tool with little to tweak. Obsidian and Notion are bottomless.' },
      { s: 'Tracking every minute makes me anxious', fit: { toggl: 2, clockify: 2, clickup: 1 }, why: 'Track only what you choose to start. Automatic logs of every app can turn into a scorecard you dread.' },
      { s: 'I’m busy, but not sure it moves my goals', fit: { toggl: 1, rescuetime: 1, obsidian: 1, logseq: 1, notion: 2, things: 1, todoist: 1, clickup: 2, lunatask: 2, griply: 3, habitica: 1 }, why: 'Griply links every task and habit to a goal and life area, so you see what actually moves you forward. Notion or ClickUp can do it if you build the system yourself.' },
      { s: 'I feel calmer with everything in one place', fit: { toggl: 1, clockify: 1, applenotes: 1, obsidian: 3, logseq: 2, notion: 3, things: 2, todoist: 2, linear: 1, clickup: 3, lunatask: 3, griply: 2, habitica: 2 }, why: 'Notion or Obsidian can hold notes, tasks and dashboards together — worth the setup if it lowers the mental load.' },
      { s: 'I worry about where my data goes', fit: { toggl: 1, clockify: 1, applenotes: 2, obsidian: 3, logseq: 3, things: 2, todoist: 1, lunatask: 3, griply: 1, loop: 3, streaks: 2 }, why: 'Obsidian and Logseq keep plain files on your disk, Loop keeps habits on your phone with no account; Lunatask encrypts end to end so even they can’t read it.' },
    ],
  },
  {
    title: 'Building habits',
    rows: [
      { s: 'A broken streak makes me feel guilty or quit', fit: { obsidian: 2, todoist: 1, lunatask: 2, griply: 2, loop: 3, streaks: 1 }, why: 'Loop scores habit strength, so a missed day dents it instead of wiping it out; Obsidian’s Life Tracker plugin can set weekly goals like “3 days a week”. Streak counters reset to zero; Habitica even takes your health.' },
      { s: 'Points, levels and rewards keep me going', fit: { obsidian: 1, todoist: 1, lunatask: 1, griply: 1, streaks: 1, habitica: 3 }, why: 'Habitica turns habits into a role-playing game with friends. Novelty and rewards help many ADHD brains — plan for the day the novelty wears off.' },
      { s: 'I want habits next to my tasks and goals', fit: { obsidian: 2, notion: 1, todoist: 1, lunatask: 3, griply: 3, habitica: 2 }, why: 'Lunatask and Griply put habits beside tasks (and goals, in Griply), so one app is the whole day. In Obsidian, habits live as properties in the same daily note as your journal and tasks.' },
      { s: 'Tick habits off automatically (steps, workouts)', fit: { streaks: 3 }, why: 'Streaks reads Apple Health: walk your steps or log a workout and the habit completes itself.' },
    ],
  },
  {
    title: 'Working with others',
    rows: [
      { s: 'Billing clients by the hour', fit: { toggl: 3, clockify: 3, rescuetime: 1, clickup: 2 }, why: 'Projects, rates and exportable reports — Toggl for polish, Clockify for unlimited free seats.' },
      { s: 'Team timesheets on a zero budget', fit: { toggl: 1, clockify: 3, clickup: 1 }, why: 'Clockify’s free plan covers unlimited users.' },
      { s: 'Shared wiki and docs', fit: { applenotes: 1, obsidian: 1, notion: 3, linear: 1, clickup: 2 }, why: 'Real-time editing, permissions and search across the team: Notion’s home turf.' },
      { s: 'Sprints and issue tracking', fit: { notion: 2, todoist: 1, linear: 3, clickup: 2 }, why: 'Linear is built for it; Notion databases work for lighter needs.' },
      { s: 'Shared family / household lists', fit: { applenotes: 3, notion: 2, things: 1, todoist: 3, clickup: 1, habitica: 1 }, why: 'Lowest friction for non-techy people: a shared Apple Note or Todoist project.' },
      { s: 'Habits with an accountability buddy', fit: { habitica: 3 }, why: 'Habitica parties share quests: skip your dailies and the whole party takes damage.' },
    ],
  },
]

// Sequential blue, stepped for the dark surface: brighter = better fit.
const FILL = ['#232322', '#184f95', '#2a78d6', '#86b6ef']
const INK = ['#898781', '#f0efec', '#ffffff', '#0b0b0b']
const WORD = ['—', 'meh', 'good', 'great']

export function FitMatrix() {
  const [hover, setHover] = useState<Row | null>(null)
  const [goal, setGoal] = useState<Goal | 'all'>('all')

  const ids = TOOL_IDS.filter((id) => goal === 'all' || TOOLS[id].goals.includes(goal))
  // Header groups: runs of tools sharing a primary goal (or the one filtered goal).
  const groupOf = (id: ToolId) => (goal === 'all' ? TOOLS[id].goals[0] : goal)
  const groups: { goal: Goal; span: number }[] = []
  for (const id of ids) {
    const last = groups.at(-1)
    if (last?.goal === groupOf(id)) last.span++
    else groups.push({ goal: groupOf(id), span: 1 })
  }
  const starts = new Set(groups.slice(1).map((_, k) => groups.slice(0, k + 1).reduce((n, g) => n + g.span, 0)))
  const gap = (j: number) => (starts.has(j) ? 'pl-3' : '')
  const visible = (r: Row) => ids.some((id) => r.fit[id])

  return (
    <div className="rounded-xl bg-surface p-4 ring-1 ring-white/10">
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-page p-1 ring-1 ring-white/10 sm:inline-flex" role="group" aria-label="Show tools for">
        {(['all', ...Object.keys(GOALS)] as (Goal | 'all')[]).map((g) => (
          <button
            key={g}
            aria-pressed={goal === g}
            onClick={() => setGoal(g)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${goal === g ? 'bg-ink text-page' : 'text-ink-2 hover:bg-raised'}`}
          >
            {g !== 'all' && <span className="size-2 rounded-full" style={{ background: GOALS[g].color }} />}
            {g === 'all' ? 'All tools' : GOALS[g].name}
          </button>
        ))}
      </div>
      {/* A scroll container would trap the sticky header, so it only scrolls sideways where the table doesn’t fit. */}
      <div className="overflow-x-auto xl:overflow-visible">
        <table className={`w-full border-separate border-spacing-[2px] text-sm ${goal === 'all' ? 'min-w-[1000px]' : ''}`}>
          <thead className="sticky top-0 z-10 bg-surface [&_th]:bg-surface">
            <tr>
              <th />
              {groups.map((g, k) => (
                <th key={`${g.goal}-${k}`} colSpan={g.span} className={`pb-1 align-bottom ${k ? 'pl-3' : ''}`}>
                  <span className="block border-b-2 pb-1 text-[11px] font-normal tracking-wide whitespace-nowrap text-muted uppercase" style={{ borderColor: GOALS[g.goal].color }}>
                    {GOALS[g.goal].name}
                  </span>
                </th>
              ))}
            </tr>
            <tr>
              <th className="min-w-[12rem] text-left align-bottom font-normal text-muted">If this sounds like you…</th>
              {ids.map((id, j) => (
                <th key={id} className={`w-[3.9rem] pt-2 pb-2 text-center text-[11px] leading-tight font-medium text-ink ${gap(j)}`}>
                  <ToolIcon id={id} size={18} className="mx-auto mb-1" />
                  {TOOLS[id].name}
                </th>
              ))}
            </tr>
          </thead>
          {ROW_GROUPS.filter((g) => g.rows.some(visible)).map((g) => (
            <tbody key={g.title}>
              <tr>
                <td colSpan={ids.length + 1} className="pt-4 pb-1 text-xs font-medium tracking-wide text-muted uppercase">
                  {g.title}
                </td>
              </tr>
              {g.rows.filter(visible).map((r) => (
                <tr
                  key={r.s}
                  tabIndex={0}
                  onMouseEnter={() => setHover(r)}
                  onFocus={() => setHover(r)}
                  onMouseLeave={() => setHover(null)}
                  className="outline-none"
                >
                  <td className={`py-1 pr-3 transition-colors ${hover === r ? 'text-ink' : 'text-ink-2'}`}>{r.s}</td>
                  {ids.map((id, j) => {
                    const f = r.fit[id] ?? 0
                    return (
                      <td key={id} className={`p-0 ${gap(j)}`}>
                        <div
                          className="rounded-[4px] py-1 text-center text-xs font-medium transition-[filter]"
                          style={{ background: FILL[f], color: INK[f], filter: hover === null || hover === r ? 'none' : 'brightness(0.6)' }}
                        >
                          {WORD[f]}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <p className="mt-4 min-h-10 text-sm text-ink-2" aria-live="polite">
        {hover ? hover.why : <span className="text-muted">Hover a row to see why. Filter by job to compare just those tools.</span>}
      </p>
    </div>
  )
}
