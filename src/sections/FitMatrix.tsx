import { useState } from 'react'
import { ToolIcon } from '../ToolIcon.tsx'
import { GOALS, TOOL_IDS, TOOLS } from '../tools.ts'

type Fit = 0 | 1 | 2 | 3
// order follows TOOL_IDS: toggl, clockify, rescuetime, applenotes, obsidian, logseq, notion, things, todoist, linear, clickup, lunatask, griply
type Row = { s: string; fit: [Fit, Fit, Fit, Fit, Fit, Fit, Fit, Fit, Fit, Fit, Fit, Fit, Fit]; why: string }

const ROW_GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: 'How your brain works (solo)',
    rows: [
      { s: 'I forget to start the timer', fit: [2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], why: 'RescueTime needs no remembering at all; Toggl nudges you when it notices activity with no timer running.' },
      { s: 'I lose thoughts before I write them down', fit: [0, 0, 0, 3, 1, 3, 1, 3, 3, 1, 1, 2, 2], why: 'Instant capture wins: Apple Notes, Logseq’s daily page, Things / Todoist quick add. Sort it later — or never.' },
      { s: 'Too many options freeze me', fit: [3, 2, 3, 3, 1, 2, 0, 3, 3, 2, 0, 2, 1], why: 'Opinionated tools decide the structure for you. Notion’s blank page is the opposite.' },
      { s: 'I build systems instead of doing the work', fit: [3, 2, 3, 3, 1, 2, 0, 3, 2, 2, 0, 2, 1], why: 'If tweaking feels productive but isn’t, pick a tool with little to tweak. Obsidian and Notion are bottomless.' },
      { s: 'Tracking every minute makes me anxious', fit: [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], why: 'Track only what you choose to start. Automatic logs of every app can turn into a scorecard you dread.' },
      { s: 'I’m busy, but not sure it moves my goals', fit: [1, 0, 1, 0, 1, 1, 2, 1, 1, 0, 2, 2, 3], why: 'Griply links every task and habit to a goal and life area, so you see what actually moves you forward. Notion or ClickUp can do it if you build the system yourself.' },
      { s: 'I feel calmer with everything in one place', fit: [1, 1, 0, 1, 3, 2, 3, 2, 2, 1, 3, 3, 2], why: 'Notion or Obsidian can hold notes, tasks and dashboards together — worth the setup if it lowers the mental load.' },
      { s: 'I worry about where my data goes', fit: [1, 1, 0, 2, 3, 3, 0, 2, 1, 0, 0, 3, 1], why: 'Obsidian and Logseq keep plain files on your disk; Lunatask encrypts end to end so even they can’t read it.' },
    ],
  },
  {
    title: 'Working with others',
    rows: [
      { s: 'Billing clients by the hour', fit: [3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0], why: 'Projects, rates and exportable reports — Toggl for polish, Clockify for unlimited free seats.' },
      { s: 'Team timesheets on a zero budget', fit: [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], why: 'Clockify’s free plan covers unlimited users.' },
      { s: 'Shared wiki and docs', fit: [0, 0, 0, 1, 1, 0, 3, 0, 0, 1, 2, 0, 0], why: 'Real-time editing, permissions and search across the team: Notion’s home turf.' },
      { s: 'Sprints and issue tracking', fit: [0, 0, 0, 0, 0, 0, 2, 0, 1, 3, 2, 0, 0], why: 'Linear is built for it; Notion databases work for lighter needs.' },
      { s: 'Shared family / household lists', fit: [0, 0, 0, 3, 0, 0, 2, 1, 3, 0, 1, 0, 0], why: 'Lowest friction for non-techy people: a shared Apple Note or Todoist project.' },
    ],
  },
]
const ROWS = ROW_GROUPS.flatMap((g) => g.rows)

// Columns follow TOOL_IDS order, grouped by primary goal.
const COL_GROUPS = [
  { title: GOALS.time.name, color: GOALS.time.color, span: 3 },
  { title: GOALS.notes.name, color: GOALS.notes.color, span: 4 },
  { title: GOALS.tasks.name, color: GOALS.tasks.color, span: 6 },
]
const GROUP_STARTS = new Set([3, 7])
const gap = (j: number) => (GROUP_STARTS.has(j) ? 'pl-3' : '')

// Sequential blue, stepped for the dark surface: brighter = better fit.
const FILL = ['#232322', '#184f95', '#2a78d6', '#86b6ef']
const INK = ['#898781', '#f0efec', '#ffffff', '#0b0b0b']
const WORD = ['—', 'meh', 'good', 'great']

export function FitMatrix() {
  const [hover, setHover] = useState<number | null>(null)
  const row = hover === null ? null : ROWS[hover]

  return (
    <div className="rounded-xl bg-surface p-4 ring-1 ring-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-separate border-spacing-[2px] text-sm">
          <thead>
            <tr>
              <th />
              {COL_GROUPS.map((g, k) => (
                <th key={g.title} colSpan={g.span} className={`pb-1 align-bottom ${k ? 'pl-3' : ''}`}>
                  <span className="block border-b-2 pb-1 text-[11px] font-normal tracking-wide whitespace-nowrap text-muted uppercase" style={{ borderColor: g.color }}>
                    {g.title}
                  </span>
                </th>
              ))}
            </tr>
            <tr>
              <th className="text-left align-bottom font-normal text-muted">If this sounds like you…</th>
              {TOOL_IDS.map((id, j) => (
                <th key={id} className={`w-[4.25rem] pt-2 pb-2 text-center text-xs font-medium text-ink ${gap(j)}`}>
                  <ToolIcon id={id} size={18} className="mx-auto mb-1" />
                  {TOOLS[id].name}
                </th>
              ))}
            </tr>
          </thead>
          {ROW_GROUPS.map((g) => (
            <tbody key={g.title}>
              <tr>
                <td colSpan={TOOL_IDS.length + 1} className="pt-4 pb-1 text-xs font-medium tracking-wide text-muted uppercase">
                  {g.title}
                </td>
              </tr>
              {g.rows.map((r) => {
                const i = ROWS.indexOf(r)
                return (
                  <tr
                    key={r.s}
                    tabIndex={0}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    className="outline-none"
                  >
                    <td className={`py-1 pr-3 transition-colors ${hover === i ? 'text-ink' : 'text-ink-2'}`}>{r.s}</td>
                    {r.fit.map((f, j) => (
                      <td key={j} className={`p-0 ${gap(j)}`}>
                        <div
                          className="rounded-[4px] py-1 text-center text-xs font-medium transition-[filter]"
                          style={{ background: FILL[f], color: INK[f], filter: hover === null || hover === i ? 'none' : 'brightness(0.6)' }}
                        >
                          {WORD[f]}
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          ))}
        </table>
      </div>
      <p className="mt-4 min-h-10 text-sm text-ink-2" aria-live="polite">
        {row ? row.why : <span className="text-muted">Hover a row to see why.</span>}
      </p>
    </div>
  )
}
