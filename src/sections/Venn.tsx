import { useState } from 'react'
import { ToolIcon } from '../ToolIcon.tsx'
import { GOALS, TOOL_IDS, TOOLS, type Goal, type ToolId } from '../tools.ts'

const W = 760
const H = 610
const ORDER: Goal[] = ['time', 'notes', 'tasks', 'habits']

// Drawn from the data's actual overlaps: Tasks is the hub; Time touches only Tasks.
const CIRCLES: Record<Goal, { cx: number; cy: number; r: number; label: { x: number; y: number; anchor: 'start' | 'middle' | 'end' } }> = {
  notes: { cx: 290, cy: 185, r: 120, label: { x: 250, y: 42, anchor: 'middle' } },
  habits: { cx: 470, cy: 185, r: 120, label: { x: 510, y: 42, anchor: 'middle' } },
  tasks: { cx: 380, cy: 290, r: 160, label: { x: 205, y: 340, anchor: 'end' } },
  time: { cx: 380, cy: 500, r: 90, label: { x: 485, y: 530, anchor: 'start' } },
}

// Slots per region (key = the tool's goals in ORDER), filled in TOOL_IDS order.
const SLOTS: Record<string, [number, number][]> = {
  notes: [[215, 135], [235, 215]],
  habits: [[545, 100], [585, 168], [545, 236], [510, 110]],
  tasks: [[300, 375], [380, 368], [460, 375], [330, 330]],
  time: [[325, 520], [380, 548], [435, 520]],
  'notes+tasks': [[290, 238], [322, 292]],
  'tasks+habits': [[460, 270], [460, 320]],
  'notes+tasks+habits': [[380, 160], [380, 222]],
  'time+tasks': [[380, 438]],
}

const keyOf = (id: ToolId) => ORDER.filter((g) => TOOLS[id].goals.includes(g)).join('+')
const POS = {} as Record<ToolId, [number, number]>
const used: Record<string, number> = {}
for (const id of TOOL_IDS) {
  const k = keyOf(id)
  const slot = SLOTS[k]?.[used[k] ?? 0]
  // Fail loudly: a new goal combination or a full region needs a slot above.
  if (!slot) throw new Error(`Venn: no slot for ${id} in region "${k}"`)
  used[k] = (used[k] ?? 0) + 1
  POS[id] = slot
}

export function Venn() {
  const [active, setActive] = useState<ToolId | null>(null)
  const on = (g: Goal) => active !== null && TOOLS[active].goals.includes(g)

  return (
    <div className="rounded-xl bg-surface p-3 ring-1 ring-white/10">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-3xl" role="img" aria-label="Venn diagram of which jobs each tool covers">
        {ORDER.map((g) => {
          const c = CIRCLES[g]
          return (
            <g key={g}>
              <circle
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill={GOALS[g].color}
                fillOpacity={on(g) ? 0.2 : 0.08}
                stroke={GOALS[g].color}
                strokeWidth={on(g) ? 2.5 : 1.5}
                className="transition-all duration-200"
              />
              <text x={c.label.x} y={c.label.y} textAnchor={c.label.anchor} fontSize={15} fontWeight={600} fill={GOALS[g].color}>
                {GOALS[g].name}
              </text>
              <text x={c.label.x} y={c.label.y + 17} textAnchor={c.label.anchor} fontSize={12} fill="#c3c2b7">
                “{GOALS[g].question}”
              </text>
            </g>
          )
        })}

        {TOOL_IDS.map((id) => {
          const [x, y] = POS[id]
          const hot = active === id
          return (
            <g
              key={id}
              tabIndex={0}
              role="button"
              aria-label={`${TOOLS[id].name}: ${TOOLS[id].goals.map((g) => GOALS[g].name).join(', ')}`}
              onMouseEnter={() => setActive(id)}
              onFocus={() => setActive(id)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none"
              opacity={active === null || hot ? 1 : 0.45}
            >
              <circle cx={x} cy={y} r={hot ? 17 : 15} fill="#1a1a19" stroke={hot ? '#f0efec' : '#383835'} strokeWidth={1.5} className="transition-all duration-200" />
              <ToolIcon id={id} size={18} x={x - 9} y={y - 9} />
              <text x={x} y={y + 28} fontSize={11} fontWeight={600} fill="#f0efec" textAnchor="middle" paintOrder="stroke" stroke="#1a1a19" strokeWidth={3}>
                {TOOLS[id].name}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="min-h-6 px-2 pb-1 text-center text-sm text-ink-2" aria-live="polite">
        {active ? (
          <>
            <b className="text-ink">{TOOLS[active].name}</b> covers {TOOLS[active].goals.map((g) => GOALS[g].name.toLowerCase()).join(' + ')} — {TOOLS[active].tagline}
          </>
        ) : (
          <span className="text-muted">Hover a tool to see which jobs it covers. Overlaps are all-in-ones; everything else does one job well.</span>
        )}
      </p>
    </div>
  )
}
