import { useState } from 'react'
import { ToolIcon } from '../ToolIcon.tsx'
import { colorOf, GOALS, TOOL_IDS, TOOLS, type Goal, type ToolId } from '../tools.ts'

const W = 760
const H = 470
const M = { l: 70, r: 24, t: 24, b: 56 }
const pw = W - M.l - M.r
const ph = H - M.t - M.b
const X = (v: number) => M.l + v * pw
const Y = (v: number) => M.t + (1 - v) * ph
// Data points are inset so circles and labels clear the axes.
const PX = (v: number) => X(0.06 + v * 0.88)
const PY = (v: number) => Y(0.12 + v * 0.8)

export function Landscape({ marker }: { marker: { x: number; y: number } }) {
  const [active, setActive] = useState<ToolId>('obsidian')
  const tool = TOOLS[active]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)]">
      <div className="rounded-xl bg-surface p-3 ring-1 ring-white/10">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Map of tools by structure and setup effort">
          {/* "rabbit hole" zone: high setup, where systems become procrastination */}
          <rect x={X(0)} y={Y(1)} width={pw} height={Y(0.7) - Y(1)} fill="#d95926" fillOpacity={0.05} />
          <text x={X(0.01)} y={Y(0.96)} fontSize={11} fill="#898781" letterSpacing="0.08em">
            TINKER ZONE · great for builders, a trap if setup replaces doing
          </text>
          <rect x={X(0)} y={Y(0.3)} width={pw} height={Y(0) - Y(0.3)} fill="#199e70" fillOpacity={0.05} />
          <text x={X(0.99)} y={Y(0.03)} fontSize={11} fill="#898781" letterSpacing="0.08em" textAnchor="end">
            OPEN AND GO · few decisions
          </text>

          {[0.25, 0.5, 0.75].map((v) => (
            <g key={v}>
              <line x1={X(v)} x2={X(v)} y1={M.t} y2={M.t + ph} stroke="#2c2c2a" />
              <line x1={M.l} x2={M.l + pw} y1={Y(v)} y2={Y(v)} stroke="#2c2c2a" />
            </g>
          ))}
          <line x1={M.l} x2={M.l + pw} y1={M.t + ph} y2={M.t + ph} stroke="#383835" />
          <line x1={M.l} x2={M.l} y1={M.t} y2={M.t + ph} stroke="#383835" />

          {[
            [0, 'Freeform', 'start'],
            [1, 'Structured', 'end'],
          ].map(([v, t, a]) => (
            <text key={t} x={X(v as number)} y={H - 32} fontSize={12} fill="#898781" textAnchor={a as 'start'}>
              {t}
            </text>
          ))}
          <text x={X(0.5)} y={H - 10} fontSize={12} fill="#c3c2b7" textAnchor="middle">Structure →</text>
          {[
            [0.04, 'none'],
            [0.96, 'lots'],
          ].map(([v, t]) => (
            <text key={t} x={M.l - 10} y={Y(v as number) + 4} fontSize={12} fill="#898781" textAnchor="end">
              {t}
            </text>
          ))}
          <text transform={`translate(22 ${Y(0.5)}) rotate(-90)`} fontSize={12} fill="#c3c2b7" textAnchor="middle">
            Setup effort →
          </text>

          {TOOL_IDS.map((id) => {
            const t = TOOLS[id]
            const on = active === id
            const cx = PX(t.structure)
            const cy = PY(t.setup)
            return (
              <g
                key={id}
                tabIndex={0}
                role="button"
                aria-label={t.name}
                onMouseEnter={() => setActive(id)}
                onFocus={() => setActive(id)}
                onClick={() => setActive(id)}
                className="cursor-pointer outline-none"
              >
                <circle cx={cx} cy={cy} r={on ? 22 : 18} fill="#1a1a19" stroke={colorOf(id)} strokeWidth={on ? 3 : 2} className="transition-all duration-200" />
                <ToolIcon id={id} size={18} x={cx - 9} y={cy - 9} />
                <text x={cx} y={cy + 36} fontSize={13} fontWeight={600} fill={on ? '#f0efec' : '#c3c2b7'} textAnchor="middle" paintOrder="stroke" stroke="#1a1a19" strokeWidth={4}>
                  {t.name}
                </text>
              </g>
            )
          })}

          {/* "you" marker driven by the chooser */}
          <g style={{ transform: `translate(${PX(marker.x)}px, ${PY(marker.y)}px)`, transition: 'transform 500ms cubic-bezier(.2,.8,.2,1)' }} className="pointer-events-none">
            <circle r={14} fill="none" stroke="#f0efec" strokeOpacity={0.4} strokeWidth={2} strokeDasharray="4 3" />
            <circle r={5} fill="#f0efec" stroke="#1a1a19" strokeWidth={2} />
            <text y={-20} fontSize={12} fill="#f0efec" fontWeight={600} textAnchor="middle" paintOrder="stroke" stroke="#1a1a19" strokeWidth={4}>you</text>
          </g>
        </svg>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 px-2 pb-1 text-xs text-muted">
          {(Object.keys(GOALS) as Goal[]).map((g) => (
            <li key={g} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: GOALS[g].color }} />
              {GOALS[g].name}
            </li>
          ))}
        </ul>
      </div>

      <aside className="rounded-xl bg-surface p-5 ring-1 ring-white/10" aria-live="polite">
        <div className="flex items-center gap-2">
          <ToolIcon id={active} size={20} />
          <h3 className="text-lg font-semibold">{tool.name}</h3>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted">
          {tool.goals.map((g) => GOALS[g].name).join(' · ')} — {tool.platforms}
        </p>
        <p className="mt-3 text-ink-2">{tool.tagline}</p>
        <h4 className="mt-5 text-sm font-medium text-ink">Reach for it when</h4>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
          {tool.use.map((u) => (
            <li key={u} className="flex gap-2"><span className="text-[#0ca30c]">✓</span>{u}</li>
          ))}
        </ul>
        <h4 className="mt-5 text-sm font-medium text-ink">Avoid for</h4>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
          {tool.avoid.map((u) => (
            <li key={u} className="flex gap-2"><span className="text-[#e66767]">✕</span>{u}</li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted">Hover or tab through the map to switch.</p>
      </aside>
    </div>
  )
}
